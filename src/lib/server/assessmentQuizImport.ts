import "server-only";

import mammoth from "mammoth";

export type ImportedQuizQuestion = {
  question_text: string;
  type: "short_answer" | "paragraph" | "multiple_choice" | "check_boxes" | "true_false";
  correct_answer: number | number[] | null;
  marks: number;
  options?: string[];
  needsReview?: boolean;
  reviewNote?: string | null;
  sourceNumber?: number | null;
};

type ParsedOption = {
  label: string | null;
  text: string;
  markedCorrect: boolean;
};

type QuestionBlock = {
  number: number | null;
  lines: string[];
};

const TRUE_FALSE_REGEX = /\b(true\s*\/\s*false|true\s+or\s+false|t\s*\/\s*f|t\.f\.)\b/i;
const MULTI_ANSWER_REGEX = /\b(select all|choose all|all that apply|more than one|choose two|choose three|multiple answers?)\b/i;
const LONG_FORM_REGEX = /^(explain|describe|discuss|analyse|analyze|evaluate|compare|why|how|write|assessment)\b/i;
const ANSWER_KEY_HEADING_REGEX = /^(answer\s*key|answers|mark\s*scheme|model\s*answers?)\s*:?$/i;
const INLINE_ANSWER_REGEX = /^(answer|answers|correct answer|correct answers|correct)\s*[:\-]\s*(.+)$/i;

const normalizeExtractedText = (input: string) =>
  String(input ?? "")
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[\u2022\u25cf\u25aa\u25cb\u25e6]/g, "- ")
    .replace(/\t/g, " ")
    .replace(/\f/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const parseMarks = (text: string) => {
  const inlineMatch = text.match(/(?:\(|\[)?(\d+(?:\.\d+)?)\s*marks?(?:\)|\])?/i);
  if (!inlineMatch) return 1;
  return Math.max(1, Number(inlineMatch[1]));
};

const stripMarksLabel = (text: string) =>
  String(text ?? "")
    .replace(/(?:\(|\[)?\d+(?:\.\d+)?\s*marks?(?:\)|\])?/gi, "")
    .replace(/[ ]{2,}/g, " ")
    .trim();

const extractQuestionHeader = (line: string) => {
  const match = String(line ?? "").match(/^\s*(?:q(?:uestion)?\s*)?(\d+)[\).:-]?\s*(.+)$/i);
  if (!match) {
    return {
      number: null,
      questionText: stripMarksLabel(String(line ?? "").trim()),
      marks: parseMarks(line),
    };
  }

  return {
    number: Number(match[1]),
    questionText: stripMarksLabel(match[2].trim()),
    marks: parseMarks(match[2]),
  };
};

const isQuestionStartLine = (line: string) => /^\s*(?:q(?:uestion)?\s*)?\d+[\).:-]\s*.+$/i.test(line.trim());

const splitAnswerKey = (lines: string[]) => {
  const answerHeadingIndex = lines.findIndex((line) => ANSWER_KEY_HEADING_REGEX.test(line.trim()));
  if (answerHeadingIndex === -1) {
    return {
      questionLines: lines,
      answerLookup: new Map<number, string>(),
    };
  }

  const answerLookup = new Map<number, string>();
  for (const line of lines.slice(answerHeadingIndex + 1)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(?:q(?:uestion)?\s*)?(\d+)[\).:-]?\s*(.+)$/i);
    if (!match) continue;
    answerLookup.set(Number(match[1]), match[2].trim());
  }

  return {
    questionLines: lines.slice(0, answerHeadingIndex),
    answerLookup,
  };
};

const extractQuestionBlocks = (lines: string[]) => {
  const blocks: QuestionBlock[] = [];
  let currentLines: string[] = [];
  let currentNumber: number | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentLines.length > 0) {
        currentLines.push("");
      }
      continue;
    }

    if (isQuestionStartLine(trimmed)) {
      if (currentLines.length > 0) {
        blocks.push({ number: currentNumber, lines: currentLines.filter(Boolean) });
      }

      const header = extractQuestionHeader(trimmed);
      currentLines = [trimmed];
      currentNumber = header.number;
      continue;
    }

    if (currentLines.length > 0) {
      currentLines.push(trimmed);
    }
  }

  if (currentLines.length > 0) {
    blocks.push({ number: currentNumber, lines: currentLines.filter(Boolean) });
  }

  if (blocks.length > 0) return blocks;

  return lines
    .join("\n")
    .split(/\n\s*\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk, index) => ({ number: index + 1, lines: chunk.split("\n").map((line) => line.trim()).filter(Boolean) }));
};

const parseOptionLine = (line: string): ParsedOption | null => {
  const trimmed = String(line ?? "").trim();
  if (!trimmed) return null;

  const plainBooleanMatch = trimmed.match(/^(\*|\[x\]|✅)?\s*(true|false)\s*$/i);
  if (plainBooleanMatch) {
    return {
      label: plainBooleanMatch[2].toLowerCase(),
      text: plainBooleanMatch[2][0].toUpperCase() + plainBooleanMatch[2].slice(1).toLowerCase(),
      markedCorrect: Boolean(plainBooleanMatch[1]),
    };
  }

  const match = trimmed.match(/^(\*|\[x\]|✅)?\s*(?:[-]\s*)?(?:([A-Ha-h])|(\d+))[\).:-]\s*(.+)$/);
  if (!match) return null;

  return {
    label: (match[2] ?? match[3] ?? "").toLowerCase(),
    text: match[4].trim(),
    markedCorrect: Boolean(match[1]),
  };
};

const normalizeAnswerToken = (token: string) =>
  String(token ?? "")
    .trim()
    .toLowerCase()
    .replace(/^option\s+/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokenizeAnswerText = (answerText: string) =>
  String(answerText ?? "")
    .split(/[,/;&]|\band\b/gi)
    .map(normalizeAnswerToken)
    .filter(Boolean);

const resolveCorrectIndexes = (answerText: string | null, options: ParsedOption[]) => {
  const markedIndexes = options.reduce<number[]>((indexes, option, index) => {
    if (option.markedCorrect) indexes.push(index);
    return indexes;
  }, []);

  if (markedIndexes.length > 0) return markedIndexes;
  if (!answerText) return [];

  const tokens = tokenizeAnswerText(answerText);
  if (!tokens.length) return [];

  const optionMap = new Map<string, number>();
  options.forEach((option, index) => {
    optionMap.set(normalizeAnswerToken(option.text), index);
    if (option.label) optionMap.set(normalizeAnswerToken(option.label), index);
    optionMap.set(String(index + 1), index);
  });

  const resolved = tokens.reduce<number[]>((indexes, token) => {
    if (!optionMap.has(token)) return indexes;
    const optionIndex = optionMap.get(token);
    if (optionIndex == null || indexes.includes(optionIndex)) return indexes;
    indexes.push(optionIndex);
    return indexes;
  }, []);

  return resolved;
};

const inferWrittenType = (questionText: string) => {
  const trimmed = String(questionText ?? "").trim();
  if (LONG_FORM_REGEX.test(trimmed) || trimmed.length > 120) {
    return "paragraph" as const;
  }
  return "short_answer" as const;
};

const parseQuestionBlock = (block: QuestionBlock, answerLookup: Map<number, string>) => {
  const [headerLine = "", ...restLines] = block.lines;
  const header = extractQuestionHeader(headerLine);
  const answerNotes: string[] = [];

  let inlineAnswer: string | null = null;
  const contentLines: string[] = [];

  for (const line of restLines) {
    const answerMatch = line.match(INLINE_ANSWER_REGEX);
    if (answerMatch) {
      inlineAnswer = answerMatch[2].trim();
      continue;
    }
    contentLines.push(line);
  }

  const answerText = inlineAnswer ?? (block.number != null ? answerLookup.get(block.number) ?? null : null);
  const parsedOptions = contentLines.map(parseOptionLine).filter((option): option is ParsedOption => Boolean(option));
  const nonOptionLines = parsedOptions.length > 0
    ? contentLines.filter((line) => !parseOptionLine(line))
    : contentLines;

  const questionText = [header.questionText, ...nonOptionLines]
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/[ ]{2,}/g, " ")
    .trim();

  if (!questionText) {
    return null;
  }

  const options = parsedOptions.map((option) => option.text);
  const looksTrueFalse = TRUE_FALSE_REGEX.test(questionText) || (options.length === 2 && options.every((option) => ["true", "false"].includes(option.toLowerCase())));

  if (looksTrueFalse) {
    const cleanedTrueFalseQuestion = questionText
      .replace(TRUE_FALSE_REGEX, "")
      .replace(/^[\s:;,.\-]+/, "")
      .replace(/[ ]{2,}/g, " ")
      .trim();
    const normalizedAnswer = normalizeAnswerToken(answerText ?? "");
    let correctAnswer: number | null = null;
    if (normalizedAnswer === "true" || normalizedAnswer === "t") correctAnswer = 1;
    if (normalizedAnswer === "false" || normalizedAnswer === "f") correctAnswer = 0;
    if (correctAnswer == null && parsedOptions.some((option) => option.markedCorrect)) {
      const marked = parsedOptions.find((option) => option.markedCorrect);
      if (marked) {
        correctAnswer = marked.text.toLowerCase() === "true" ? 1 : 0;
      }
    }
    if (correctAnswer == null) {
      answerNotes.push("Correct answer was not found. Review this true/false question after import.");
    }

    return {
      question_text: cleanedTrueFalseQuestion || questionText,
      type: "true_false" as const,
      correct_answer: correctAnswer,
      marks: header.marks,
      options: ["True", "False"],
      needsReview: correctAnswer == null,
      reviewNote: answerNotes[0] ?? null,
      sourceNumber: block.number,
    };
  }

  if (options.length >= 2) {
    const correctIndexes = resolveCorrectIndexes(answerText, parsedOptions);
    const isMultipleAnswer = MULTI_ANSWER_REGEX.test(questionText) || correctIndexes.length > 1;

    if (correctIndexes.length === 0) {
      answerNotes.push("Correct answer was not detected. Review this question after import.");
    }

    return {
      question_text: questionText,
      type: isMultipleAnswer ? "check_boxes" : "multiple_choice",
      correct_answer: correctIndexes.length === 0 ? null : isMultipleAnswer ? correctIndexes : correctIndexes[0],
      marks: header.marks,
      options,
      needsReview: correctIndexes.length === 0,
      reviewNote: answerNotes[0] ?? null,
      sourceNumber: block.number,
    };
  }

  return {
    question_text: questionText,
    type: inferWrittenType(questionText),
    correct_answer: null,
    marks: header.marks,
    needsReview: false,
    reviewNote: null,
    sourceNumber: block.number,
  };
};

export const extractAssessmentText = async (file: File) => {
  const fileName = String(file.name ?? "assessment");
  const lowerName = fileName.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (lowerName.endsWith(".doc")) {
    throw new Error("Legacy .doc files are not supported yet. Save the file as .docx or PDF and upload again.");
  }

  if (lowerName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    return {
      text: normalizeExtractedText(result.value),
      warnings: result.messages.map((message) => message.message).filter(Boolean),
    };
  }

  if (lowerName.endsWith(".pdf")) {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = ((pdfParseModule as { default?: unknown }).default ?? pdfParseModule) as (
      data: Buffer | Uint8Array
    ) => Promise<{ text: string }>;
    const result = await pdfParse(buffer);
    const text = normalizeExtractedText(result.text);
    if (!text) {
      throw new Error("This PDF did not return readable text. It may be a scanned PDF. Try a text-based PDF or save it as .docx.");
    }
    return {
      text,
      warnings: [],
    };
  }

  if (lowerName.endsWith(".txt")) {
    return {
      text: normalizeExtractedText(buffer.toString("utf8")),
      warnings: [],
    };
  }

  throw new Error("Unsupported file type. Upload a .docx, .pdf, or .txt assessment.");
};

export const generateQuestionsFromAssessmentText = (rawText: string) => {
  const normalizedText = normalizeExtractedText(rawText);
  if (!normalizedText) {
    throw new Error("The uploaded file did not contain readable text.");
  }

  const rawLines = normalizedText.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  const { questionLines, answerLookup } = splitAnswerKey(rawLines);
  const blocks = extractQuestionBlocks(questionLines);

  const warnings: string[] = [];
  const questions = blocks
    .map((block) => parseQuestionBlock(block, answerLookup))
    .filter((question): question is ImportedQuizQuestion => Boolean(question));

  if (!questions.length) {
    throw new Error("No questions were detected in this file. Use numbered questions like 1. ... 2. ... for best results.");
  }

  const needsReviewCount = questions.filter((question) => question.needsReview).length;
  if (needsReviewCount > 0) {
    warnings.push(`${needsReviewCount} generated question${needsReviewCount === 1 ? " needs" : "s need"} answer review after import.`);
  }

  return {
    questions,
    warnings,
    normalizedText,
  };
};
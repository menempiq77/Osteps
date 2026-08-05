import { describe, expect, it } from "vitest";
import { normalizeIncidentContext } from "@/lib/quizIncident";

describe("quiz incident normalization", () => {
  it("preserves supported incident contexts", () => {
    expect(normalizeIncidentContext("screen")).toBe("screen");
    expect(normalizeIncidentContext("leave")).toBe("leave");
  });

  it("defaults unknown payloads to fullscreen", () => {
    expect(normalizeIncidentContext("fullscreen")).toBe("fullscreen");
    expect(normalizeIncidentContext("unknown")).toBe("fullscreen");
    expect(normalizeIncidentContext(null)).toBe("fullscreen");
  });
});

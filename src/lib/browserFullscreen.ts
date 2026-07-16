type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

const getCurrentFullscreenElement = (doc: FullscreenCapableDocument) =>
  doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement ?? null;

export const isDocumentFullscreenActive = () => {
  if (typeof document === "undefined") return false;
  return Boolean(getCurrentFullscreenElement(document as FullscreenCapableDocument));
};

export const isDocumentFullscreenSupported = () => {
  if (typeof document === "undefined") return false;
  const fullscreenTarget = document.documentElement as FullscreenCapableElement;
  return Boolean(
    fullscreenTarget.requestFullscreen ||
      fullscreenTarget.webkitRequestFullscreen ||
      fullscreenTarget.msRequestFullscreen,
  );
};

export const requestDocumentFullscreenFromGesture = async (): Promise<boolean> => {
  if (typeof document === "undefined") return false;

  const fullscreenDocument = document as FullscreenCapableDocument;
  const fullscreenTarget = fullscreenDocument.documentElement as FullscreenCapableElement;

  if (getCurrentFullscreenElement(fullscreenDocument) === fullscreenTarget) {
    return true;
  }

  if (
    !fullscreenTarget.requestFullscreen &&
    !fullscreenTarget.webkitRequestFullscreen &&
    !fullscreenTarget.msRequestFullscreen
  ) {
    return false;
  }

  try {
    if (fullscreenTarget.requestFullscreen) {
      try {
        await fullscreenTarget.requestFullscreen({ navigationUI: "hide" } as FullscreenOptions);
      } catch {
        await fullscreenTarget.requestFullscreen();
      }
    } else if (fullscreenTarget.webkitRequestFullscreen) {
      await Promise.resolve(fullscreenTarget.webkitRequestFullscreen());
    } else if (fullscreenTarget.msRequestFullscreen) {
      await Promise.resolve(fullscreenTarget.msRequestFullscreen());
    }
  } catch {
    return Boolean(getCurrentFullscreenElement(fullscreenDocument));
  }

  return Boolean(getCurrentFullscreenElement(fullscreenDocument));
};

export const exitDocumentFullscreenIfActive = async (): Promise<void> => {
  if (typeof document === "undefined") return;

  const fullscreenDocument = document as FullscreenCapableDocument;
  if (!getCurrentFullscreenElement(fullscreenDocument)) return;

  try {
    if (fullscreenDocument.exitFullscreen) {
      await fullscreenDocument.exitFullscreen();
    } else if (fullscreenDocument.webkitExitFullscreen) {
      await Promise.resolve(fullscreenDocument.webkitExitFullscreen());
    } else if (fullscreenDocument.msExitFullscreen) {
      await Promise.resolve(fullscreenDocument.msExitFullscreen());
    }
  } catch {
    // Ignore browser-specific fullscreen exit failures.
  }
};
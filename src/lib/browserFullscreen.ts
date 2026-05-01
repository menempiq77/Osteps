type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

const getCurrentFullscreenElement = (doc: FullscreenCapableDocument) =>
  doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement ?? null;

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
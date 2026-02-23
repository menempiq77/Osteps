import argparse
import json
import sys
from faster_whisper import WhisperModel


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="base")
    parser.add_argument("--file", required=True)
    args = parser.parse_args()

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segments, info = model.transcribe(args.file, beam_size=5)
    text = "".join([segment.text for segment in segments]).strip()

    payload = {
        "text": text,
        "language": info.language,
        "duration": info.duration,
    }
    print(json.dumps(payload))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"message": str(exc)}))
        sys.exit(1)

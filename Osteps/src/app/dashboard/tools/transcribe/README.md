# Transcribe Tool

This page expects a backend endpoint at POST /transcribe that accepts either:
- multipart/form-data with a file field named `file`
- JSON body with a `url` field

The response should return a transcript in one of these shapes:
- { "text": "..." }
- { "data": { "text": "..." } }
- { "transcript": "..." }

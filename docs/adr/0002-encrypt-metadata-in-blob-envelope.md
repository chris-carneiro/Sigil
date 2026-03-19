# 0002 — Metadata encryption & envelope

## Status

Accepted

## Context

The `filename` and `mimeType` in clear text doesn't satisfy the level of privacy the project Sigil attempts to satisfy.
By storing metadata in clear text in the DB, Zero knowledge can't apply.
Separate encrypted columns would require the client to encrypt each field individually and send them separately. The
envelope is a single encryption operation over a structured payload.

## Decision

Instead of sending raw encrypted file bytes, the browser encrypts an envelope — a self-contained structure that carries
both the metadata and the file content. The server never sees either in plaintext.

## Consequences

- `fileName` and `mimeType` removed from the DB and from `EncryptedDocument`
- The `envelope` format must be respected by the client and server, if change is needed both sides MUST USE the same
  format.
- Remember the envelope must respect the following format:
- `Envelope` format:
  [ 4 bytes: metadata length ]
  [ N bytes: JSON metadata   ]
  [ file bytes               ]




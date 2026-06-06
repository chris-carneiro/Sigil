Here's the full picture, prioritized.

---

Bugs — fix these first [x]

1. handleFilesSelected doesn't await handleFile — unhandled rejection
   UploadPage.tsx:79. handleFile is async, called without await. The throw new Error('Invalid file name') on line 37
   fires before the try/catch and becomes an unhandled promise rejection — the error state is never dispatched, the
   UI silently hangs in encrypting.

2. encrypting state renders the wrong container
   UploadPage.tsx:91-94. Still uses <div className={styles.card}> — the old class, not <Card>. The .card class in
   UploadPage.module.css is now dead code since Card owns that styling.

---

Security review violations

3. envelope.ts:82 — catch (e: any) not fixed [x]
   Same pattern fixed everywhere else. openEnvelope still uses e: any with e.message accessed without narrowing.

4. URL.revokeObjectURL not in a finally block
   DownloadPage.tsx:45. If anything between createObjectURL and revokeObjectURL throws, the object URL leaks. Per the
   security review lens this should be in a finally. [x]

---

Design system violations

5. QRCodeSVG hardcoded hex
   UploadPage.tsx:103-104. bgColor="#F7F8F8" and fgColor="#37ACA8". Also note: #F7F8F8 doesn't match --color-bg:
   #F5F8F8 — they're different values. Intentional?

6. UploadPage.module.css .card class is dead code
   Now that Card owns the surface styling, .card in UploadPage.module.css serves nothing — delete it.

---

Missing features (per CLAUDE.md design system spec)

7. Drag-over state on SelectFile / FileDropzone — not implemented
   Currently a plain <input type="file"> with a button. The spec requires drag-and-drop with a dashed accent border
   and faint teal tint on drag-over. This is the most significant missing UI feature.

8. downloading and done states on DownloadPage — unstyled
   Both render plain <p> text. Needs a design pass.

9. encrypting state — logo animation
   Placeholder text only. Blocked on ADR for rotation vs pulse — that decision needs to happen before implementation.

Placeholder text only. Blocked on ADR for rotation vs pulse — that decision needs to happen before implementation.

---

Missing tests (tasks 9.3 and 9.4 — not started)

---

Missing tests (tasks 9.3 and 9.4 — not started)

10. Envelope roundtrip test

---

Missing tests (tasks 9.3 and 9.4 — not started)

10. Envelope roundtrip test
11. Envelope roundtrip test
    buildEnvelope → encrypt → decrypt → parseEnvelope must recover fileName, mimeType, and file bytes byte-for-byte.
    buildEnvelope → encrypt → decrypt → parseEnvelope must recover fileName, mimeType, and file bytes byte-for-byte.
    Mandatory per CLAUDE.md.

12. API boundary tests with msw
    uploadDocument and downloadDocument in api/documents.ts have no tests. msw is the approved approach.

---

Minor

- console.log("firstFile", firstFile) — UploadPage.tsx:34, remove before production
- Typo "Error spliting envelope" — envelope.ts:84, "splitting"
- DownloadPage has no exhaustive return — if the state machine somehow reaches an unhandled case the function
  returns undefined implicitly, which React will reject at runtime

---

Missing tests (tasks 9.3 and 9.4 — not started)

10. Envelope roundtrip test
    buildEnvelope → encrypt → decrypt → parseEnvelope must recover fileName, mimeType, and file bytes byte-for-byte.
    Mandatory per CLAUDE.md.

11. API boundary tests with msw
    uploadDocument and downloadDocument in api/documents.ts have no tests. msw is the approved approach.

---

Minor

- console.log("firstFile", firstFile) — UploadPage.tsx:34, remove before production
- Typo "Error spliting envelope" — envelope.ts:84, "splitting"
- DownloadPage has no exhaustive return — if the state machine somehow reaches an unhandled case the function
  returns undefined implicitly, which React will reject at runtime

---

Most impactful order to tackle: 1 → 2 → 3 → 7. Bug, bug, security, biggest missing feature.

Visual design using the design system

Think of it as a danger callout card:

- White surface (--color-surface) with a 3px left border in --color-danger
- --color-danger tint background at ~8% opacity (you'll need to use a rgba trick since there's
  no --color-danger-tint token yet — or add one)
- Top line: error code in JetBrains Mono, uppercase, letter-spacing: 2px, --color-danger color
- Second line: message in Syne 400, --color-text, line-height: 1.6
- Padding consistent with the card shell — 1.5rem

No icon in v1 — left border colour is the signal.

---

CSS Module classes you'll need

- --color-danger tint background at ~8% opacity (you'll need to use a rgba trick since there's
  no --color-danger-tint token yet — or add one)
- Top line: error code in JetBrains Mono, uppercase, letter-spacing: 2px, --color-danger color
- Second line: message in Syne 400, --color-text, line-height: 1.6
- Padding consistent with the card shell — 1.5rem

No icon in v1 — left border colour is the signal.

---

CSS Module classes you'll need

ErrorDisplay.module.css wants three things:

- .container — left border, background tint, padding, border-radius
- .code — JetBrains Mono, uppercase, letter-spacing, --color-danger
- .message — Syne, --color-text, line-height: 1.6

---

DownloadPage integration

Two changes after ErrorDisplay is built:

1. Add code: string to the error variant of DownloadState and to the failed-download action
   type
2. Replace the if (state.status == 'error') branch's <p>{state.message}</p> with <ErrorDisplay
   code={state.code} message={state.message} />

init() hardcodes message: 'This link is invalid or has expired' — give it code: 'invalid-link'
at the same time.

---

The --color-danger-tint token question is worth deciding now: either add it to variables.css
as an rgba value, or use a CSS color-mix() in the component. The token approach is cleaner and
consistent with how the rest of the palette is handled.

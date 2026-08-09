# Executive video plan: Guided billing flow

## Treatment

- **Audience:** Executive.
- **Editable assumptions:** Viewers know Acme billing settings and feature-flag rollouts, but not the code. Keep technical depth low; use the source terminology; emphasize the visible flow, unchanged scope, analytics, and rollout; exclude implementation files, unsupported outcomes, and faster-checkout language; use a neutral tone. Retain the source's “adoption and rollout confidence” framing without adding a discussion prompt.
- **Takeaway:** Three settings pages become one guided flow with a staged rollout.
- **Renderer:** Remotion, because approved screenshots, UI callouts, scope cards, and rollout stages require editorial composition. Manim would not improve this explanation because no persistent technical model must transform.
- **Duration:** 75 seconds.

## Source ledger

- **F1 — Diff:** `BillingFlow` adds review, payment, and confirmation; reuses the existing payment form and server mutation; adds entry, completion, cancellation, and success analytics; and does not change pricing, permissions, invoices, or payment processing. Mobile spacing was corrected.
- **C1 — Context:** Users complete the steps without leaving the flow. `billing_flow_v2` remains in place, with internal enablement followed by 10% of eligible workspaces. The rollout notes frame leadership discussion around adoption and rollout confidence rather than implementation files.
- **Caveat:** Reviewers rejected faster-checkout language because no performance measurement exists.

Implementation details, event schemas, unstated outcomes, recommendations, rollout criteria, and next steps are omitted.

## Timed scenes

Use each narration line verbatim for captions.

| Time | Narration and captions | Visual | On-screen text | Source |
|---|---|---|---|---|
| 0:00–0:12 | “This PR replaces three separate billing settings pages with one guided flow.” | Three approved before screenshots resolve into the approved flow | “Three pages → one flow” | F1, C1 |
| 0:12–0:27 | “Users review the current plan, update payment details, and confirm without leaving the flow.” | Highlight steps in order | “Review · Payment · Confirmation” | F1, C1 |
| 0:27–0:41 | “The existing payment form and server mutation remain in use. Payment processing does not change.” | Stable existing-payment layer under the flow | “Payment processing unchanged” | F1 |
| 0:41–0:52 | “Pricing, permissions, and invoices are unchanged. There is no measured checkout-speed claim.” | Scope cards and caveat | “No measured speed claim” | F1, caveat |
| 0:52–1:04 | “The existing flag supports internal enablement first, then ten percent of eligible workspaces.” | Internal → 10% timeline | “Internal first · Then 10%” | C1 |
| 1:04–1:15 | “The flow records entry, completion, cancellation, and success. The rollout notes frame leadership discussion around adoption and rollout confidence.” | Event labels; Acme logo close | “Adoption and rollout confidence” | F1, C1 |

## Brand treatment and approval

Use the available approved screenshots and Acme horizontal logo, preserving the logo's aspect ratio. No other brand rules were supplied; do not invent Acme colors, fonts, spacing, or variants.

Approve or revise this plan before production. No animation source or render has been created.

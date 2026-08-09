# Executive video plan: Guided billing flow

## Proposed treatment

- **Audience:** Executive.
- **Duration:** 75 seconds.
- **Renderer:** Remotion, because the available material is a set of approved UI screenshots, short scope statements, and rollout stages composed as discrete scenes. Manim is unnecessary because no continuously transforming conceptual model is needed.
- **Viewer knowledge:** Familiar with billing settings and feature-flag rollouts; no implementation knowledge assumed.
- **Takeaway:** Three billing pages become one guided flow; rollout remains staged.
- **Depth:** Product behavior and scope boundaries only.
- **Emphasis:** Flow steps, unchanged areas, analytics, and the supplied rollout sequence.
- **Exclusions:** Implementation files, faster-checkout language, and outcomes absent from the supplied export.
- **Tone:** Neutral and concise.
- **Discussion framing:** The rollout notes say this prepares leadership to discuss adoption and rollout confidence. No additional discussion prompt is proposed.

All treatment choices can be adjusted before approval without changing the supplied claims.

## Source content

- The PR description says three separate pages become one guided flow in which users review the plan, update payment details, and confirm changes.
- The diff summary says the implementation reuses the existing payment form and server mutation, adds analytics for entry, completion, cancellation, and success, and changes neither pricing, permissions, invoices, nor payment processing.
- Review discussion says `billing_flow_v2` remains in place, mobile spacing was corrected, and checkout speed is not measured.
- Rollout notes say internal enablement comes first, followed by 10% of eligible workspaces, and identify adoption and rollout confidence as the leadership discussion topics.

## Timeline and narration

| Time | Visual | Narration | Source |
|---|---|---|---|
| 0:00–0:12 | Three before screenshots resolve into one flow | “This PR replaces three separate billing settings pages with one guided flow.” | PR description and diff summary |
| 0:12–0:27 | Review, Payment, Confirmation highlight in order | “Users review the plan, update payment details, and confirm changes without leaving the flow.” | PR description and diff summary |
| 0:27–0:41 | Existing form and mutation remain beneath the new UI | “The existing payment form and server mutation remain in use. Payment processing does not change.” | Diff summary |
| 0:41–0:52 | Unchanged-scope cards | “Pricing, permissions, and invoices are also unchanged. The PR includes no measured checkout-speed claim.” | Diff summary and review discussion |
| 0:52–1:04 | Internal → 10% eligible workspaces | “The existing feature flag supports internal enablement first, then ten percent of eligible workspaces.” | Review discussion and rollout notes |
| 1:04–1:15 | Four analytics labels; Acme logo close | “The flow records entry, step completion, cancellation, and success. The rollout notes frame leadership discussion around adoption and rollout confidence.” | Diff summary and rollout notes |

## Assets and captions

Use the approved screenshots as the main visuals. Use the Acme horizontal logo without changing its aspect ratio. No other brand specification was supplied, so do not invent Acme colors, fonts, spacing rules, or logo variants. Use the narration above verbatim for timed captions; do not synthesize a voice track.

## Approval gate

Approve or revise this plan before production. No animation source or video render has been created.

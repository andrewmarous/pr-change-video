# Executive video plan: Guided billing flow

## Treatment

- **Audience:** Executive, matching the rollout notes' leadership focus.
- **Editable settings:** Assume viewers know Acme billing settings and feature flags but not the code. Keep depth at product behavior and scope boundaries. Use source terminology. Emphasize the flow, unchanged areas, analytics, and rollout. Exclude implementation files and faster-checkout language. Keep the tone neutral. Retain “adoption and rollout confidence” without adding a discussion question.
- **Takeaway:** Three settings pages become one guided flow with a staged rollout.
- **Renderer:** Remotion. The approved screenshots, UI callouts, and rollout stages call for editorial composition; Manim would add a conceptual model the source does not require.
- **Duration:** 75 seconds.
- **Brand treatment:** Use the available approved screenshots and Acme horizontal logo. Preserve its aspect ratio. No other brand specification was supplied, so do not invent Acme colors, fonts, spacing rules, or logo variants.

## Source boundary

Reviewers rejected faster-checkout wording because no performance measurement exists. No other source conflict requires an approval decision.

## Timed scenes

Use the narration verbatim for captions.

| Time | Narration and captions | Visual | On-screen text | Source |
|---|---|---|---|---|
| 0:00–0:12 | “This PR replaces three separate billing settings pages with one guided flow.” | Show three approved before screenshots, then the approved flow screenshot | “Three pages → one flow” | PR description; diff summary |
| 0:12–0:27 | “Users review the plan, update payment details, and confirm without leaving the flow.” | Highlight the named steps on the screenshots | “Review · Payment · Confirmation” | PR description; diff summary |
| 0:27–0:41 | “The existing payment form and server mutation remain in use. Payment processing does not change.” | Keep the flow screenshot visible; reveal the statements as text | “Existing form and mutation” | Diff summary |
| 0:41–0:52 | “Pricing, permissions, and invoices are unchanged. There is no measured checkout-speed claim.” | Show the four stated boundaries | “No measured speed claim” | Diff summary; review discussion |
| 0:52–1:04 | “The existing flag remains in place: internal first, then ten percent of eligible workspaces.” | Reveal the two supplied rollout stages | “Internal first · Then 10%” | Review discussion; rollout notes |
| 1:04–1:15 | “The flow records entry, completion, cancellation, and success. The rollout notes frame leadership discussion around adoption and rollout confidence.” | Reveal the named events, then the Acme logo | “Adoption and rollout confidence” | Diff summary; rollout notes |

## Approval

Approve or revise this plan before production. No animation source or render has been created.

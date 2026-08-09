# Video plan: Consolidate billing settings into a guided flow

## Treatment

- **Audience preset:** Executive, because the rollout notes address leadership and exclude implementation-file detail.
- **Editable fine-tuning:**
  - **Viewer knowledge:** Familiar with Acme billing settings and feature flags; no code knowledge assumed.
  - **Takeaway:** Three settings pages become one guided flow with a staged rollout.
  - **Technical depth:** Product behavior and implementation boundaries only.
  - **Terminology:** “Guided flow,” the three step names, and `billing_flow_v2`.
  - **Emphasis:** User-visible sequence, unchanged scope, analytics, and rollout.
  - **Exclusions:** Implementation files and faster-checkout language.
  - **Tone:** Neutral and concise.
  - **Discussion framing:** Use only the supplied “adoption and rollout confidence” framing; add no question or recommendation.
- **Renderer:** Remotion.
- **Renderer rationale:** Approved screenshots, UI callouts, and rollout stages need editorial composition. Manim is weaker because the explanation needs no continuously transforming conceptual model.
- **Duration:** 78 seconds.
- **Visual system:** Use the available approved screenshots and available Acme horizontal logo. Preserve the logo's aspect ratio. No other brand rules are supplied, so do not present chosen colors, fonts, spacing, or variants as Acme branding.

## Timed scenes

The narration column is also the caption source.

| Time | Purpose | Narration and captions | Visual state and motion | On-screen text | Provenance |
|---|---|---|---|---|---|
| 0:00–0:12 | State the change | “This PR replaces three separate billing settings pages with one guided flow.” | Show the three approved before screenshots, then the approved flow screenshot | “Three pages → one flow” | PR description; final diff summary |
| 0:12–0:27 | Show the sequence | “Users review the current plan, update payment details, and confirm changes without leaving the flow.” | Highlight those named steps on the approved screenshots | “Review · Payment · Confirmation” | PR description; final diff summary |
| 0:27–0:41 | State retained behavior | “The flow reuses the existing payment form and server mutation. Payment processing does not change.” | Keep the flow screenshot visible; reveal the narrated statements as text | “Existing form and mutation” | Final diff summary |
| 0:41–0:53 | Preserve scope | “Pricing, permissions, and invoices are unchanged. The PR includes no measured checkout-speed claim.” | Replace text with the four stated boundaries | “No measured speed claim” | Final diff summary; review discussion |
| 0:53–1:05 | State rollout | “The existing feature flag remains in place: internal first, then ten percent of eligible workspaces.” | Reveal the two supplied rollout stages in sequence | “Internal first · Then 10%” | Review discussion; rollout notes |
| 1:05–1:18 | Close on supplied framing | “The flow records entry, step completion, cancellation, and success. The rollout notes frame leadership discussion around adoption and rollout confidence.” | Reveal the four named events, then the Acme logo | “Adoption and rollout confidence” | Final diff summary; rollout notes |

## Approval

Approve this packet or specify changes. Production remains paused; no animation source or render has been created.

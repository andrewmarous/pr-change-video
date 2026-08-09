# Video plan: Consolidate billing settings into a guided flow

## Treatment

- **Audience preset:** Executive, as the rollout notes address leadership and exclude implementation files.
- **Editable fine-tuning:**
  - **Viewer knowledge:** Familiar with Acme billing settings and feature flags; no code knowledge assumed.
  - **Takeaway:** Three settings pages become one guided flow with a staged rollout.
  - **Technical depth:** Product behavior and implementation boundaries only.
  - **Terminology:** “Guided flow,” step names, and `billing_flow_v2`.
  - **Emphasis:** User-visible sequence, unchanged scope, analytics, and rollout.
  - **Exclusions:** File detail, unsupported outcomes, and faster-checkout language.
  - **Tone:** Neutral and concise.
  - **Discussion framing:** Use only the supplied phrase “adoption and rollout confidence”; add no prompt or recommendation.
- **Renderer:** Remotion.
- **Duration:** 78 seconds.
- **Source-stated message:** The PR consolidates billing settings into a guided flow, retains specified payment behavior, adds analytics, and remains behind a staged rollout.

## Content ledger

- **F1 — Implementation:** `BillingFlow` adds review, payment, and confirmation; reuses the payment form and server mutation; records entry, step completion, cancellation, and success; and does not change pricing, permissions, invoices, or payment processing. Mobile spacing was corrected.
- **C1 — Context:** Users can complete the stated steps without leaving the flow. Rollout remains behind `billing_flow_v2`: internal first, then 10% of eligible workspaces. The artifact prepares leadership to discuss adoption and rollout confidence.
- **Caveat:** Reviewers rejected faster-checkout language because the PR has no performance measurements.
- **Contradictions:** None in the supplied material.

## Not represented

Implementation files, event schemas, the mobile-spacing detail, and any unstated outcome, causal claim, conclusion, rollout criterion, recommendation, or next step.

## Renderer decision

Remotion supports the required editorial composition of approved screenshots, sequential UI callouts, scope cards, and a rollout timeline. Manim is weaker because comprehension does not require a persistent conceptual object to transform continuously.

## Timed scenes

Narration text is also the caption source.

| Time | Purpose | Narration and captions | Visual state and motion | On-screen text | Provenance |
|---|---|---|---|---|---|
| 0:00–0:12 | State the change | “This PR replaces three separate billing settings pages with one guided flow.” | Three approved before screenshots resolve into the approved flow | “Three pages → one flow” | F1, C1 |
| 0:12–0:27 | Show the sequence | “Users review the current plan, update payment details, and confirm changes without leaving the flow.” | Highlight the three steps in order | “Review · Payment · Confirmation” | F1, C1 |
| 0:27–0:41 | Define retained behavior | “The existing payment form and server mutation remain in use. Payment processing does not change.” | Flow remains above a fixed existing-payment layer | “Payment processing unchanged” | F1 |
| 0:41–0:53 | Preserve scope | “Pricing, permissions, and invoices are unchanged. The PR includes no measured checkout-speed claim.” | Unchanged cards and separate speed caveat | “No measured speed claim” | F1, caveat |
| 0:53–1:05 | State rollout | “The existing feature flag remains in place: internal first, then ten percent of eligible workspaces.” | `billing_flow_v2`: Internal → 10% | “Internal first · Then 10%” | C1 |
| 1:05–1:18 | Close on supplied framing | “The flow records entry, step completion, cancellation, and success. The rollout notes frame leadership discussion around adoption and rollout confidence.” | Four event labels, then Acme logo | “Adoption and rollout confidence” | F1, C1 |

## Visual system

Use the three available approved screenshots and available Acme horizontal logo; preserve its aspect ratio. No other brand rules are supplied, so use a restrained neutral layout without presenting invented colors, fonts, spacing, or variants as Acme branding.

## Approval checklist

- [ ] Source meaning and audience treatment
- [ ] Remotion, timed scenes, and 78-second duration
- [ ] Screenshot and logo treatment

**Approval gate:** Approve or revise this packet. No animation source or render has been created.

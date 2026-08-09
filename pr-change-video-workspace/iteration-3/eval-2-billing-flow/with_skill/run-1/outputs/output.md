# Video plan: Consolidate billing settings into a guided flow

## Treatment

- **Audience preset:** Executive, because the rollout notes explicitly identify leadership and exclude implementation-file detail.
- **Fine-tuning (editable presentation settings):**
  - **Viewer knowledge:** Familiar with Acme billing settings and feature-flag rollouts; no code knowledge assumed.
  - **Source-stated takeaway:** Three separate billing settings pages become one guided flow; rollout is internal first, then 10% of eligible workspaces.
  - **Technical depth:** Low; include implementation boundaries but no file-level detail.
  - **Terminology:** “Guided flow,” “review,” “payment,” “confirmation,” and `billing_flow_v2`.
  - **Emphasis:** The user-visible sequence, unchanged scope, analytics events, and supplied rollout sequence.
  - **Exclusions:** Implementation files, unsupported outcomes, and language implying faster checkout.
  - **Tone:** Brief, neutral, and factual.
  - **Discussion framing:** The source says the artifact prepares leadership to discuss adoption and rollout confidence. The video states that framing but adds no questions, criteria, recommendations, or next steps.
- **Renderer:** Remotion.
- **Target duration:** 78 seconds.
- **Source-stated message:** The PR consolidates the billing-settings experience into a guided flow, retains specified existing payment behavior, adds analytics, and remains behind a staged rollout.

## Content ledger

### Implementation facts from the PR

- `BillingFlow` contains review, payment, and confirmation steps.
- It reuses the existing payment form and server mutation.
- It adds analytics for entry, step completion, cancellation, and success.
- Pricing, permissions, invoices, and payment processing do not change.
- Mobile spacing was corrected in the final revision.

### Narrative claims from user-provided context

- The PR description says three separate settings pages become one flow that users do not leave while reviewing the plan, updating payment details, and confirming changes.
- Review discussion says rollout remains behind `billing_flow_v2` and rejects any faster-checkout claim because there are no performance measurements.
- Rollout notes specify internal enablement followed by 10% of eligible workspaces.
- Rollout notes say the video prepares leadership to discuss adoption and rollout confidence, not implementation files.

### Contradictions and caveats

- No implemented behavior conflicts with the supplied context.
- “Faster checkout” is explicitly unsupported and excluded.
- The fixture names the approved assets but does not embed them; their availability must be confirmed before production.

## Omissions required for duration

- File-level implementation detail and analytics event schemas.
- Detailed treatment of the mobile-spacing correction.
- No impact estimate, causal claim, rollout criterion, recommendation, conclusion, or proposed next step is added.

## Renderer decision

- **Required visual primitives:** Before/after screenshots, sequential UI callouts, scope cards, and a two-stage rollout timeline.
- **Why Remotion:** The supplied visual evidence and planned scenes require editorial composition of screenshots, text, and discrete timeline beats.
- **Why not Manim:** The source does not require a persistent conceptual object or technical mechanism to transform continuously for comprehension.

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content | Provenance |
|---|---|---|---|---|
| 0:00–0:12 | State the change | “This PR replaces three separate billing settings pages with one guided flow.” | Three approved before views resolve into the approved flow | Context claim: PR description; implementation fact: diff summary |
| 0:12–0:27 | Show the flow | “Users review the current plan, update payment details, and confirm changes without leaving the flow.” | Review → Payment → Confirmation | Context claim: PR description; implementation fact: diff summary |
| 0:27–0:41 | State retained behavior | “The flow reuses the existing payment form and server mutation. Payment processing does not change.” | Existing form and mutation remain beneath the flow | Implementation facts: diff summary |
| 0:41–0:53 | State scope and caveat | “Pricing, permissions, and invoices are unchanged. The PR includes no measured claim that checkout is faster.” | Unchanged scope cards; “No measured speed claim” | Implementation facts: diff summary; context caveat: review discussion |
| 0:53–1:05 | State rollout | “The existing `billing_flow_v2` flag remains in place: enable internally first, then for ten percent of eligible workspaces.” | Internal → 10% eligible workspaces | Context claims: review discussion and rollout notes |
| 1:05–1:18 | State supplied discussion framing | “The flow records entry, step completion, cancellation, and success. The rollout notes frame the leadership discussion around adoption and rollout confidence.” | Four analytics labels; “Adoption and rollout confidence” | Implementation facts: diff summary; context claim: rollout notes |

Total: **78 seconds**.

## Storyboard

### Scene 1: Three pages become one flow

- **Duration:** 12 seconds
- **Purpose:** Represent the source-stated structural change.
- **Visual:** Three approved before screenshots resolve into the approved flow screenshot.
- **On-screen text:** “Three pages → one guided flow”
- **Provenance:** PR description and diff summary.

### Scene 2: Guided steps

- **Duration:** 15 seconds
- **Purpose:** Represent the stated user sequence.
- **Visual:** Review, Payment, and Confirmation highlight in order.
- **On-screen text:** “Review · Payment · Confirmation”
- **Provenance:** PR description and diff summary.

### Scene 3: Existing payment behavior

- **Duration:** 14 seconds
- **Purpose:** Show the implementation boundary without interpreting it.
- **Visual:** The flow sits above a fixed “Existing payment form + server mutation” layer.
- **On-screen text:** “Payment processing unchanged”
- **Provenance:** Diff summary.

### Scene 4: Scope and qualification

- **Duration:** 12 seconds
- **Purpose:** Preserve explicit non-changes and the rejected performance claim.
- **Visual:** Pricing, permissions, invoices, and processing receive “unchanged” labels; the speed caveat appears separately.
- **On-screen text:** “No measured speed claim”
- **Provenance:** Diff summary and review discussion.

### Scene 5: Supplied rollout sequence

- **Duration:** 12 seconds
- **Purpose:** Show only the rollout stages in the notes.
- **Visual:** `billing_flow_v2` leads to Internal, then 10% of eligible workspaces.
- **On-screen text:** “Internal first · Then 10%”
- **Provenance:** Review discussion and rollout notes.

### Scene 6: Supplied leadership framing

- **Duration:** 13 seconds
- **Purpose:** Close with the discussion topic stated in the rollout notes.
- **Visual:** Entry, completion, cancellation, and success labels surround the supplied phrase “Adoption and rollout confidence”; close on the Acme logo.
- **On-screen text:** “Adoption and rollout confidence”
- **Provenance:** Diff summary and rollout notes.

## Narration script

**0:00–0:12** — This PR replaces three separate billing settings pages with one guided flow.

**0:12–0:27** — Users review the current plan, update payment details, and confirm changes without leaving the flow.

**0:27–0:41** — The flow reuses the existing payment form and server mutation. Payment processing does not change.

**0:41–0:53** — Pricing, permissions, and invoices are unchanged. The PR includes no measured claim that checkout is faster.

**0:53–1:05** — The existing `billing_flow_v2` flag remains in place: enable internally first, then for ten percent of eligible workspaces.

**1:05–1:18** — The flow records entry, step completion, cancellation, and success. The rollout notes frame the leadership discussion around adoption and rollout confidence.

## Captions

Use the narration verbatim, split into one- or two-line cues within each listed interval. Do not synthesize narration.

## Visual system

- Use the three approved screenshots as primary visual evidence.
- Use the supplied Acme horizontal logo and preserve its aspect ratio.
- No other brand rules are supplied. Use a restrained neutral layout for unbranded elements; do not label invented colors, fonts, spacing, or variants as Acme branding.

## Approval checklist

- [ ] Source content is represented without added interpretation
- [ ] Executive treatment and editable assumptions
- [ ] Remotion selection
- [ ] Storyboard, narration, and captions
- [ ] 78-second duration
- [ ] Screenshot and logo treatment

**Approval gate:** Approve this packet or specify changes to it. No animation source, production project, captions file, or render has been created.

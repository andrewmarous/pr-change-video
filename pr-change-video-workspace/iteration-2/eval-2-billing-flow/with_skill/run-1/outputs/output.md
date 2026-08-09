# Video plan: Consolidate billing settings into a guided flow

## Recommendation summary

- **Audience preset:** Executive. The supplied rollout notes explicitly ask to prepare leadership to discuss adoption and rollout confidence rather than implementation files.
- **Fine-tuning recommendations (all editable):**
  - **Assumed viewer knowledge:** Viewers know Acme's product and staged-rollout practice but not the console implementation.
  - **Primary takeaway:** The PR consolidates three billing settings pages into one guided flow, while the supplied context frames the follow-up around adoption and rollout confidence.
  - **Technical depth:** Low. Mention reuse of the existing payment form and server mutation only to define the implementation boundary.
  - **Terminology:** “Guided billing flow,” “eligible workspaces,” and “staged rollout.” Avoid component and event-schema terminology.
  - **Emphasis:** The new three-step flow, unchanged payment-processing scope, and the context-specified rollout conversation.
  - **Exclusions:** Implementation files, analytics schemas, invented outcome claims, and any claim that checkout is faster.
  - **Tone:** Concise, factual, and measured.
  - **Discussion enabled:** Which observed entry, completion, cancellation, and success signals will give leadership confidence to expand rollout?
- **Renderer:** Remotion.
- **Target duration:** 85 seconds.
- **Follow-up conversation:** Adoption and rollout confidence, exactly as requested in the rollout notes.

These are planning recommendations. The audience knowledge, takeaway, depth, terminology, emphasis, exclusions, tone, and closing question can be revised before approval.

## Evidence and confidence

### Implementation facts from the PR

- `BillingFlow` has review, payment, and confirmation steps.
- The flow reuses the existing payment form and server mutation.
- Analytics record flow entry, step completion, cancellation, and success.
- Pricing, permissions, invoices, and payment processing do not change.
- The final revision corrects mobile spacing.

### Narrative claims from user-provided context

- The PR description frames the change as replacing three separate billing settings pages with one guided flow in which users remain throughout review, payment-detail update, and confirmation.
- The review discussion says rollout remains behind the existing `billing_flow_v2` flag.
- The rollout notes specify internal enablement followed by 10% of eligible workspaces.
- The rollout notes say the video should prepare leadership to discuss adoption and rollout confidence, not implementation files.

### Missing narrative context and questions

- No success thresholds, observation window, owner, or promotion criteria are supplied. The video can ask what evidence earns expansion, but it must not answer that question.
- The context does not claim that the new experience is simpler, easier, quicker, or likely to improve conversion. Those outcomes will not appear.

### Contradictions and caveats

- Reviewers explicitly rejected “faster checkout” language because the PR contains no performance measurements. The video will not state or imply a speed benefit.
- The fixture lists three approved screenshots and an Acme logo but does not embed them. Production must verify access after approval.

## Content boundaries

### Include

- Before/after presentation of three pages becoming one guided flow.
- Review, payment, and confirmation steps.
- Reuse of the existing payment form and mutation as a neutral scope fact.
- Unchanged pricing, permissions, invoices, and payment processing.
- Existing feature flag and the context-specified internal-to-10% rollout.
- The context-specified discussion about adoption and rollout confidence.

### Exclude

- Any unprovided motivation, benefit, tradeoff, risk assessment, or outcome prediction.
- Faster-checkout, conversion, support-volume, usability, or efficiency claims.
- Implementation-file walkthroughs and invented rollout thresholds.

## Renderer decision

### Required visual primitives

- Arrange approved before/after screenshots into editorial comparisons.
- Reveal the three flow steps as short, sequential callouts.
- Present unchanged scope and rollout stages as readable cards.
- Use the supplied horizontal logo without changing its proportions.

### Evidence for Remotion

The planned explanation depends on screenshots, UI comparison, stakeholder-oriented text, and a rollout timeline. These are editorial composition tasks across discrete scenes, which favor Remotion.

### Why the alternative is weaker

Manim is strongest when viewers must track persistent conceptual objects as their state or relationships change. This plan does not require such a model; abstracting the supplied UI into one would be less direct than showing the approved screenshots.

### Dependencies and risks

- Confirm that all three screenshots are final and approved, including any mobile image affected by the spacing correction.
- Preserve the logo aspect ratio. Do not infer colors, fonts, variants, or clear-space rules.
- Remotion, Node.js, and an MP4 encoder are production dependencies after approval only.

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content | Provenance |
|---|---|---|---|---|
| 0:00–0:12 | Establish current and changed structure | “This update replaces three separate billing settings pages with one guided flow.” | Three approved before views compress into one after-flow frame | Context-supported claim: PR description; implementation fact: final diff summary |
| 0:12–0:29 | Show implemented sequence | “Within that flow, users review the current plan, update payment details, and confirm the change.” | Review → Payment → Confirmation, paired with approved screenshots | Context-supported claim: PR description; implementation fact: `BillingFlow` steps |
| 0:29–0:44 | Define implementation boundary | “The flow reuses the existing payment form and server mutation. Payment processing itself does not change.” | Guided flow above a stable “Existing form + mutation” layer | Implementation facts: final diff summary |
| 0:44–0:57 | Preserve non-change qualifiers | “Pricing, permissions, and invoices are also unchanged. The PR makes no measured speed claim.” | Four “unchanged” cards; “No measured speed claim” | Implementation facts: final diff summary; context-supported caveat: review discussion |
| 0:57–1:12 | Present planned rollout | “The existing feature flag supports internal enablement first, followed by ten percent of eligible workspaces.” | `billing_flow_v2`; Internal → 10% eligible workspaces | Context-supported claims: review discussion and rollout notes |
| 1:12–1:25 | Enable the requested discussion | “The follow-up is about adoption and rollout confidence: what should entry, completion, cancellation, and success show before expansion?” | Four analytics signals surround “What earns expansion?” | Implementation facts: analytics events; context-supported framing: rollout notes |

Total: **85 seconds**.

## Storyboard

### Scene 1: Three pages to one flow

- **Duration:** 12 seconds
- **Purpose:** State the structural product change.
- **Visual state and motion:** Three approved before screenshots appear as separate panels, then resolve into the approved guided-flow view.
- **On-screen text:** “Three pages → one guided flow”
- **Provenance:** Context-supported claim from the PR description; implementation fact from the final diff summary.
- **Transition:** The after view expands and its three steps become selectable callouts.

### Scene 2: The guided sequence

- **Duration:** 17 seconds
- **Purpose:** Show the implemented user-facing steps.
- **Visual state and motion:** Review, Payment, and Confirmation highlight in order over the approved screenshots.
- **On-screen text:** “Review · Payment · Confirmation”
- **Provenance:** Implementation fact from the final diff summary; detailed user journey from the PR description.
- **Transition:** The screenshot shifts upward to reveal its stable implementation layer.

### Scene 3: Existing payment path

- **Duration:** 15 seconds
- **Purpose:** Define what changed without attributing a benefit or rationale.
- **Visual state and motion:** The new flow remains above a stationary “Existing payment form + server mutation” bar.
- **On-screen text:** “Payment processing unchanged”
- **Provenance:** Implementation facts from the final diff summary.
- **Transition:** Neutral non-change cards replace the implementation layer.

### Scene 4: Explicit boundaries

- **Duration:** 13 seconds
- **Purpose:** Retain material qualifiers from the evidence.
- **Visual state and motion:** Pricing, permissions, invoices, and processing receive “unchanged” markers. A separate caveat appears for speed.
- **On-screen text:** “No measured speed claim”
- **Provenance:** Implementation facts from final diff summary; context-supported caveat from review discussion.
- **Transition:** Cards resolve into the existing feature flag and a two-stage line.

### Scene 5: Staged exposure

- **Duration:** 15 seconds
- **Purpose:** Present the supplied rollout sequence without inventing later stages.
- **Visual state and motion:** `billing_flow_v2` opens first to Internal, then advances to 10% of eligible workspaces.
- **On-screen text:** “Internal first” / “Then 10%”
- **Provenance:** Context-supported claims from review discussion and rollout notes.
- **Transition:** Analytics labels gather around the 10% milestone.

### Scene 6: Leadership discussion

- **Duration:** 13 seconds
- **Purpose:** Prepare the requested follow-up, not resolve it.
- **Visual state and motion:** Entry, completion, cancellation, and success become four evidence cards around a question mark.
- **On-screen text:** “What evidence earns expansion?”
- **Provenance:** Analytics labels are implementation facts; adoption and rollout-confidence framing comes from rollout notes.
- **Transition:** Close on the Acme horizontal logo with its aspect ratio preserved.

## Narration script

**0:00–0:12** — This update replaces three separate billing settings pages with one guided flow.

**0:12–0:29** — Within that flow, users review the current plan, update payment details, and confirm the change.

**0:29–0:44** — The flow reuses the existing payment form and server mutation. Payment processing itself does not change.

**0:44–0:57** — Pricing, permissions, and invoices are also unchanged. The PR makes no measured speed claim.

**0:57–1:12** — The existing feature flag supports internal enablement first, followed by ten percent of eligible workspaces.

**1:12–1:25** — The follow-up is about adoption and rollout confidence: what should entry, completion, cancellation, and success show before expansion?

## Caption plan

- Use the approved narration verbatim, divided at natural phrase boundaries.
- Keep each cue to one or two short lines and inside its scene interval.
- Keep captions clear of screenshot controls and the logo area.
- Do not synthesize a voice track.

## Visual system and branding

- Use the three approved screenshots as the primary visual evidence.
- Use the supplied Acme horizontal logo on the closing frame and preserve its aspect ratio.
- No other brand specification is supplied. Use a restrained neutral composition with legible, high-contrast text, but do not claim its colors or type are Acme brand rules.
- Do not invent logo variants, brand fonts, colors, or spacing requirements.

## Approval checklist

- [ ] Executive preset and all fine-tuning assumptions
- [ ] Implementation facts and context-supported takeaway
- [ ] Content exclusions, narrative gaps, and speed caveat
- [ ] Remotion renderer decision
- [ ] Storyboard, narration, and captions
- [ ] 85-second duration
- [ ] Screenshot and logo treatment

**Approval gate:** Please approve this packet or request planning changes. No animation source, captions file, production project, or rendered video will be created before approval.

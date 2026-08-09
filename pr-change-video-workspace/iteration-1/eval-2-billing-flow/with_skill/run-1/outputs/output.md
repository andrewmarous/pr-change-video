# Video plan: Consolidate billing settings into a guided flow

## Recommendation summary

- **Audience preset:** Executive. This PR changes the customer billing experience and rollout posture; leadership needs the outcome, boundaries, and decision context rather than file-level implementation.
- **Fine-tuning (editable):**
  - **Assumed viewer knowledge:** Knows Acme has billing settings and staged feature rollouts; does not need familiarity with the console code.
  - **Primary takeaway:** Billing settings become one guided experience without changing pricing or payment processing, and the existing flag supports a measured rollout.
  - **Technical depth:** Low. Mention reuse of the existing payment form and mutation only to establish that the change reorganizes the experience rather than replacing payment infrastructure.
  - **Terminology:** Use “guided billing flow,” “eligible workspaces,” and “staged rollout.” Define no implementation symbols on screen.
  - **Emphasis:** A more coherent billing-change journey, unchanged financial semantics, and adoption/rollout confidence.
  - **Exclusions:** File names, component internals, unmeasured speed claims, and detailed analytics implementation.
  - **Tone:** Concise, factual, confident but measured.
  - **Discussion enabled:** What adoption signals and rollout evidence should leadership require before expansion beyond 10%?
- **Renderer:** Remotion.
- **Target duration:** 85 seconds (within the 90-second target).
- **Follow-up conversation:** Rollout confidence, adoption measures, and criteria for widening exposure.

These are recommendations, not fixed inputs. The viewer knowledge, takeaway, depth, terminology, emphasis, exclusions, tone, and closing question can all be changed before approval.

## Evidence and confidence

### Verified implementation

- Three separate billing settings pages are consolidated into a `BillingFlow` with review, payment, and confirmation steps.
- The flow reuses the existing payment form and server mutation.
- Analytics cover entry, step completion, cancellation, and success.
- Pricing, permissions, invoices, and payment processing do not change.
- Mobile spacing was corrected in the final revision.

### Stated intent

- The flow lets users review their current plan, update payment details, and confirm changes without leaving the flow.
- Rollout is internal first, then 10% of eligible workspaces.
- Leadership should be prepared to discuss adoption and rollout confidence.

### Inferences

- The event set can support a useful adoption funnel, but the fixture does not define success thresholds or reporting.
- Reusing the existing payment form and mutation likely limits backend change risk; this is an inference, not a measured risk claim.

### Contradictions and caveats

- Reviewers rejected language claiming checkout is faster. No performance measurement exists, so the video will not say or imply “faster.”
- The assets are described but not embedded in this fixture. Production must confirm all three screenshots and the approved logo are accessible before building.

## Content boundaries

### Include

- Before/after view of three separate pages becoming one guided flow.
- The three user-facing steps: review, payment, confirmation.
- Explicit continuity: existing payment form and server mutation remain in use.
- Explicit non-changes: pricing, permissions, invoices, payment processing.
- Flagged rollout: internal, then 10% of eligible workspaces.
- Closing prompt about adoption and rollout confidence.

### Exclude

- Claims about speed, conversion lift, reduced support volume, or other unmeasured outcomes.
- Source files, component structure, analytics event schemas, and implementation walkthroughs.
- Any invented rollout threshold or brand rule.

## Renderer decision

### Required visual primitives

- Compose approved screenshots into before/after scenes.
- Reveal the guided steps editorially, with short callouts.
- Present boundaries and rollout stages as readable cards on a timeline.
- Place the approved Acme logo consistently without altering its aspect ratio.

### Evidence for Remotion

The explanation is driven by UI screenshots, before/after comparison, stakeholder-impact text, and a staged rollout narrative. Those are editorial timeline-composition tasks, so Remotion is the stronger fit.

### Why Manim is weaker

No persistent conceptual object must transform to explain a technical mechanism. A Manim model would add abstraction where the actual UI and concise editorial composition communicate the change more directly.

### Dependencies and risks

- Confirm the supplied screenshots are the approved final revision and include the corrected mobile spacing where relevant.
- Preserve the Acme logo aspect ratio. Do not infer colors, typefaces, clear-space rules, or logo variants from the logo alone.
- Remotion/Node and an MP4 encoding path will be required only after approval.

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content |
|---|---|---|---|
| 0:00–0:12 | Establish the problem | “Billing changes currently send customers across three separate settings pages.” | Three approved “before” views arranged as a fragmented path; label: “Three separate pages” |
| 0:12–0:30 | Show the change | “This PR consolidates that journey into one guided flow: review the plan, update payment details, then confirm.” | Approved “after” views; step labels reveal in order: Review → Payment → Confirmation |
| 0:30–0:45 | Establish continuity | “It reuses the existing payment form and server mutation, so this is a new experience—not a change to payment processing.” | “Existing payment form + mutation” remains fixed beneath the new flow; “Payment processing unchanged” |
| 0:45–0:58 | Preserve boundaries | “Pricing, permissions, and invoices are unchanged, and the PR makes no performance claim.” | Four concise check cards; “No measured speed claim” caveat |
| 0:58–1:13 | Explain rollout | “The existing feature flag supports an internal launch, followed by ten percent of eligible workspaces.” | Two-stage rollout timeline: Internal → 10% eligible workspaces |
| 1:13–1:25 | Set up discussion | “The next conversation is about evidence: which entry, completion, cancellation, and success signals give us confidence to expand?” | Four event labels converge on: “What earns wider rollout?” |

Total: **85 seconds**.

## Storyboard

### Scene 1: The fragmented journey

- **Duration:** 12 seconds
- **Purpose:** Show the current experience without overstating customer harm.
- **Visual state and motion:** Three approved before screenshots enter as separate panels with a simple path connecting them.
- **On-screen text:** “Billing changes span three settings pages”
- **Evidence:** PR description; final diff summary.
- **Transition:** Panels compress toward one frame.

### Scene 2: One guided flow

- **Duration:** 18 seconds
- **Purpose:** Make the user-facing change memorable.
- **Visual state and motion:** Approved after screenshots replace the panels; Review, Payment, and Confirmation are highlighted sequentially.
- **On-screen text:** “One guided flow” and the three step names.
- **Evidence:** PR description; final diff summary.
- **Transition:** Guided-flow frame shifts upward to reveal its existing foundation.

### Scene 3: New experience, existing payment path

- **Duration:** 15 seconds
- **Purpose:** Distinguish UX consolidation from payment-system replacement.
- **Visual state and motion:** Flow sits above a steady base labeled “Existing payment form + server mutation.”
- **On-screen text:** “Payment processing unchanged”
- **Evidence:** Final diff summary.
- **Transition:** Base remains briefly while boundary cards enter.

### Scene 4: Clear boundaries

- **Duration:** 13 seconds
- **Purpose:** Prevent unsupported conclusions.
- **Visual state and motion:** Pricing, permissions, invoices, and processing appear as unchanged cards; an explicit caveat rules out speed claims.
- **On-screen text:** “No pricing or processing change” / “No measured speed claim”
- **Evidence:** Final diff summary; review discussion.
- **Transition:** Cards resolve into a feature-flag icon and rollout line.

### Scene 5: Controlled rollout

- **Duration:** 15 seconds
- **Purpose:** Explain how exposure expands.
- **Visual state and motion:** Timeline advances from Internal to 10% of eligible workspaces; no further stage is invented.
- **On-screen text:** “Existing flag” / “Internal first” / “Then 10%”
- **Evidence:** Review discussion; rollout notes.
- **Transition:** Analytics labels enter around the 10% node.

### Scene 6: The leadership question

- **Duration:** 12 seconds
- **Purpose:** Prepare the follow-up conversation.
- **Visual state and motion:** Entry, completion, cancellation, and success become four compact signal cards surrounding the closing question.
- **On-screen text:** “What evidence earns wider rollout?”
- **Evidence:** Final diff summary; rollout notes.
- **Transition:** End on the approved Acme horizontal logo, aspect ratio preserved.

## Narration script

**0:00–0:12** — Billing changes currently send customers across three separate settings pages.

**0:12–0:30** — This PR consolidates that journey into one guided flow: review the plan, update payment details, then confirm.

**0:30–0:45** — It reuses the existing payment form and server mutation, so this is a new experience—not a change to payment processing.

**0:45–0:58** — Pricing, permissions, and invoices are unchanged, and the PR makes no performance claim.

**0:58–1:13** — The existing feature flag supports an internal launch, followed by ten percent of eligible workspaces.

**1:13–1:25** — The next conversation is about evidence: which entry, completion, cancellation, and success signals give us confidence to expand?

## Caption plan

- Use the narration text verbatim as captions.
- Split each segment into one- or two-line cues aligned to phrase boundaries.
- Keep captions clear of screenshot controls and the lower logo safe area.
- Do not caption visual-only labels redundantly when the same words are narrated.

## Visual system and branding

- Use the three approved screenshots as the primary visual evidence.
- Use the supplied Acme horizontal logo on the opener or closer and preserve its aspect ratio.
- Derive no additional brand rules from these assets. Use restrained neutral layouts, high-contrast type, and one unobtrusive accent unless more approved guidance is supplied.
- Do not invent logo variants, corporate colors, fonts, or clear-space requirements.

## Approval checklist

- [ ] Audience preset and all fine-tuning assumptions
- [ ] Message and primary takeaway
- [ ] Content boundaries and caveats
- [ ] Remotion renderer decision
- [ ] Storyboard and narration
- [ ] 85-second duration
- [ ] Screenshot and logo treatment

**Approval gate:** Please approve this packet or request planning changes. No animation source, captions file, or render will be created until approval.

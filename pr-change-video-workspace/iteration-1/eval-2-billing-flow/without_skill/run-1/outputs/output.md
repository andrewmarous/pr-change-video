# Executive video proposal: Guided billing settings

## Recommended treatment

Use a concise, screenshot-led executive update built in **Remotion**. The strongest story is not the component implementation; it is the shift from three separate pages to one guided customer journey, paired with a controlled rollout.

Target **about 75 seconds**. Use the three approved before/after screenshots as the visual backbone and the supplied horizontal Acme logo on the closing frame. Preserve the logo's aspect ratio. Because no broader brand guide was supplied, keep the remaining design neutral and do not invent Acme colors, fonts, or logo treatments.

### Audience assumptions you can fine-tune

- **Viewer knowledge:** Executives know the product and feature-flag rollout model, but not the billing code.
- **Takeaway:** The team simplified the billing-settings journey without changing prices or the underlying payment-processing behavior.
- **Depth:** Outcome and rollout focused, with one sentence about reuse of the current payment form and mutation.
- **Emphasis:** Customer journey, scope boundaries, staged rollout, and the evidence needed to expand.
- **Exclude:** File-level details, analytics schemas, and any claim that checkout is faster.
- **Tone:** Direct, measured, and discussion-oriented.
- **Closing discussion:** Which adoption and completion signals should determine expansion beyond the initial cohort?

## Evidence boundaries

The PR supports these claims:

- Three settings pages become one flow with review, payment, and confirmation steps.
- The existing payment form and server mutation are reused.
- Entry, completion, cancellation, and success are measured.
- Pricing, permissions, invoices, and payment processing do not change.
- Rollout remains behind `billing_flow_v2`: internal first, then 10% of eligible workspaces.

Do not claim the new flow is faster. Reviewers explicitly rejected that language because the PR includes no performance measurement.

## Proposed sequence

| Time | Visual | Narration |
|---|---|---|
| 0:00–0:12 | Three approved “before” screenshots shown as separate stops | “Today, changing billing settings spans three separate pages.” |
| 0:12–0:30 | Approved “after” views reveal Review, Payment, Confirmation | “This update brings the journey into one guided flow: review the plan, update payment details, and confirm.” |
| 0:30–0:44 | Existing payment form shown as a stable foundation under the new UI | “The experience changes, but the existing payment form and server mutation remain in place.” |
| 0:44–0:56 | Short scope card | “Pricing, permissions, invoices, and payment processing are unchanged.” |
| 0:56–1:08 | Rollout timeline: Internal → 10% eligible workspaces | “The current flag supports an internal launch, followed by ten percent of eligible workspaces.” |
| 1:08–1:15 | Analytics event labels and closing question | “What evidence will give us confidence to expand?” |

## Why Remotion

This story depends on composing screenshots, before/after comparisons, short scope cards, and a rollout timeline. Remotion is better suited to that editorial, mixed-media structure than Manim. Manim would be useful if the core explanation depended on tracking a technical mechanism or conceptual objects through continuous transformations; this update does not.

## Narration and captions

The table above is the draft timed narration script. Use the same wording for captions, split at natural phrase boundaries. No synthesized narration is assumed.

## Approval requested

Please approve or adjust:

1. The executive assumptions and takeaway
2. Remotion as the renderer
3. The 75-second structure and narration
4. Use of the supplied screenshots and logo
5. The rollout-confidence closing question

Production stops here. No animation source or render will be created before approval.

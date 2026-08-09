# Executive update plan: Guided billing flow

## Recommendation

Create an **80-second Remotion video** for executives. Lead with the visible shift from three settings pages to a single guided flow, then establish what remains unchanged and finish with the staged-rollout discussion.

Remotion fits because the available material is visual and editorial: approved screenshots, before/after UI comparisons, concise scope cards, a rollout timeline, and a logo. Manim would add little because the explanation does not depend on a continuously transforming technical model.

## Editable audience settings

- **Knowledge:** Executives know the product and feature flags, but not the billing implementation.
- **Takeaway:** The PR changes the billing-settings journey without changing prices or payment processing; the accompanying rollout notes ask leadership to focus next on adoption and rollout confidence.
- **Depth:** Product outcome and rollout only, plus one sentence defining reuse of the current payment form and mutation.
- **Emphasis:** Guided steps, explicit non-changes, and staged exposure.
- **Exclusions:** Source files, event schemas, claims of faster checkout, and outcomes not stated in the supplied material.
- **Tone:** Brief, factual, and measured.
- **Discussion prompt:** What evidence should support expansion after the initial 10% cohort?

These are recommendations and can be changed before production.

## Source boundaries

The final diff says the implementation adds review, payment, and confirmation steps, reuses the payment form and server mutation, adds four classes of analytics events, and does not alter pricing, permissions, invoices, or payment processing.

The PR description supplies the framing that three separate pages become a flow users need not leave. The review and rollout notes supply the feature-flag sequence, internal-first rollout, 10% cohort, and requested leadership focus on adoption and rollout confidence. None of those sources claim improved speed or business outcomes. The video will therefore make no such claim.

## Proposed timeline

| Time | Visual | Narration | Support |
|---|---|---|---|
| 0:00–0:12 | Three before screenshots resolve into the new flow | “This update replaces three separate billing settings pages with one guided flow.” | PR description and diff summary |
| 0:12–0:28 | Review, Payment, Confirmation highlight in sequence | “Users can review the plan, update payment details, and confirm without leaving the flow.” | PR description and diff summary |
| 0:28–0:43 | New UI above a stable existing-form layer | “The existing payment form and server mutation remain in use, and payment processing does not change.” | Diff summary |
| 0:43–0:55 | Unchanged-scope cards and speed caveat | “Pricing, permissions, and invoices are unchanged. There is no measured speed claim.” | Diff summary and review discussion |
| 0:55–1:09 | Internal → 10% eligible workspaces | “Rollout remains behind the existing flag: internal first, then ten percent of eligible workspaces.” | Review discussion and rollout notes |
| 1:09–1:20 | Four analytics labels and closing question | “What should these signals show before the rollout expands?” | Diff summary and rollout notes |

## Visual and brand treatment

- Use all relevant approved screenshots as the main evidence rather than recreating the interface.
- Use the Acme horizontal logo sparingly and preserve its aspect ratio.
- No broader brand guide was provided, so use a neutral, high-contrast layout and do not invent Acme colors, fonts, spacing standards, or logo variants.
- Time captions to the narration above. Do not assume synthesized narration.

## Approval requested

Please approve or revise the audience assumptions, takeaway, Remotion choice, timeline, narration, exclusions, closing question, and asset treatment. No animation source or render will be created until approval.

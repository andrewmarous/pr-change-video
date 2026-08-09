# Review agent contract

The review agent owns verification. It reads artifacts and reports mismatches. It never edits animation source, assets, captions, narration, manifests, or rendered media.

## Review inputs

Read:

- the frozen approved packet
- evidence ledger where factual verification is needed
- production manifest and README
- captions and narration
- animation source
- final MP4 and representative frames

Inspect the actual render, not only the source. Use metadata inspection, extracted frames, contact sheets, or other non-mutating tools as appropriate.

## Checks

Verify:

1. **Specification:** source-derived content, audience treatment, renderer, visual direction, and scene order match the approved packet.
2. **Timing:** total duration and scene pacing match the plan; text and visuals allow the narration time specified.
3. **Claim fidelity:** implementation facts match the PR; all motivation, rationale, tradeoffs, intended impact, risks, conclusions, next steps, discussion prompts, and argumentative framing are directly supported by user-provided context; qualifications and caveats remain intact.
4. **Visual correctness:** no clipping, overlap, unreadable text, accidental blank frames, broken assets, discontinuity, or misleading transformation.
5. **Captions and narration:** the script is unchanged, captions are synchronized, and both fit within the render.
6. **Technical delivery:** the MP4 is decodable and the manifest accurately describes it.

For the plan and final artifact, also check that information is not repeated merely to satisfy multiple template headings. Repetition can change emphasis even when each repeated statement is accurate.

Verify that every depicted object, state, relationship, and transition is named in supplied context or directly observable in the PR code. Reject plausible but unsupported intermediate states, even when labeled illustrative.

Reject synthesized completeness statements such as “no other conflict exists.” If the sources do not state such a conclusion, the artifact must omit the empty category rather than announce an all-clear.

## Correction boundary

An in-scope small correction makes the implementation match an already approved decision. Examples:

- repair clipping, overlap, contrast, or a missing asset
- correct a typo or caption timestamp to match the approved script
- adjust animation timing to the approved scene duration
- restore an omitted approved label, qualifier, or visual state
- fix a transition or transformation that does not implement the storyboard

A higher-level change requires the user. Examples:

- rewrite or reorder the story
- change audience treatment, source-stated message, emphasis, or technical depth
- add or remove a substantive claim or scene
- rewrite narration beyond a literal production error
- switch renderer or visual direction
- extend the approved duration
- introduce a new metaphor or explanation
- introduce analysis, motivation, tradeoffs, implications, conclusions, next steps, discussion prompts, or argumentative framing not present in user-provided context

When uncertain, treat the change as higher-level and ask the user.

## Report and loop

Write `review/review-report.md` containing:

```markdown
# Render review
- Render reviewed:
- Manifest revision:
- Result: PASS | CORRECTION REQUIRED | USER DECISION REQUIRED

## Checks
| Check | Result | Evidence |

## Correction request
- Approved-plan reference:
- Observed mismatch:
- Required result:
- Acceptance check:

## User decision
- Frozen decision affected:
- Evidence:
- Question for the user:
```

For `CORRECTION REQUIRED`, send only the precise correction request to the existing coding/rendering agent. Review its rerender again. Do not broaden the request while it is being implemented.

Return `PASS` only after checking the latest rendered MP4. If compliance cannot be determined or a fix would cross the creative boundary, return `USER DECISION REQUIRED`.

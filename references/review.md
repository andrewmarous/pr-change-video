# Review agent contract

The review agent owns verification. It reads artifacts and reports mismatches. It never edits animation source, assets, captions, narration, manifests, or rendered media.

## Review inputs

Read:

- the frozen approved packet
- evidence ledger where factual verification is needed
- production manifest and README
- captions and narration
- animation source
- final MP4

Inspect the actual render, not only the source. The reviewer must create its own review frames from the final MP4; production previews are navigation aids, not review evidence.

## Scene-by-scene visual inspection

Before making any review decision:

1. Read the approved timed scene table and map every scene to its exact interval in the final MP4.
2. Extract at least one screenshot from a stable, information-rich moment in every scene and save it under `review/frames/`. Also extract additional frames when a scene has materially different visual states or a transition could introduce clipping, overlap, misalignment, or discontinuity. Do not use a transition boundary as a scene's only screenshot.
3. Submit the screenshots as image context in the review agent's multimodal LLM request. Identify each image with its scene, timestamp, and approved-plan row; do not merely provide paths or a text description of the images.
4. Reason explicitly about each scene's rendered appearance against both:
   - the approved visual state, motion, on-screen text, visual direction, and brand treatment; and
   - general design quality: alignment, spacing, hierarchy, balance, consistency, contrast, legibility, safe margins, and intentional placement.
5. Record scene-level evidence in the review report. If image context cannot be inspected, compliance cannot be determined and the result cannot be `PASS`.

Screenshots do not replace playback or temporal inspection. Inspect the MP4 for animation continuity, pacing, captions, and brief defects that a still frame may miss.

## Checks

Verify:

1. **Specification:** source-derived content, audience treatment, renderer, visual direction, and scene order match the approved packet.
2. **Timing:** total duration and scene pacing match the plan; text and visuals allow the narration time specified.
3. **Claim fidelity:** implementation facts match the PR; all motivation, rationale, tradeoffs, intended impact, risks, conclusions, next steps, discussion prompts, and argumentative framing are directly supported by user-provided context; qualifications and caveats remain intact.
4. **Visual correctness and design quality:** every scene matches its approved composition and has intentional alignment, spacing, hierarchy, balance, consistency, contrast, legibility, and safe margins; there is no clipping, overlap, misaligned text or objects, accidental blank frame, broken asset, discontinuity, or misleading transformation. Inspect typography in final-MP4 frames at native delivery resolution: flag unintended font fallback, visibly uneven kerning or optical spacing, ordinary phrases built from individually positioned glyphs, unnecessary monospace outside literal code or alignment-dependent values, and small text whose stems or spacing degrade after rasterization. For defective Manim prose, confirm from the source and manifest that production shaped the complete phrase as one Pango text object at 2–4 times its intended font size and uniformly scaled the whole object down; do not recommend LaTeX as the default prose workaround.
5. **Captions and narration:** for narrated output, the spoken text is byte-for-byte unchanged, captions preserve every spoken word and are synchronized, scene timing follows the returned alignment, and explicit silence and padding are preserved. For an approved silent partial output, verify that no captions or audio stream exist, estimated scene timings match the packet, and the manifest labels the artifact intermediate.
6. **Technical delivery:** the MP4 is decodable and the manifest accurately describes it. For narrated output, verify one audio stream is present, durations and muxing are coherent, and mechanical loudness and clipping checks pass.

Automated review is mechanical. Do not claim to assess pronunciation, delivery, emotion, naturalness, or subjective voice quality. Those remain for the user's final-video review.

For the plan and final artifact, also check that information is not repeated merely to satisfy multiple template headings. Repetition can change emphasis even when each repeated statement is accurate.

Verify that every depicted object, state, relationship, and transition is named in supplied context or directly observable in the PR code. Reject plausible but unsupported intermediate states, even when labeled illustrative.

Reject synthesized completeness statements such as “no other conflict exists.” If the sources do not state such a conclusion, the artifact must omit the empty category rather than announce an all-clear.

## Correction boundary

An in-scope small correction makes the implementation match an already approved decision. Examples:

- repair clipping, overlap, contrast, or a missing asset
- repair rendered typography with uneven optical spacing, unintended font fallback, unnecessary monospace, or illegible small text while preserving the approved wording and visual direction
- correct a typo or caption timestamp to match the approved script
- adjust animation timing to the approved scene duration
- adjust local scene timing, captions, silence, levels, fades, or muxing while reusing the same narration
- restore an omitted approved label, qualifier, or visual state
- fix a transition or transformation that does not implement the storyboard

A higher-level change requires the user. Examples:

- rewrite or reorder the story
- change audience treatment, source-stated message, emphasis, or technical depth
- add or remove a substantive claim or scene
- rewrite narration beyond a literal production error
- change voice, model, delivery, voice settings, or pronunciation, which requires a new credit estimate and approval
- change any spoken wording, which invalidates approval and restarts workflow step 1 in a new workspace before planning runs again with prior artifacts and final-video feedback as context
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

## Scene inspection
| Scene | Screenshot and timestamp | Approved-plan comparison | Design-quality assessment | Result |

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

For an explicitly requested first-render-and-review partial workflow, complete this report after the first review pass and stop regardless of result. Record correction needs but do not send them to production, request a rerender, or present the artifact as final.

For a complete workflow with `CORRECTION REQUIRED`, send only the precise correction request to the existing coding/rendering agent. Review its rerender again. Do not broaden the request while it is being implemented.

After every rerender, discard the prior visual conclusion, extract a fresh scene-complete screenshot set from the latest MP4, and repeat the multimodal inspection. Return `PASS` only after checking the latest rendered MP4. For narrated output, report `automated review passed; user audiovisual approval pending` and keep the workflow open until the user accepts or requests a change. If compliance cannot be determined or a fix would cross the creative boundary, return `USER DECISION REQUIRED`.

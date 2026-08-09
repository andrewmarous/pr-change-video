# Video plan: Avoid exact reserve during incremental append

**Awaiting approval. No animation source or render has been created.**

## Treatment

- **Audience:** IC
- **Editable fine-tuning:** Assume viewers know vectors and heap allocation; explain length, capacity, reallocation, copying, and amortized growth without a formal proof; emphasize one persistent vector; omit benchmark presentation as requested; use precise, direct language.
- **Renderer:** Manim
- **Renderer rationale:** `[IMPLEMENTER-NOTES]` requires one persistent vector while its length, capacity, heap buffer, and copied elements change. Manim preserves object identity through these transformations. Remotion's timeline composition is less suited to this continuous mechanism.
- **Duration:** 90 seconds
- **Visual system:** Neutral 16:9 dark background; off-white type; blue vector and capacity labels; amber reallocations and copies; monospace code. No brand assets were supplied.

## Source boundaries

`[EARLY-DISCUSSION]` says allocator reuse should make the old call “probably harmless.” `[FINAL-REVIEW]` instead reports benchmark-confirmed exact growth and repeated copies. The video follows `[FINAL-DIFF]` for implementation and `[FINAL-REVIEW]` for the stated result; it omits the contradicted hypothesis. No numeric benchmark result or exact growth factor is supplied, so neither is depicted.

## Timed scenes

Narration is also the verbatim caption source; production may split it into shorter cues without changing words.

| Time | Purpose | Narration and caption text | Visual state and motion | On-screen text | Provenance |
|---|---|---|---|---|---|
| 0:00–0:13 | State old behavior and intent | “Bulk append called `reserve_exact` before every append. The call was intended to reduce allocations.” | A persistent `items` vector receives batches; its length and capacity labels remain attached. | `reserve_exact` | `[PR-DESCRIPTION]`; `[IMPLEMENTER-NOTES]` |
| 0:13–0:34 | Show the documented failure | “The final review reports that repeated one-element batches forced exact growth and repeated copies.” | Capacity changes; the vector points to successive heap buffers while existing elements copy between them. | “exact growth”; “copied elements” | `[FINAL-REVIEW]`; `[IMPLEMENTER-NOTES]` |
| 0:34–0:46 | State the supplied complexity claim | “The supplied change description identifies quadratic reallocation behavior across repeated reserve calls.” | Reallocation and copy events accumulate beside the persistent vector; no numeric series is added. | “quadratic reallocations” | `[USER-TASK]`; `[IMPLEMENTER-NOTES]` |
| 0:46–1:00 | Show implementation | “The final diff removes `items.reserve_exact(batch.len())`. `items.extend(batch)` remains.” | Display the exact diff; remove only the deleted line. | “remove exact reserve” | `[FINAL-DIFF]` |
| 1:00–1:18 | State new behavior and reviewed result | “`extend` uses the iterator size hint and the vector's normal growth strategy. The final review says this restores amortized growth.” | The retained call connects to the same vector; its length and capacity labels update without depicting an unspecified growth factor. | “normal growth”; “amortized growth restored” | `[DIFF-CONTEXT]`; `[FINAL-REVIEW]`; `[IMPLEMENTER-NOTES]` |
| 1:18–1:30 | Close on scope | “The append path now uses the collection's geometric growth path. There is no public API change.” | Hold the vector and exact retained code beside the closing labels. | “geometric growth”; “no public API change” | `[PR-DESCRIPTION]`; `[DIFF-CONTEXT]` |

## Approval

Approve this packet or specify changes. Production remains paused.

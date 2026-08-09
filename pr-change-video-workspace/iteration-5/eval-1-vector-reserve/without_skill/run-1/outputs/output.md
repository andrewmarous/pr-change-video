# Approval draft: Avoid exact reserve during incremental append

No animation or render has been created.

## Proposed treatment

- **Audience:** ICs familiar with vectors and heap allocation
- **Duration:** 90 seconds
- **Renderer:** Manim
- **Editable assumptions:** Use precise terminology, explain length and capacity visually, avoid a formal complexity proof, and keep benchmark details off screen.

Manim fits because the explanation follows one vector while its length, capacity, backing buffer, and copied elements change. Remotion could show the diff, but it would not represent that continuity as directly. Use a dark 16:9 canvas, off-white text, blue for stable vector state, amber for reallocations and copies, and monospace code.

## Evidence boundary

The final diff removes `items.reserve_exact(batch.len())` and retains `items.extend(batch)`. The early comment that allocator reuse probably made the call harmless conflicts with the final review, which reports benchmark-confirmed exact growth and repeated copies. The plan follows the final diff and final review. It adds no benchmark values or exact growth factor because neither is supplied.

## Timed storyboard, narration, and captions

The narration column supplies the caption text.

| Time | Narration | Visual | Source |
|---|---|---|---|
| 0:00–0:13 | “Bulk append called `reserve_exact` before every append. It was intended to reduce allocations.” | Persistent vector receives batches; length and capacity stay labeled. | PR description; notes |
| 0:13–0:34 | “The final review reports that repeated one-element batches forced exact growth and repeated copies.” | Vector points to successive heap buffers; existing elements copy between them. | Final review; notes |
| 0:34–0:46 | “The supplied description identifies quadratic reallocations across repeated reserve calls.” | Reallocation events accumulate around the persistent vector. | Task prompt |
| 0:46–1:00 | “The final diff removes `reserve_exact`. The call to `extend` remains.” | Show the exact diff and remove the deleted line. | Final diff |
| 1:00–1:18 | “`extend` uses its size hint and normal vector growth. The review says removal restores amortized growth.” | The retained call connects to the vector; length and capacity labels update. | PR export; final review |
| 1:18–1:30 | “The append path uses geometric growth. There is no public API change.” | Hold the final vector, code, and two closing labels. | PR description; PR export |

Please approve or revise the audience treatment, renderer, timing, scenes, narration, captions, or visual style. Production remains paused.

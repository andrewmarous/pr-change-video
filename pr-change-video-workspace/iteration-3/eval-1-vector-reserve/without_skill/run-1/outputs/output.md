# Approval draft: Avoid exact reserve during incremental append

No animation code or video has been produced.

## Format

- **Audience:** IC
- **Duration:** 90 seconds
- **Renderer:** Manim
- **Treatment:** A persistent vector and its backing buffers carry the explanation.
- **Editable assumptions:** The audience knows vector length, capacity, heap allocation, and amortized growth. Use precise terminology and no benchmark charts, allocator internals, or exact growth-factor claim.

## Source boundaries

The final diff establishes that `items.reserve_exact(batch.len())` is removed and `items.extend(batch)` remains. The supplied PR export also says that `extend` uses its iterator size hint and normal vector growth, with no public API change.

The PR description says the removed call was intended to reduce allocations. The final review says repeated one-element batches forced exact growth and repeated copies, and that removing the call restores amortized growth. The task describes the previous behavior as quadratic reallocations. The implementer notes request a visual explanation using a persistent vector, length, capacity, heap buffers, reallocations, and copied elements.

The early statement that allocator reuse probably made the call harmless conflicts with the final review. It is excluded from the video rather than presented as the implemented explanation.

No benchmark values, allocator guarantees, or exact growth factor are supplied, so none are included.

## Renderer rationale

Manim fits the requested presentation because the vector must retain its identity while length, capacity, pointer, backing buffer, and elements change. Remotion could display the diff, but the supplied explanation is centered on continuous object transformations rather than screenshots or mixed media.

## Timed storyboard

| Time | Scene | Visual | Narration |
|---|---|---|---|
| 0:00–0:12 | Old path | A stable `items` vector receives one-element batches; `reserve_exact` runs before append. | “Bulk append reserved exactly enough space before every append. The call was intended to reduce allocations.” |
| 0:12–0:32 | Repeated copies | Length meets capacity. A one-cell-larger illustrative buffer appears, elements copy, and the pointer moves. Repeat. | “The final review reports that one-element batches forced exact growth and repeated copies.” |
| 0:32–0:43 | Stated behavior | Repeated buffer changes stack on screen under a `quadratic reallocations` label. | “The supplied change description identifies quadratic reallocation behavior across repeated reserve calls.” |
| 0:43–0:56 | Final diff | Remove `items.reserve_exact(batch.len())`; keep `items.extend(batch)`. | “The final diff removes the explicit exact reserve. The call to `extend` remains.” |
| 0:56–1:16 | Growth path | An illustrative buffer gains spare capacity. Later appends occupy those cells. | “`extend` uses its iterator size hint and normal vector growth. The review states that the change restores amortized growth.” |
| 1:16–1:30 | Boundary | Hold the vector beside two source-stated labels. | “The collection uses its geometric growth path for these appends. There is no public API change.” |

## Narration

**0:00–0:12** — Bulk append reserved exactly enough space before every append. The call was intended to reduce allocations.

**0:12–0:32** — The final review reports that one-element batches forced exact growth and repeated copies. The vector persists while its backing heap buffer is replaced and its existing elements are copied.

**0:32–0:43** — The supplied change description identifies quadratic reallocation behavior across repeated reserve calls.

**0:43–0:56** — The final diff removes the explicit exact reserve. The call to `extend` remains.

**0:56–1:16** — `extend` uses its iterator size hint and normal vector growth. The review states that the change restores amortized growth.

**1:16–1:30** — The collection uses its geometric growth path for these appends. There is no public API change.

## Captions

| Time | Caption |
|---|---|
| 00:00–00:06 | Bulk append reserved exactly enough space before every append. |
| 00:06–00:12 | The call was intended to reduce allocations. |
| 00:12–00:22 | One-element batches forced exact growth. |
| 00:22–00:32 | Existing elements were copied repeatedly. |
| 00:32–00:43 | The supplied description identifies quadratic reallocations. |
| 00:43–00:50 | The final diff removes `reserve_exact`. |
| 00:50–00:56 | The call to `extend` remains. |
| 00:56–01:06 | `extend` uses its size hint and normal vector growth. |
| 01:06–01:16 | The review states that this restores amortized growth. |
| 01:16–01:24 | The collection uses its geometric growth path. |
| 01:24–01:30 | There is no public API change. |

## Visual treatment

Use a neutral dark 16:9 frame, off-white text, blue for the persistent vector and unused capacity, amber for buffer replacement and copies, and monospace for code. Mark all capacity values as illustrative. No brand assets were supplied.

## Approval

Please approve or edit the audience assumptions, Manim choice, sequence, narration, captions, duration, and visual treatment. Production remains paused until approval.

# Approval plan: Vector reserve fix

No animation or render has been created.

## Brief

- **Audience:** ICs familiar with vectors, length, capacity, and heap allocation
- **Duration:** 90 seconds
- **Renderer:** Manim
- **Focus:** One persistent vector across repeated appends; no benchmark report
- **Editable choices:** Technical depth, terminology, emphasis, exclusions, and neutral visual style

The final diff removes `items.reserve_exact(batch.len())` and leaves `items.extend(batch)`. The supplied export says `extend` uses its iterator size hint and normal vector growth, with no public API change. The PR description says exact reserve was intended to reduce allocations. The final review says repeated one-element batches forced exact growth and repeated copies, and that removal restores amortized growth.

The early claim that allocator reuse probably made the call harmless conflicts with the final review and is excluded. No benchmark values, allocator guarantees, or exact growth factor are supplied, so the video will not add them.

## Renderer rationale

Manim is appropriate because the vector must retain its identity while its length, capacity, backing buffer, pointer, and elements change. This continuous transformation is more central than editorial composition or mixed media. Capacity values will be labeled illustrative.

## Timed scenes

| Time | Narration and captions | Visuals | Source |
|---|---|---|---|
| 0:00–0:12 | “Bulk append reserved exactly enough space before every append. The call was intended to reduce allocations.” | Persistent vector receives one-element batches. | PR description; implementer notes |
| 0:12–0:32 | “The final review reports that these batches forced exact growth and repeated copies.” | Length meets capacity; a larger illustrative buffer appears; elements copy; repeat. | Final review; implementer notes |
| 0:32–0:43 | “The supplied description identifies quadratic behavior across repeated reserve calls.” | Copy passes accumulate around the stable vector. | Task prompt |
| 0:43–0:56 | “The final diff removes `reserve_exact`. The call to `extend` remains.” | Show exact two-line diff and remove the first line. | Final diff |
| 0:56–1:16 | “`extend` uses its size hint and normal vector growth. The review states that removal restores amortized growth.” | Illustrative spare capacity appears; later batches fill it. | PR export; final review |
| 1:16–1:30 | “The collection uses geometric growth for these appends. There is no public API change.” | Hold final vector beside the two source-stated labels. | PR description; PR export |

Use the narration text verbatim for captions, split into readable cues during production.

## Visual treatment

Use a dark 16:9 background, off-white text, blue for the persistent vector and spare capacity, amber for reallocations and copies, and monospace code. No brand assets were supplied.

Please approve or revise the audience treatment, renderer, scenes, narration, duration, and visual style. Production remains paused until approval.

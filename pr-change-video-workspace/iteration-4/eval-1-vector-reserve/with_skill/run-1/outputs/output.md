# Video plan: Avoid exact reserve during incremental append

**Awaiting approval. No animation source or render has been created.**

## Treatment

- **Audience:** IC
- **Editable fine-tuning:** Assume knowledge of vector length, capacity, heap allocation, and amortized growth. Show the mechanism without a formal proof. Use precise terminology. Emphasize one persistent vector. Exclude benchmark figures, allocator internals, exact growth factors, and unrelated code. Keep the tone direct.
- **Renderer:** Manim
- **Duration:** 90 seconds
- **Source-stated message:** Repeated one-element batches forced exact growth and repeated copies. The final change removes `reserve_exact`; `extend` uses normal vector growth, restoring amortized growth. There is no public API change.

## Content ledger

- **P1 — implementation, final diff:** Remove `items.reserve_exact(batch.len())`; retain `items.extend(batch)`.
- **P2 — implementation, PR export:** `extend` uses the iterator size hint and normal growth. No public API changes.
- **C1 — context, PR description:** Exact reserve was intended to reduce allocations; the replacement is geometric growth.
- **C2 — context, task and final review:** Repeated reserve calls caused quadratic behavior; the benchmark confirmed exact growth and repeated copies; removal restores amortized growth.
- **C3 — context, implementer notes:** Use a persistent vector, length, capacity, heap buffers, reallocations, and copied elements; do not make a benchmark report.
- **Contradiction:** The early claim that allocator reuse made the call “probably harmless” conflicts with C2 and is excluded from the video.
- **Caveat:** No benchmark values, allocator guarantee, or exact growth factor is supplied. Visual capacities are illustrative.

## Not represented

PR chronology, the contradicted hypothesis, benchmark procedure, unsupported consequences, conclusions, actions, and discussion prompts.

## Renderer decision

- **Required primitives:** Stable vector identity; changing length and capacity; replaced buffers; copied elements; spare capacity.
- **Why Manim:** C3 requires persistent objects whose state and relationships transform over time.
- **Why not Remotion:** The explanation depends on object continuity, not screenshots or mixed-media composition.
- **Risk:** Mark capacity values “illustrative”; production requires Manim and FFmpeg.

## Timed scenes

The narration column is also the verbatim caption source; production can split each entry into shorter timed cues.

| Time | Purpose | Narration and caption text | Visual state and motion | On-screen text | Provenance |
|---|---|---|---|---|---|
| 0:00–0:12 | Old behavior and stated intent | “Bulk append reserved exactly enough space before every append. That call was intended to reduce allocations.” | Stable `items` vector receives one-element batches; exact reserve activates. | “Reserve exactly enough” | C1, C3 |
| 0:12–0:32 | Reviewed failure | “With repeated one-element batches, exact growth replaced heap buffers and copied existing elements again.” | Length meets capacity; illustrative larger buffer appears; elements copy; pointer moves; repeat. | `length`; `capacity`; “copy” | C2, C3 |
| 0:32–0:43 | Supplied complexity description | “The supplied change description identifies quadratic behavior across these repeated reserve calls.” | Copy passes accumulate while the vector identity remains fixed. | “Quadratic behavior” | C2 |
| 0:43–0:56 | Implemented change | “The final diff removes `items.reserve_exact(batch.len())`. `items.extend(batch)` remains.” | Show the exact diff; removed line exits. | “Remove exact reserve” | P1 |
| 0:56–1:16 | New behavior and reviewed result | “`extend` uses its iterator size hint and normal vector growth. The final review states that removing `reserve_exact` restores amortized growth.” | One illustrative growth step leaves spare cells; later batches occupy them. | “Normal growth”; “Amortized growth restored” | P2, C2, C3 |
| 1:16–1:30 | Source boundary | “The collection uses its geometric growth path for these appends. There is no public API change.” | Hold the vector beside two closing labels. | “Geometric growth”; “No public API change” | C1, P2 |

## Visual system

No brand assets were supplied. Use 16:9, a dark neutral background, off-white text, blue for the persistent vector and spare capacity, amber for reallocations and copies, sans-serif labels, and monospace code.

## Approval checklist

- [ ] Source meaning and contradiction handling
- [ ] IC treatment and exclusions
- [ ] Manim and visual system
- [ ] Timed scenes, narration/captions, and 90-second duration

Approve or edit this packet. Production remains paused until approval.

# Video plan: Avoid exact reserve during incremental append

**Approval status:** Awaiting approval. No animation source or rendered video exists.

## Treatment

- **Audience preset:** IC
- **Renderer:** Manim
- **Target duration:** 90 seconds
- **Source-stated message:** Repeated one-element batches forced exact growth and repeated copies. The final change removes `reserve_exact`, leaving `extend` to use the iterator size hint and normal vector growth. The review states that this restores amortized growth. There is no public API change.

### Editable audience treatment

- **Assumed knowledge:** Vector length and capacity; heap allocation; amortized growth.
- **Technical depth:** Show the allocation mechanism; do not present a formal complexity proof.
- **Terminology:** `length`, `capacity`, `heap buffer`, `reallocation`, `copy`, `reserve_exact`, `extend`, `amortized growth`.
- **Emphasis:** One persistent vector across repeated one-element batches.
- **Exclusions:** Benchmark values or charts, allocator internals, an exact growth factor, and unrelated code.
- **Tone:** Precise and direct.

These are presentation recommendations. They can change without changing the source-stated message.

## Content ledger

### Implementation facts from the PR

- **[P1, final diff]** The final change removes `items.reserve_exact(batch.len())` and retains `items.extend(batch)`.
- **[P2, final-diff context]** `extend` uses the iterator size hint and the vector's normal growth strategy.
- **[P3, final-diff context]** There are no public API changes.

### Narrative claims from user-provided context

- **[C1, task prompt]** Repeated vector reserve calls caused quadratic reallocations.
- **[C2, PR description]** The old exact-reserve call was intended to reduce allocations. The PR replaces it with the collection's geometric growth path.
- **[C3, final review]** A benchmark confirmed that repeated one-element batches forced exact growth and repeated copies. Removing `reserve_exact` restores amortized growth.
- **[C4, implementer notes]** Explain the failure with a persistent vector, length, capacity, heap buffers, reallocations, and copied elements. Do not make the video a benchmark report.

### Contradictions and caveats

- **[C5, early discussion]** The implementer initially said that the allocator should reuse the existing allocation and that the old call was probably harmless. This conflicts with C3 and is not presented as the final explanation.
- The sources do not provide benchmark values, an exact geometric growth factor, allocator guarantees, or platform-specific behavior. None will appear.
- Small capacities used in the visual are illustrative only.

## Omissions required for duration

- The early contradicted hypothesis is recorded in this packet but omitted from narration.
- Benchmark procedure and results are omitted; only C3's stated finding remains.
- The video does not walk through PR history or add consequences beyond those stated in the sources.

## Renderer decision

- **Required visual primitives:** A persistent vector; changing length and capacity; replacement heap buffers; copied elements; later appends occupying spare capacity.
- **Why Manim:** C4 explicitly asks for persistent objects whose state and relationships change. Manim supports continuous transformations of the vector, pointer, buffers, and elements.
- **Why not Remotion:** The source contains no screenshots or mixed media. Timeline composition would not represent the requested object continuity as directly.
- **Production dependency:** Manim and FFmpeg. Capacity values must remain labeled “illustrative.”

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content | Provenance |
|---|---|---|---|---|
| 0:00–0:12 | State the supplied problem | “Bulk append reserved exactly enough space before every append. That call was intended to reduce allocations.” | Persistent `items` vector; incoming batches; `reserve_exact` | Context claims C2, C4 |
| 0:12–0:32 | Show the reviewed failure | “With repeated one-element batches, exact growth replaced the heap buffer and copied the existing elements again. The final review reports repeated exact growth and repeated copies.” | Stable vector identity; length/capacity; buffer replacement; copied cells | Context claims C3, C4 |
| 0:32–0:43 | State the supplied complexity description | “Across these repeated reserve calls, the supplied change description identifies quadratic reallocation behavior.” | Several copy passes; `quadratic reallocations` | Context claim C1 |
| 0:43–0:56 | Show the final implementation | “The final diff removes `items.reserve_exact(batch.len())`. `items.extend(batch)` remains.” | Exact two-line diff; removed line exits | Implementation fact P1 |
| 0:56–1:16 | Show the implemented growth path and reviewed result | “`extend` uses the iterator size hint and the vector's normal growth strategy. The review states that removing `reserve_exact` restores amortized growth.” | Illustrative spare capacity; several appends without a buffer replacement | Implementation fact P2; context claim C3; visual framing C4 |
| 1:16–1:30 | State the source boundary | “The collection now uses its geometric growth path for these appends. There is no public API change.” | `geometric growth path`; `No public API change`; `capacity illustrative` | Context claim C2; implementation fact P3 |

Total: **90 seconds**.

## Storyboard

### Scene 1: Exact reserve before append

- **Duration:** 12 seconds
- **Purpose:** Present the old behavior and its stated intent.
- **Visual state and motion:** A stable vector labeled `items` points to a heap buffer. One-element batches enter; `reserve_exact` activates before append.
- **On-screen text:** “Reserve exactly enough” / “Intended to reduce allocations”
- **Provenance type and evidence references:** Context-supported claims C2 and C4
- **Transition:** Follow the pointer from the vector to the buffer.

### Scene 2: Repeated buffer replacement

- **Duration:** 20 seconds
- **Purpose:** Visualize the failure described by the final review.
- **Visual state and motion:** Keep the vector fixed. Show length meeting capacity, create a one-cell-larger illustrative buffer, copy existing cells, redirect the pointer, and repeat.
- **On-screen text:** `length`, `capacity`, `new heap buffer`, `copy existing elements`
- **Provenance type and evidence references:** Context-supported claims C3 and C4
- **Transition:** Retain the copy paths as the view widens.

### Scene 3: Quadratic reallocations

- **Duration:** 11 seconds
- **Purpose:** State the problem description supplied by the task.
- **Visual state and motion:** Compress repeated buffer changes into a growing stack of copy passes.
- **On-screen text:** “Quadratic reallocations”
- **Provenance type and evidence references:** Context-supported claim C1
- **Transition:** Copy paths collapse into the removed diff line.

### Scene 4: Final diff

- **Duration:** 13 seconds
- **Purpose:** Show only the implemented change.
- **Visual state and motion:** Display both lines. Remove `items.reserve_exact(batch.len())`; retain `items.extend(batch)`.
- **On-screen text:** “Remove `reserve_exact`” / “Keep `extend`”
- **Provenance type and evidence references:** Implementation fact P1
- **Transition:** `extend` becomes the label on the next append.

### Scene 5: Normal vector growth

- **Duration:** 20 seconds
- **Purpose:** Present P2 and C3 through the requested vector model.
- **Visual state and motion:** Show one illustrative growth step that leaves spare cells. Advance length through later appends while the buffer remains visible.
- **On-screen text:** “Iterator size hint” / “Normal vector growth” / “Amortized growth restored” / “Illustrative capacity”
- **Provenance type and evidence references:** Implementation fact P2; context claims C3 and C4
- **Transition:** Hold the final vector and replace detail labels with the closing statements.

### Scene 6: Source-stated result and boundary

- **Duration:** 14 seconds
- **Purpose:** End on the result and scope stated in the sources.
- **Visual state and motion:** The vector stays on screen beside two neutral statements.
- **On-screen text:** “Geometric growth path” / “No public API change”
- **Provenance type and evidence references:** Context claim C2; implementation fact P3
- **Transition:** Fade out.

## Narration script

**0:00–0:12**  
Bulk append reserved exactly enough space before every append. That call was intended to reduce allocations.

**0:12–0:32**  
With repeated one-element batches, exact growth replaced the heap buffer and copied the existing elements again. The final review reports repeated exact growth and repeated copies.

**0:32–0:43**  
Across these repeated reserve calls, the supplied change description identifies quadratic reallocation behavior.

**0:43–0:56**  
The final diff removes `items.reserve_exact(batch.len())`. `items.extend(batch)` remains.

**0:56–1:16**  
`extend` uses the iterator size hint and the vector's normal growth strategy. The review states that removing `reserve_exact` restores amortized growth.

**1:16–1:30**  
The collection now uses its geometric growth path for these appends. There is no public API change.

## Captions

| Time | Caption |
|---|---|
| 00:00–00:06 | Bulk append reserved exactly enough space before every append. |
| 00:06–00:12 | That call was intended to reduce allocations. |
| 00:12–00:22 | One-element batches caused exact growth and buffer replacement. |
| 00:22–00:32 | Existing elements were copied again. |
| 00:32–00:43 | The supplied description identifies quadratic reallocations. |
| 00:43–00:50 | The final diff removes `reserve_exact`. |
| 00:50–00:56 | `items.extend(batch)` remains. |
| 00:56–01:06 | `extend` uses its size hint and normal vector growth. |
| 01:06–01:16 | The review states that this restores amortized growth. |
| 01:16–01:24 | The collection uses its geometric growth path. |
| 01:24–01:30 | There is no public API change. |

## Visual system

No brand assets were supplied. Use a 16:9 dark neutral background, off-white text, cool blue for the persistent vector and spare capacity, warm amber for reallocations and copies, sans-serif labels, and monospace code. Keep the vector's color and label stable through every buffer transformation.

## Approval checklist

- [ ] Source content is represented without added interpretation
- [ ] IC audience treatment
- [ ] Manim renderer
- [ ] Storyboard, narration, and captions
- [ ] 90-second duration
- [ ] Neutral fallback visual treatment

Approve this packet or provide edits. Production will not start before approval.

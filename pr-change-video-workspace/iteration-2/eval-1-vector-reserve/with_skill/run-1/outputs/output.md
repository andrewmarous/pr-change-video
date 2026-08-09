# Video plan: Avoid exact reserve during incremental append

**Status:** Awaiting user approval. No animation source has been created, and no video has been rendered.

## Recommendation summary

- **Audience preset:** IC
- **Fine-tuning:** Mechanism-first, precise, and compact; explain one persistent vector rather than survey the PR.
- **Renderer:** Manim
- **Target duration:** 90 seconds
- **Primary takeaway:** Repeated `reserve_exact` calls on incremental appends forced exact growth and repeated copies. The final change removes that call so `extend` uses normal vector growth and restores amortized growth.
- **Follow-up conversation this enables:** Decide whether this path needs performance regression coverage and whether similar incremental-append paths deserve review.

### Editable IC assumptions

- **Assumed viewer knowledge:** Understands vectors, heap allocation, and basic complexity; does not know this call path.
- **Desired takeaway:** Understand why the removed line changes allocation behavior despite the small diff.
- **Technical depth:** Show length, capacity, buffer replacement, and copies; do not derive amortized analysis formally.
- **Terminology:** Use `length`, `capacity`, `heap buffer`, `reallocation`, `copy`, `reserve_exact`, `extend`, and `amortized growth`. Define capacity through the visual.
- **Emphasis:** Repeated one-element batches and the continuity of a single vector across backing-buffer changes.
- **Exclusions:** Benchmark charts or values, allocator internals, exact growth-factor claims, and a chronological PR walkthrough.
- **Tone:** Diagnostic and matter-of-fact.
- **Discussion enabled:** Regression coverage and whether other call sites override normal collection growth.

All fields above are recommendations and can be changed before approval.

## Evidence and confidence

### Implementation facts from the PR

- **[P1 — final diff]** The final change removes `items.reserve_exact(batch.len())` and retains `items.extend(batch)`.
- **[P2 — final diff annotation]** `extend` uses the iterator size hint and the vector's normal growth strategy.
- **[P3 — final diff annotation]** There is no public API change.

These facts describe only the implemented code and behavior. They do not establish the creator's motivation or evaluation by themselves.

### Narrative claims from user-provided context

- **[C1 — task prompt]** The change fixes repeated vector reserve calls causing quadratic reallocations.
- **[C2 — PR description]** The old exact-reserve call was intended to reduce allocations, and the requested replacement is the collection's geometric growth path.
- **[C3 — final review]** A benchmark confirmed that repeated one-element batches forced exact growth and repeated copies; removing `reserve_exact` restores amortized growth.
- **[C4 — implementer notes]** Explain the failure with a persistent vector, length, capacity, heap buffers, reallocations, and copied elements. Do not make a benchmark report.
- **[C5 — early discussion]** The implementer initially said allocator reuse should make the call harmless. This is an attributed early hypothesis, not implemented behavior.

### Missing narrative context and questions

- No benchmark values, workload distribution, runtime version, allocator guarantee, or exact geometric growth factor are supplied. The plan excludes all such claims.
- The request does not specify whether regression coverage already exists. The closing line asks about it; it does not claim coverage is absent.
- No brand assets are supplied. The plan recommends the neutral fallback treatment below.

### Contradictions and caveats

- **Material contradiction:** C5 says the old call was probably harmless. C3 says the benchmark confirmed exact growth and repeated copies. P1 shows that the final implementation removes the call. The plan treats C5 only as a superseded hypothesis and uses the final diff for what shipped.
- The visual will use small illustrative capacities. It will not imply a guaranteed doubling factor or a particular allocator implementation.
- “Quadratic” is supported by the user's task framing; “repeated copies” and “restores amortized growth” are directly attributed to the final review. The code alone is not used to invent these evaluative claims.

## Content boundaries

### Include

- One stable vector identity across the full explanation.
- The old path's repeated exact growth and element copies, as stated in C1 and C3.
- Length, capacity, backing buffers, and copied elements, as requested in C4.
- The exact final code change from P1.
- Normal growth via `extend` from P2 and restored amortized growth from C3.
- No-public-API-change boundary from P3.

### Exclude

- Numeric performance claims and benchmark graphics.
- A specific capacity multiplier.
- Allocator guarantees or implementation detail not in the context set.
- Any claim that maintainability, safety, or scalability changed.
- The early “harmless” statement as a valid explanation.

## Renderer decision

### Required visual primitives

- A persistent vector whose length and capacity change.
- A stable pointer relationship that can move from one heap buffer to another.
- Existing elements visibly copied during reallocation.
- A contrast in which spare capacity permits later appends without another buffer move.

### Evidence for Manim

The implementer notes explicitly request a persistent vector, length, capacity, buffers, reallocations, and copied elements (C4). The final review identifies repeated exact growth and copies as the failure mechanism (C3). Comprehension therefore depends on objects retaining identity while state and relationships evolve. Manim's direct transformations and spatial continuity fit that explanatory job.

### Why Remotion is weaker

Remotion could arrange the diff and explanatory cards, but this plan's dominant primitive is not editorial composition. It is continuity: the viewer must track the same vector while buffers are allocated, populated, and replaced. Slide-like cuts would make that causal sequence harder to follow.

### Dependencies and risks

- Production needs Manim and FFmpeg.
- Illustrative capacities must be labeled so they are not mistaken for runtime guarantees.
- Copy animations can become busy; use a small number of cells and a single copy counter.
- Keep the whole video in Manim; no mixed-renderer pipeline is proposed.

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content | Provenance |
|---|---|---|---|---|
| 0:00–0:10 | State the documented failure | “This path reserved exactly enough space before every append. With repeated small batches, the intended allocation optimization caused repeated growth instead.” | One vector; queued `+1` batches; “Exact reserve, repeated growth” | C1, C2, C3 |
| 0:10–0:27 | Show the old mechanism | “When length meets capacity, the next exact reserve creates a just-larger buffer and copies the existing elements. Then the cycle repeats.” | Length/capacity counters; old and new buffers; copy counter | C3, C4 |
| 0:27–0:39 | Name the accumulated behavior | “For one-element batches, those repeated copies produce the quadratic behavior this change fixes.” | `1 + 2 + 3 + …` copy motif; “quadratic total work” | C1, C3 |
| 0:39–0:51 | Show what changed | “The final diff removes `reserve_exact`. The append now goes directly through `extend`.” | Exact two-line-to-one-line diff | P1 |
| 0:51–1:10 | Show implemented growth behavior and reviewed impact | “`extend` uses its iterator size hint and the vector's normal growth strategy. Spare capacity lets later appends reuse the buffer, restoring amortized growth.” | Illustrative spare cells; several appends without buffer replacement | P2 for mechanism; C3 for evaluative result; C4 for visual framing |
| 1:10–1:21 | Bound the change | “This changes the internal append path. The public API stays the same, and this video makes no claim about a specific growth factor.” | “Internal growth path” / “No public API change” / “Capacity illustrative” | P3; missing-context caveat |
| 1:21–1:30 | Prepare follow-up | “For discussion: should this path get performance regression coverage, and are there similar exact-reserve call sites?” | Two clearly marked questions | Planning questions; no factual claim |

Total: **90 seconds**.

## Storyboard

### Scene 1: Intended optimization, documented failure

- **Duration:** 10 seconds
- **Purpose:** Establish the problem using supplied context, not an interpretation of the diff.
- **Visual state and motion:** A persistent `items` vector receives a queue of one-element batches. A `reserve exact +1` tag activates before each arrival.
- **On-screen text:** “Exact reserve, repeated growth”
- **Provenance type and evidence references:** Context-supported claim — C1, C2, C3
- **Transition:** Move the camera from the vector object to its buffer pointer.

### Scene 2: The repeated-copy loop

- **Duration:** 17 seconds
- **Purpose:** Visualize the behavior confirmed by the final review.
- **Visual state and motion:** Keep the vector identity fixed. When length equals capacity, create a one-cell-larger illustrative buffer, copy cells across, redirect the pointer, append, and repeat.
- **On-screen text:** `length`, `capacity`, `new buffer`, `copy existing elements`
- **Provenance type and evidence references:** Context-supported claim and requested framing — C3, C4
- **Transition:** Pull back while copy paths remain visible.

### Scene 3: Accumulated work

- **Duration:** 12 seconds
- **Purpose:** Connect the repeated-copy model to the stated quadratic failure.
- **Visual state and motion:** Collapse successive copy counts into `1 + 2 + 3 + …`; pair it with the growing element count without a formal proof.
- **On-screen text:** “Repeated copies → quadratic total work”
- **Provenance type and evidence references:** Context-supported claim — C1, C3
- **Transition:** Collapse the sum into the line removed by the diff.

### Scene 4: The final change

- **Duration:** 12 seconds
- **Purpose:** Present exactly what the PR implements.
- **Visual state and motion:** Show the two relevant lines. Remove `items.reserve_exact(batch.len())`; keep `items.extend(batch)` centered.
- **On-screen text:** “Remove explicit exact reserve” / “Keep extend”
- **Provenance type and evidence references:** Implementation fact — P1
- **Transition:** The remaining `extend` call becomes the label on the vector operation.

### Scene 5: Normal vector growth

- **Duration:** 19 seconds
- **Purpose:** Show the implemented mechanism and the reviewed outcome without inventing a growth factor.
- **Visual state and motion:** An illustrative buffer with spare cells appears. Several one-element batches advance length while capacity and the buffer remain stable.
- **On-screen text:** “Iterator size hint” / “Normal growth” / “Spare capacity” / “Illustrative”
- **Provenance type and evidence references:** Implementation fact — P2; context-supported outcome and framing — C3, C4
- **Transition:** Align old and new visual states for a compact comparison.

### Scene 6: Scope and caveat

- **Duration:** 11 seconds
- **Purpose:** State only documented boundaries.
- **Visual state and motion:** Fade the internal buffer model into an unchanged API boundary; retain a small “illustrative capacity” badge.
- **On-screen text:** “Amortized growth restored” / “No public API change”
- **Provenance type and evidence references:** Context-supported outcome — C3; implementation fact — P3; missing-context caveat
- **Transition:** Slide the result upward to reveal questions.

### Scene 7: Follow-up questions

- **Duration:** 9 seconds
- **Purpose:** Prepare the creator conversation without alleging missing work.
- **Visual state and motion:** Present two questions one at a time on a restrained end card.
- **On-screen text:** “Regression coverage?” / “Similar call sites?”
- **Provenance type and evidence references:** Planning questions, explicitly not factual claims
- **Transition:** Fade out.

## Narration script

**0:00–0:10**  
This path reserved exactly enough space before every append. With repeated small batches, the intended allocation optimization caused repeated growth instead.

**0:10–0:27**  
When length meets capacity, the next exact reserve creates a just-larger buffer and copies the existing elements. Then the cycle repeats.

**0:27–0:39**  
For one-element batches, those repeated copies produce the quadratic behavior this change fixes.

**0:39–0:51**  
The final diff removes `reserve_exact`. The append now goes directly through `extend`.

**0:51–1:10**  
`extend` uses its iterator size hint and the vector's normal growth strategy. Spare capacity lets later appends reuse the buffer, restoring amortized growth.

**1:10–1:21**  
This changes the internal append path. The public API stays the same, and this video makes no claim about a specific growth factor.

**1:21–1:30**  
For discussion: should this path get performance regression coverage, and are there similar exact-reserve call sites?

## Caption plan

Use sentence-level captions inside the lower safe area. Limit each cue to two lines and keep code identifiers exact.

| Cue | Time | Caption |
|---|---|---|
| 1 | 00:00–00:05 | This path reserved exactly enough space before every append. |
| 2 | 00:05–00:10 | With small batches, the intended optimization caused repeated growth. |
| 3 | 00:10–00:18 | When length meets capacity, exact reserve creates a just-larger buffer. |
| 4 | 00:18–00:27 | It copies existing elements, and the cycle repeats. |
| 5 | 00:27–00:39 | Those repeated copies produce the quadratic behavior this change fixes. |
| 6 | 00:39–00:45 | The final diff removes `reserve_exact`. |
| 7 | 00:45–00:51 | The append goes directly through `extend`. |
| 8 | 00:51–01:00 | `extend` uses its size hint and normal vector growth. |
| 9 | 01:00–01:10 | Spare capacity lets later appends reuse the buffer. |
| 10 | 01:10–01:16 | The public API stays the same. |
| 11 | 01:16–01:21 | No specific growth factor is claimed. |
| 12 | 01:21–01:26 | Should this path get regression coverage? |
| 13 | 01:26–01:30 | Are there similar exact-reserve call sites? |

## Visual system and branding

No brand assets were provided. Use the restrained fallback: 16:9 at 1920×1080; dark neutral background; off-white primary text; cool blue for the stable vector and spare capacity; warm amber for allocations, warnings, and copies; modern sans-serif labels; monospace only for code. Keep the persistent vector blue throughout so its identity survives buffer transformations.

## Approval checklist

- [ ] Audience preset and editable assumptions
- [ ] Message, takeaway, and provenance boundaries
- [ ] Content inclusions, exclusions, contradiction, and caveats
- [ ] Manim renderer decision
- [ ] Storyboard, narration, and captions
- [ ] 90-second duration
- [ ] Restrained fallback visual treatment

Reply with approval or requested planning changes. Production remains blocked until you approve this packet.

# Video plan: Avoid exact reserve during incremental append

Status: **Awaiting user approval.** No animation source has been created and no video has been rendered.

## Recommendation summary

- **Audience preset:** IC (recommended)
- **Renderer:** Manim (recommended)
- **Target duration:** 90 seconds
- **Primary takeaway:** Calling `reserve_exact` before each small append defeated geometric growth and caused repeated allocation and copying. Removing that call lets `extend` use the vector's normal amortized-growth strategy.
- **Follow-up conversation this enables:** Where else do callers override collection growth, and what benchmark or regression coverage should protect this behavior?

### Editable audience assumptions

- **Assumed viewer knowledge:** Familiar with vectors, heap allocation, length, capacity, and amortized complexity; not expected to know this code path.
- **Technical depth:** Mechanism-first. Show allocation behavior rather than derive complexity formally.
- **Terminology:** Use “vector,” “length,” “capacity,” “heap buffer,” “reallocation,” “copy,” “exact growth,” and “geometric growth.” Define capacity visually.
- **Emphasis:** The persistent vector and how its backing buffer changes across repeated one-element batches.
- **Exclusions:** Benchmark charts, allocator internals, source-file walkthrough, unrelated collection APIs, and claims about exact growth factors.
- **Tone:** Precise, compact, and diagnostic rather than celebratory.
- **Discussion prompt:** Should this path gain a performance regression test, and are there similar `reserve_exact` calls in incremental append paths?

You can edit any assumption above before approval.

## Evidence and confidence

### Verified implementation

- **[E1, final diff]** The PR removes `items.reserve_exact(batch.len())` and leaves `items.extend(batch)` in place.
- **[E2, final diff]** `extend` uses the iterator size hint and the vector's normal growth strategy.
- **[E3, final diff]** The PR makes no public API change.
- **[E4, final review]** The reviewer reports that repeated one-element batches previously forced exact growth and repeated copies, and that the change restores amortized growth. This corroborates the behavior visible in the final change.

### Stated intent

- **[E5, PR description]** The goal is to stop calling exact reserve before every bulk append and restore geometric growth.
- **[E6, implementer notes]** The preferred explanation follows one persistent vector through length, capacity, heap buffers, reallocations, and copied elements.

### Inferences

- The performance benefit is greatest for repeated small batches because exact growth can repeatedly exhaust capacity. The fixture demonstrates one-element batches but provides no numeric speedup claim.
- A single stable vector identity is the clearest visual anchor; its backing buffer may change while the vector itself persists.

### Contradictions and caveats

- **Contradicted early discussion:** The early statement that the allocator “should reuse the existing allocation” and that the old call was “probably harmless” conflicts with the final diff's rationale and the final review's benchmark-confirmed repeated copies. The final diff is authoritative; the video will not repeat the early claim as fact.
- The fixture does not specify the vector's exact geometric growth factor, allocator behavior, benchmark values, language/runtime version, or platform. The animation will use illustrative capacity steps without presenting a specific factor as guaranteed behavior.
- The final review supplies the benchmark conclusion, but this video will not become a benchmark report or invent measurements.

## Content boundaries

### Include

- One persistent vector receiving repeated one-element batches.
- Length and capacity as distinct values.
- The old path: exact reserve, a just-big-enough buffer, reallocation, and copies on subsequent appends.
- The new path: `extend` using normal growth, leaving spare capacity and amortizing future appends.
- The two-line-to-one-line code change and “no public API change.”
- A short follow-up prompt about regression coverage and similar call sites.

### Exclude

- Numeric benchmark results or an implied speedup percentage.
- Claims about a guaranteed doubling factor.
- Detailed allocator implementation, memory safety, or API behavior not present in the fixture.
- A chronological tour of the PR discussion.

## Renderer decision

### Required visual primitives

- A vector object that preserves identity while length and capacity update.
- Backing heap buffers that are replaced while the viewer tracks the same vector.
- Elements moving from an old buffer to a new one during reallocation.
- Side-by-side or sequential comparison of exact versus geometric growth.

### Evidence for Manim

The core explanation depends on persistent objects changing state and relationship over time: the vector's length and capacity evolve, its backing buffer is replaced, and existing elements are copied. Manim's object transformations and spatial continuity directly encode that mechanism. This choice follows the final review's repeated-copy finding and the implementer note's requested visual vocabulary.

### Why Remotion is weaker here

Remotion could compose code cards and before/after slides, but the audience would have to infer the repeated allocation cycle. The key teaching moment is continuous transformation of the same vector across appends, not editorial arrangement of mixed media.

### Dependencies and risks

- Requires a working Manim and FFmpeg environment for production.
- Capacity steps must be labeled “illustrative” so the animation does not imply an undocumented growth factor.
- Dense element-by-element copies can become visually noisy; use a small number of cells and a copy counter.

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content |
|---|---|---|---|
| 0:00–0:10 | Establish failure mode | “This append path tried to avoid allocations by reserving exactly enough space before every batch. With repeated small batches, it did the opposite.” | Persistent vector; repeated `+1` batches; title: “Exact reserve, repeated work” |
| 0:10–0:27 | Show old behavior | “After each append, length catches capacity. The next exact reserve asks for one more slot, replaces the heap buffer, and copies the existing elements again.” | Length/capacity counters; buffer replacement; elements copied; copy counter rises |
| 0:27–0:40 | Make cost intuitive | “As the vector grows, each new element can trigger copying of everything already there. Across the sequence, that repeated work grows quadratically.” | Copy arcs accumulate; concise label: “1 + 2 + 3 + … copies” |
| 0:40–0:52 | Present code change | “The fix removes the explicit `reserve_exact` call. The append now goes directly through `extend`.” | Diff: remove `reserve_exact`; retain `extend(batch)` |
| 0:52–1:11 | Show new behavior | “`extend` uses the iterator size hint and the vector's normal growth strategy. A reallocation can leave spare capacity, so later appends reuse the same buffer.” | Same vector identity; larger illustrative buffer; several appends fill spare cells without moving prior elements |
| 1:11–1:22 | State impact and scope | “That restores amortized growth for incremental batches. The public API does not change; the improvement is inside the append path.” | Old/new copy counters; “Amortized growth restored”; “No public API change” |
| 1:22–1:30 | Enable discussion | “The follow-up question is where else exact reserve overrides collection growth—and how we should guard this path against regression.” | Two discussion prompts; end card |

Total: **90 seconds**.

## Storyboard

### Scene 1: The optimization that backfires

- **Duration:** 10 seconds
- **Purpose:** Frame the engineering problem without beginning with code trivia.
- **Visual state and motion:** A stable `items` vector receives a queue of one-element batches. Length and capacity begin equal. Each incoming batch pulses a warning on “reserve exactly +1.”
- **On-screen text:** “Exact reserve, repeated work”
- **Evidence references:** E1, E4, E5
- **Transition:** Camera moves from the vector handle to its heap-buffer pointer.

### Scene 2: Reallocation loop

- **Duration:** 17 seconds
- **Purpose:** Explain why the old path repeats work.
- **Visual state and motion:** Preserve the vector handle. Create a just-one-cell-larger buffer, animate existing cells copying across, switch the pointer, then repeat twice. Update length, capacity, and a copy counter.
- **On-screen text:** “length = capacity” / “new buffer” / “copy existing elements”
- **Evidence references:** E4, E6; capacity values explicitly labeled illustrative
- **Transition:** Pull back to show the accumulated copy paths.

### Scene 3: Cost accumulates

- **Duration:** 13 seconds
- **Purpose:** Connect repeated copies to quadratic work without turning this into a formal proof.
- **Visual state and motion:** Stack copy counts from successive appends into `1 + 2 + 3 + …`; the total grows faster than the element count.
- **On-screen text:** “Repeated incremental copies → quadratic total work”
- **Evidence references:** E4 and the task's verified failure description
- **Transition:** Collapse the copy paths into the removed diff line.

### Scene 4: The final diff

- **Duration:** 12 seconds
- **Purpose:** Show the exact implemented change.
- **Visual state and motion:** Two-line snippet appears; `items.reserve_exact(batch.len())` turns red and exits; `items.extend(batch)` remains centered.
- **On-screen text:** “Remove exact reserve” / “Keep extend”
- **Evidence references:** E1, E2
- **Transition:** The remaining `extend` call flows into the vector model.

### Scene 5: Normal growth path

- **Duration:** 19 seconds
- **Purpose:** Contrast the new mechanism with the old loop.
- **Visual state and motion:** One illustrative larger buffer replaces the full buffer and retains open cells. Several batches arrive; length advances while capacity remains stable and existing elements do not move.
- **On-screen text:** “Spare capacity” / “Reuse the buffer” / “Illustrative capacity”
- **Evidence references:** E2, E4, E5
- **Transition:** Old and new paths align for comparison.

### Scene 6: Impact and boundary

- **Duration:** 11 seconds
- **Purpose:** State the verified result and prevent scope inflation.
- **Visual state and motion:** Old copy counter continues rising; new path shows fewer reallocation events. Then both simplify into a result card.
- **On-screen text:** “Amortized growth restored” / “No public API change”
- **Evidence references:** E3, E4
- **Transition:** Result card slides upward to reveal the discussion prompt.

### Scene 7: Follow-up

- **Duration:** 8 seconds
- **Purpose:** Prepare the IC audience for conversation with the creator.
- **Visual state and motion:** Two questions appear one at a time; restrained end card.
- **On-screen text:** “Other exact-reserve call sites?” / “Regression coverage?”
- **Evidence references:** Clearly labeled planning recommendations, not implemented claims
- **Transition:** Fade out.

## Narration script

**0:00–0:10**  
This append path tried to avoid allocations by reserving exactly enough space before every batch. With repeated small batches, it did the opposite.

**0:10–0:27**  
After each append, length catches capacity. The next exact reserve asks for one more slot, replaces the heap buffer, and copies the existing elements again.

**0:27–0:40**  
As the vector grows, each new element can trigger copying of everything already there. Across the sequence, that repeated work grows quadratically.

**0:40–0:52**  
The fix removes the explicit `reserve_exact` call. The append now goes directly through `extend`.

**0:52–1:11**  
`extend` uses the iterator size hint and the vector's normal growth strategy. A reallocation can leave spare capacity, so later appends reuse the same buffer.

**1:11–1:22**  
That restores amortized growth for incremental batches. The public API does not change; the improvement is inside the append path.

**1:22–1:30**  
The follow-up question is where else exact reserve overrides collection growth—and how we should guard this path against regression.

## Caption plan

Use sentence-level captions, bottom-centered inside a safe margin, with no more than two lines. Preserve code identifiers in monospace styling if the renderer supports mixed styles.

| Cue | Time | Caption |
|---|---|---|
| 1 | 00:00–00:05 | This path reserved exactly enough space before every batch. |
| 2 | 00:05–00:10 | With repeated small batches, it did the opposite of its intent. |
| 3 | 00:10–00:18 | After each append, length catches capacity. |
| 4 | 00:18–00:27 | The next exact reserve replaces the buffer and copies the elements again. |
| 5 | 00:27–00:34 | Each new element can trigger copying of everything already there. |
| 6 | 00:34–00:40 | Across the sequence, that work grows quadratically. |
| 7 | 00:40–00:46 | The fix removes the explicit `reserve_exact` call. |
| 8 | 00:46–00:52 | The append now goes directly through `extend`. |
| 9 | 00:52–01:02 | `extend` uses the iterator size hint and normal vector growth. |
| 10 | 01:02–01:11 | Spare capacity lets later appends reuse the same buffer. |
| 11 | 01:11–01:17 | That restores amortized growth for incremental batches. |
| 12 | 01:17–01:22 | The public API does not change. |
| 13 | 01:22–01:26 | Where else does exact reserve override collection growth? |
| 14 | 01:26–01:30 | How should we guard this path against regression? |

## Visual system and branding

No brand assets were supplied. Use a restrained 16:9 fallback: dark neutral background, off-white text, cool blue for the vector and retained capacity, warm amber for reallocations and copies, modern sans-serif labels, and monospace code. Give the persistent vector handle a stable blue identity; use buffer outlines and pointer motion consistently. Do not imitate a named creator's distinctive branding.

## Approval checklist

- [ ] Audience preset and editable IC assumptions
- [ ] Message and primary takeaway
- [ ] Content boundaries and caveats
- [ ] Manim renderer choice
- [ ] Storyboard, narration, and captions
- [ ] 90-second duration
- [ ] Restrained fallback visual treatment

Reply with approval or changes. Production remains blocked until this packet is approved.

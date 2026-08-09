# Planning draft: Restoring vector growth behavior

No animation or render has been created. This plan is ready for your approval or edits.

## Recommended approach

- **Audience:** ICs familiar with vectors and basic allocation concepts
- **Length:** 90 seconds
- **Renderer:** Manim
- **Core message:** The old incremental-append path repeatedly requested exact capacity, causing reallocations and copies. The final PR removes that explicit reservation so `extend` can use normal vector growth.
- **Style:** Technical, visual, and mechanism-first; no benchmark report

Editable assumptions: viewers know length versus capacity; the terms heap buffer, reallocation, and amortized growth are appropriate; benchmark numbers and allocator internals are out of scope; and the close should invite discussion about regression coverage and similar call sites.

## Evidence and conflict handling

The final diff is authoritative about the implementation:

```diff
- items.reserve_exact(batch.len());
  items.extend(batch);
```

The fixture also states that `extend` uses the iterator size hint and normal vector growth, and that the public API is unchanged.

The surrounding context supplies the explanation and evaluation. The PR description says exact reserve was intended to reduce allocations. The final review says the benchmark found repeated exact growth and copies for one-element batches, and that removing the call restores amortized growth. The implementer notes request a persistent-vector explanation and explicitly reject a benchmark-report format.

The early comment that allocator reuse would probably make the call harmless conflicts with the final review and the change that actually shipped. It will not be presented as the correct explanation. At most, it can appear as a crossed-out early hypothesis.

No benchmark values, exact capacity multiplier, allocator guarantee, or claim about existing regression coverage is available. The video will not invent them.

## Why Manim

The central explanation is a stateful mechanism: one vector persists while its length, capacity, backing buffer, and copy count change. Manim can preserve the identity of these objects across transformations and make each reallocation spatially legible. A timeline-compositing approach would work for the code diff but would be less effective for showing the repeated buffer changes.

## Timed storyboard

| Time | Scene | Visual and narration |
|---|---|---|
| 0:00–0:10 | Set up the problem | A vector receives repeated `+1` batches. “This path reserved exactly enough space before each append. With repeated small batches, that caused repeated growth.” |
| 0:10–0:28 | Old behavior | Keep the vector identity fixed. Each full buffer is replaced by one with one illustrative extra cell; existing elements copy across. “Length catches capacity, exact reserve creates a new buffer, and all existing elements move again.” |
| 0:28–0:40 | Accumulated cost | Copy counts become `1 + 2 + 3 + …`. “Across one-element batches, this repeated work produces the quadratic behavior described in the PR context.” |
| 0:40–0:52 | Final diff | Remove the `reserve_exact` line and retain `extend(batch)`. “The shipped fix removes the explicit exact reserve.” |
| 0:52–1:10 | New behavior | Show an illustrative growth event leaving spare capacity, then several appends without a new buffer. “`extend` uses its size hint and the vector's normal growth strategy, restoring amortized growth.” |
| 1:10–1:22 | Scope | Show “No public API change” and an “illustrative capacity” qualifier. “This is an internal growth-path change, not an API change or a promise about a specific growth factor.” |
| 1:22–1:30 | Discussion | End card: “Regression coverage?” and “Similar call sites?” “Those are the questions to take into the follow-up with the creator.” |

## Narration script

**0:00–0:10** — This path reserved exactly enough space before each append. With repeated small batches, that caused repeated growth.

**0:10–0:28** — Length catches capacity, exact reserve creates a new buffer, and all existing elements move again. With the next small append, the cycle repeats.

**0:28–0:40** — Across one-element batches, this repeated work produces the quadratic behavior described in the PR context.

**0:40–0:52** — The shipped fix removes the explicit exact reserve and leaves the append to `extend`.

**0:52–1:10** — `extend` uses its iterator size hint and the vector's normal growth strategy. Spare capacity lets later batches reuse the buffer, restoring amortized growth.

**1:10–1:22** — This is an internal growth-path change, not an API change or a promise about a specific growth factor.

**1:22–1:30** — For the follow-up: should this path get regression coverage, and are there similar exact-reserve call sites?

## Caption plan

Use short sentence-level captions in the lower safe area, synchronized to the seven narration blocks. Split the two longer blocks at 0:19 and 1:01 so no caption exceeds two lines. Preserve `reserve_exact` and `extend` exactly in monospace styling.

Key on-screen labels:

- `length`
- `capacity`
- `new heap buffer`
- `copy existing elements`
- `spare capacity`
- `amortized growth restored`
- `no public API change`

## Visual treatment

Use a dark neutral 16:9 frame, off-white text, blue for the persistent vector and reusable capacity, and amber for allocations and copies. Capacity values must carry an “illustrative” label. No brand assets were supplied, so this neutral system is the proposed default.

## Approval points

Please approve or revise the IC assumptions, Manim selection, 90-second sequence, narration, exclusions, visual treatment, and closing questions. I will not begin animation or rendering until the plan is approved.

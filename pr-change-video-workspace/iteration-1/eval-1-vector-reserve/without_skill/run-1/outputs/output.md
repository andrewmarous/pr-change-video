# Proposed video: Restoring efficient vector growth

This is a planning draft for approval. I have not created animation code or rendered the video.

## Creative brief

- **Audience:** Individual contributors who understand vectors and basic allocation behavior
- **Length:** 90 seconds
- **Format:** Manim animation
- **Goal:** Explain how an apparently helpful exact-reserve call created repeated reallocations, and how the final PR restores amortized growth without changing the public API.
- **Tone:** Technical and direct, with one concrete visual model rather than benchmark-heavy reporting

Assumptions you can change: viewers know the difference between vector length and capacity; the video should prioritize the mechanism over benchmark numbers; `reserve_exact`, `extend`, and amortized growth can appear without lengthy definitions; and the closing prompt should focus on regression coverage and similar call sites.

## Source interpretation

The final diff is the governing evidence. It removes:

```text
items.reserve_exact(batch.len());
```

and retains:

```text
items.extend(batch);
```

The final review says repeated one-element batches previously caused exact growth and repeated copies, while removing the call restores amortized growth. The early discussion said allocator reuse probably made the old call harmless. That early explanation is contradicted by the final implementation rationale and review result, so it will be shown only as a discarded hypothesis, if it appears at all.

The video will not invent benchmark values or a guaranteed growth factor. The implementer notes guide the presentation: one vector remains visually persistent while its length, capacity, backing buffers, reallocations, and copied elements change.

## Why Manim

Manim is the stronger choice because the explanation depends on continuity. Viewers need to track the same vector as its length and capacity change, watch its backing allocation move, and see existing elements copied. A slide or compositing-oriented treatment could show the diff, but it would make the repeated state changes harder to grasp.

Production will require Manim and FFmpeg. Any capacity values in the animation will be marked as illustrative rather than promises about a particular runtime's growth factor.

## Timed storyboard

| Time | Scene | Visuals | Narration |
|---|---|---|---|
| 0:00–0:10 | The symptom | A vector with equal length and capacity receives a sequence of one-element batches. | “This append path reserved exactly enough capacity before every batch. For repeated small batches, that optimization caused repeated work.” |
| 0:10–0:28 | Old path | The vector points to a full heap buffer. Each incoming element produces a buffer one cell larger; old elements copy across and a counter increases. | “When length already equals capacity, exact reserve makes room for only the incoming batch. The next small append fills that space, and the cycle repeats: allocate, copy, append.” |
| 0:28–0:40 | Why it scales badly | Three reallocation cycles compress into `1 + 2 + 3 + …` copied elements. | “Each step can copy everything accumulated so far. Across incremental appends, the total copying grows quadratically.” |
| 0:40–0:52 | The diff | The removed `reserve_exact` line fades out while `extend(batch)` remains. | “The final change is small: remove the explicit exact reserve and let `extend` handle growth.” |
| 0:52–1:10 | New path | A normal growth event creates illustrative spare capacity. Several elements append without another buffer move. | “`extend` uses the iterator size hint and the vector's normal growth strategy. Spare capacity lets later batches reuse the current buffer.” |
| 1:10–1:22 | Outcome | Old and new paths compare reallocation and copy counts without numeric benchmark claims. | “That restores amortized growth for incremental batches. The behavior improves internally, with no public API change.” |
| 1:22–1:30 | Discussion | End card with two questions. | “Where else do we override normal collection growth, and what regression coverage should protect this path?” |

## Full narration script

**0:00–0:10** — This append path reserved exactly enough capacity before every batch. For repeated small batches, that optimization caused repeated work.

**0:10–0:28** — When length already equals capacity, exact reserve makes room for only the incoming batch. The next small append fills that space, and the cycle repeats: allocate, copy, append.

**0:28–0:40** — Each step can copy everything accumulated so far. Across incremental appends, the total copying grows quadratically.

**0:40–0:52** — The final change is small: remove the explicit exact reserve and let `extend` handle growth.

**0:52–1:10** — `extend` uses the iterator size hint and the vector's normal growth strategy. Spare capacity lets later batches reuse the current buffer.

**1:10–1:22** — That restores amortized growth for incremental batches. The behavior improves internally, with no public API change.

**1:22–1:30** — Where else do we override normal collection growth, and what regression coverage should protect this path?

## Caption plan

Captions will follow the narration timings above, split into short one- or two-line phrases. Code identifiers will remain exact. Captions will sit within the lower safe area and avoid covering the vector and heap-buffer labels.

Suggested visual labels:

- `length`
- `capacity`
- `allocate`
- `copy existing elements`
- `spare capacity`
- `amortized growth restored`
- `no public API change`

## Visual direction

Use a dark neutral background, high-contrast type, blue for stable vector state and spare capacity, and amber for allocations and copies. Keep the vector handle visually stable while buffers transform so object identity is never ambiguous. No repository branding was included, so this neutral system is the proposed fallback.

## Approval questions

Please approve or revise:

1. IC audience assumptions and technical depth
2. Manim as the renderer
3. The 90-second story and narration
4. The exclusion of benchmark numbers and exact growth-factor claims
5. The closing discussion prompt and neutral visual system

I will wait for approval before any animation or rendering work begins.

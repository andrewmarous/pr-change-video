# Video plan: Add lease-based leader failover

Status: **Awaiting user approval. No animation source or render has been created.**

## Recommendation summary

- **Audience preset:** TPM
- **Fine-tuning (recommended, editable):** Assume familiarity with leaders, followers, and deployment sequencing, but not the protocol internals. Use moderate technical depth. Emphasize system boundaries, storage dependency, rollout order, observable interruption, and the next recovery slice. Use precise terms—lease, election, quorum, fencing token—and define fencing visually. Keep the tone direct and risk-aware. Exclude file-level details and any claim of seamless recovery.
- **Renderer:** Manim
- **Target duration:** 90 seconds
- **Primary takeaway:** The change can elect and fence a replacement leader after lease expiry, but it does not recover in-flight work or guarantee transparent, zero-downtime failover.
- **Follow-up conversation enabled:** What interruption can callers observe, what rollout ordering does fencing require, and what should the next in-flight recovery slice cover?

## Evidence and confidence

### Verified implementation

1. The runtime adapter converts elapsed lease deadlines into queued `LeaseExpired` events. (Final diff summary)
2. The protocol state machine requests votes on `LeaseExpired` and becomes leader after quorum. (Final diff summary)
3. Leadership terms carry monotonically increasing fencing tokens; the storage adapter rejects stale-token writes. (Final diff summary)
4. In-flight work is not reconstructed. Zero downtime and transparent recovery are not guaranteed. (Final diff summary; final review)

### Stated intent

The implementer expects automatic failover that callers will not notice. This is intent from the standup transcript, not implemented behavior.

### Inferences

- The storage adapter must support and enforce fencing before the failover behavior is relied upon in rollout.
- Callers can observe an interruption between lease expiry, election, and resumption on the new leader; the evidence does not quantify it.

### Contradictions and caveats

The standup's “callers won't notice” statement conflicts with the authoritative implementation summary and final review. The video must reject “seamless,” “transparent,” and “zero-downtime” framing. It must not invent a recovery-time bound or claim in-flight operations are resumed.

## Content boundaries

### Include

- Trigger boundary: runtime turns elapsed time into a queued event.
- Election boundary: protocol processes the event, requests votes, and reaches quorum.
- Safety boundary: increasing fencing tokens let storage reject the old leader's writes.
- Delivery implications: storage enforcement dependency, rollout sequencing, possible interruption, and no in-flight reconstruction.
- Discussion prompt for the next recovery slice.

### Exclude

- Seamless, transparent, or zero-downtime recovery claims.
- Quantified election or outage timing not present in the PR.
- Automatic replay or reconstruction of interrupted operations.
- Implementation details that do not change sequencing or risk decisions.

## Renderer decision

### Required visual primitives

Persistent leader, follower, quorum, lease, term token, and storage objects must retain identity while their state and relationships change: lease expires, a queued event enters the state machine, votes accumulate, leadership transfers, and stale writes are rejected.

### Evidence for Manim

The core explanation is an evolving distributed-state mechanism. Spatial continuity makes the sequence and safety boundary legible: old leader → expired lease → election → quorum → new token, while storage compares old and new tokens. Manim is well suited to preserving these objects as their states and relationships transform.

### Why Remotion is weaker

Remotion could compose architecture cards and timeline beats, but replacing or cutting between cards would make it harder to track leader identity, term progression, and the causal relationship between election and stale-writer rejection. The story needs persistent transforming objects more than mixed-media editorial composition.

### Dependencies and risks

Manim and its system dependencies must be installed. The animation must avoid implying a guaranteed duration or uninterrupted request path. The storage adapter should be shown as a dependency boundary, not as part of the election state machine.

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content |
|---|---|---|---|
| 0–12s | Coordination problem | “When a coordinator leader disappears, the system needs a safe way to replace it. This change adds that path—but it does not make failover invisible.” | Leader stops; title; warning label: “Safe replacement ≠ seamless recovery” |
| 12–30s | Trigger and boundary | “The runtime watches the leader lease. When the deadline passes, it queues a `LeaseExpired` event for the protocol state machine.” | Runtime, event queue, protocol boundary; event moves into queue |
| 30–49s | Election mechanism | “The follower handles that event, requests votes, and becomes leader only after a quorum.” | Follower changes to candidate; votes accumulate; quorum indicator |
| 49–65s | Stale-writer safety | “Each leadership term receives a higher fencing token. Storage rejects writes carrying an older token, so the previous leader cannot keep writing.” | Token 41 → 42; storage accepts 42 and rejects 41 |
| 65–80s | Operational boundary | “There can still be an observable interruption during this sequence. Work in flight on the previous leader is not reconstructed.” | Request pauses; in-flight item marked “not recovered”; no duration claim |
| 80–90s | Follow-up discussion | “Before rollout, align storage enforcement and deployment order—and decide what the next recovery slice must do with interrupted work.” | Three prompts: storage dependency, rollout order, in-flight recovery |

## Storyboard

### Scene 1: Safe, not seamless

- **Duration:** 12s
- **Purpose:** Establish the coordination problem and qualification immediately.
- **Visual state and motion:** A stable leader/follower cluster appears. The leader dims; the system remains unresolved rather than instantly switching.
- **On-screen text:** “Lease-based leader failover”; “Safe replacement ≠ seamless recovery”
- **Evidence references:** Final diff summary; final review
- **Transition:** Camera tracks from the stopped leader to its lease indicator.

### Scene 2: Deadline becomes an event

- **Duration:** 18s
- **Purpose:** Show the runtime/protocol ownership boundary.
- **Visual state and motion:** Lease indicator expires; runtime creates a `LeaseExpired` card and places it into a FIFO queue; the protocol consumes it.
- **On-screen text:** “Runtime: deadline → queued event”; “Protocol: handles event”
- **Evidence references:** Final diff summary item 1
- **Transition:** The consumed event transforms into election state.

### Scene 3: Election reaches quorum

- **Duration:** 19s
- **Purpose:** Explain the replacement mechanism at TPM depth.
- **Visual state and motion:** Follower becomes candidate; vote edges illuminate one at a time; quorum changes candidate to leader.
- **On-screen text:** “Request votes”; “Quorum”; “New leader”
- **Evidence references:** Final diff summary item 2
- **Transition:** New leader's term badge expands into a fencing token.

### Scene 4: Storage fences stale writers

- **Duration:** 16s
- **Purpose:** Make the critical safety dependency concrete.
- **Visual state and motion:** New token 42 travels to storage and is accepted. Old leader attempts token 41; storage rejects it.
- **On-screen text:** “Monotonic fencing token”; “42 accepted”; “41 rejected as stale”
- **Evidence references:** Final diff summary items 3–4
- **Transition:** Accepted write clears; an interrupted request remains suspended.

### Scene 5: The remaining interruption

- **Duration:** 15s
- **Purpose:** Prevent overclaiming and identify rollout risk.
- **Visual state and motion:** A request pauses across the election interval. An in-flight work item detaches from the old leader but does not move to the new leader.
- **On-screen text:** “Observable interruption possible”; “In-flight work is not reconstructed”
- **Evidence references:** Final diff summary items 5–6; final review
- **Transition:** Diagram recedes into three decision cards.

### Scene 6: Prepare the rollout conversation

- **Duration:** 10s
- **Purpose:** Give stakeholders concrete follow-up questions.
- **Visual state and motion:** Highlight three cards in order.
- **On-screen text:** “Storage enforcement?”; “Rollout order?”; “Next recovery slice?”
- **Evidence references:** TPM standup question; verified scope limits
- **Transition:** Hold final frame for discussion.

## Narration script

**0:00–0:12** — When a coordinator leader disappears, the system needs a safe way to replace it. This change adds that path—but it does not make failover invisible.

**0:12–0:30** — The runtime watches the leader lease. When the deadline passes, it queues a `LeaseExpired` event for the protocol state machine.

**0:30–0:49** — The follower handles that event, requests votes, and becomes leader only after a quorum.

**0:49–1:05** — Each leadership term receives a higher fencing token. Storage rejects writes carrying an older token, so the previous leader cannot keep writing.

**1:05–1:20** — There can still be an observable interruption during this sequence. Work in flight on the previous leader is not reconstructed.

**1:20–1:30** — Before rollout, align storage enforcement and deployment order—and decide what the next recovery slice must do with interrupted work.

## Caption plan

Create one caption cue per sentence or natural clause using the exact approved narration. Keep cues within their scene windows, use at most two short lines, and retain the qualifiers “does not make failover invisible,” “can,” and “not reconstructed.” No synthesized narration audio is planned.

## Visual system and branding

No brand assets were supplied. Use a restrained 16:9 dark-neutral system with off-white text, a cool accent for the active leader and accepted state, and a warm warning accent for expired/stale/interrupted states. Use stable shapes and labels for each distributed-system object. Do not imitate a named creator's branding.

## Approval checklist

- [ ] Audience and fine-tuning
- [ ] Message and takeaway
- [ ] Content boundaries
- [ ] Renderer
- [ ] Storyboard and narration
- [ ] Duration (90 seconds)
- [ ] Brand treatment

## Post-approval production and review protocol

1. Approval freezes the message, audience, storyboard, exact narration, renderer, duration, and visual direction.
2. The **coding/rendering agent owns every creation action**: animation source, assets, captions, render commands, MP4 renders, and production manifest. It must not reinterpret the frozen plan.
3. The **review agent owns verification only**. It reads the frozen plan and inspects the actual MP4, source, captions, narration, and manifest. It never edits source or media and never renders.
4. If the render has a small implementation mismatch—such as clipping, a typo, caption timing drift, an omitted approved label, or scene timing that misses the approved duration—the review agent sends a precise correction request to the existing coding/rendering agent. That agent edits and rerenders; review verifies the new MP4.
5. Any proposed change to message, audience, emphasis, technical depth, scene order, substantive claims, narration, renderer, duration, metaphor, or visual direction goes back to the **user** for a higher-level decision. The creation/review loop cannot make that decision.
6. Delivery occurs only after the review agent verifies the latest rendered MP4 and records a pass.

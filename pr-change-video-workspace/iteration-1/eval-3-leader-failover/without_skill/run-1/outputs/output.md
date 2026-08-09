# Proposed changelog video: Lease-based leader failover

This is a planning draft for approval. No animation or render has been created.

## Audience and goal

**Audience:** TPMs coordinating the rollout.

**Goal:** Explain what the PR adds, what must be coordinated, and what remains out of scope. Viewers should leave ready to discuss storage compatibility, rollout sequencing, interruption risk, and future recovery work.

The authoritative implementation does **not** support calling this seamless or transparent failover. The standup comment that callers will not notice a failure is aspirational and conflicts with the PR summary and final reviewer warning. The video will say that directly.

## Format recommendation

Use **Manim** for a roughly 90-second video. The explanation relies on tracking the same leader, follower, lease, election, fencing token, and storage objects as their states and relationships change. Continuous animation will make the causal chain easier to follow.

Remotion would work for a sequence of architecture slides or stakeholder cards, but it is weaker for preserving object identity through lease expiry, quorum, leadership transfer, and stale-token rejection. Manim carries some setup and rendering dependency risk, so the animation should stay visually simple.

## Key boundaries

Include:

- Runtime converts an elapsed lease deadline into `LeaseExpired`.
- The protocol requests votes and requires quorum before becoming leader.
- Increasing fencing tokens allow storage to reject stale-leader writes.
- Storage enforcement is a rollout dependency.
- An interruption can be visible, and in-flight operations are not reconstructed.

Exclude:

- “Zero downtime,” “seamless,” or “callers won't notice.”
- Recovery-time guarantees.
- Claims that interrupted operations resume automatically.

## Storyboard and narration

| Time | Visual | Narration |
|---|---|---|
| 0:00–0:12 | A leader disappears while the follower remains in place. “Safe, not seamless” appears. | “This PR adds a safe path to replace a lost leader. It does not guarantee invisible or zero-downtime recovery.” |
| 0:12–0:29 | The leader lease expires. Runtime emits a `LeaseExpired` event toward the protocol. | “When the runtime observes an expired lease, it queues a `LeaseExpired` event for the protocol state machine.” |
| 0:29–0:47 | Follower becomes candidate; votes arrive until quorum. | “The follower requests votes and becomes the new leader only after reaching quorum.” |
| 0:47–1:04 | Term token increases from 8 to 9. Storage accepts 9 and rejects an old write carrying 8. | “Each term has a higher fencing token. The storage adapter rejects stale tokens, preventing the previous leader from continuing to write.” |
| 1:04–1:19 | A request pauses between leaders; an in-flight work item stays behind. | “This still leaves an observable interruption. Work that was in flight on the previous leader is not reconstructed by this change.” |
| 1:19–1:30 | Three prompts appear: storage enforcement, rollout order, next recovery slice. | “The rollout discussion should align storage enforcement and sequencing, then define what the next slice must do for interrupted work.” |

## Visual direction

Use a dark, restrained 16:9 diagram style. Keep the leader and follower visually stable across scenes. Use blue for the valid leader/token path and amber for expiry, stale writes, and interrupted work. If company brand assets are provided, adapt the palette and typography without weakening warning-state contrast.

## Approval questions

Please approve or revise:

1. TPM audience and coordination emphasis
2. The explicit “safe, not seamless” framing
3. Manim as renderer
4. The 90-second storyboard and narration
5. The rollout discussion prompts

## After approval

A production owner will implement the animation, captions, and MP4 from the approved storyboard. A separate reviewer will compare the output with the approved plan and inspect timing, legibility, factual claims, and synchronization.

For small mismatches—such as clipping, incorrect timing, missing labels, or caption drift—the reviewer should report the exact discrepancy to production, which will edit and rerender. The reviewer should not directly alter the video. Any request that changes the story, audience, technical depth, renderer, duration, or substantive narration should return to the user for approval rather than being handled as a production fix.

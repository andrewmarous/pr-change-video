# Approval plan: Lease-based leader failover

**No animation or render has been created.**

## Treatment

- **Audience:** TPM; moderate technical depth, centered on named system boundaries and coordination concerns.
- **Renderer:** Manim, because the same lease, runtime, protocol, follower, votes, term token, and storage objects change state through the sourced sequence. Remotion's scene-based composition is less direct for tracking those persistent objects.
- **Duration:** 90 seconds.
- **Style:** Dark 16:9 diagram system, off-white text, cool active-state color, and warm warning color. No narration audio.

## Source boundary

The implementer's statement that callers will not notice conflicts with the PR's explicit lack of transparent and zero-downtime guarantees and the reviewer's warning against “seamless.” It will not be presented as behavior.

The sources do not answer the four TPM topics used in the final scene. The plan attributes them without adding answers or actions.

## Timed scenes

Narration is also the caption text.

| Time | Narration | Visual | Source |
|---|---|---|---|
| 0–14s | “This PR adds lease-based election and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | Leader/follower system; transparent recovery shown outside scope | PR description; diff bullets 2–6; final review |
| 14–31s | “When a lease deadline passes, runtime queues a `LeaseExpired` event for the protocol.” | Deadline elapses; event moves runtime → queue → protocol | Diff bullet 1 |
| 31–49s | “The protocol requests votes and makes the follower leader after quorum.” | Vote requests and returns; follower label changes at quorum | Diff bullet 2 |
| 49–66s | “Each term has a monotonically increasing fencing token. Storage rejects stale-token writes.” | Term token increases; storage rejects a prior-token write | Diff bullets 3–4 |
| 66–78s | “Work in flight on the previous leader is not reconstructed.” | Visible in-flight item remains on previous leader | Diff bullet 5; final review |
| 78–90s | “The TPM identified dependencies, observable interruption, rollout order, and the next recovery slice as information the team needs.” | Four neutral labels, with no questions or proposed actions | Standup transcript |

## Approval and production

Approve or revise the packet; production remains paused. After approval, the **coding/rendering agent** owns every source edit and render. The **review agent** verifies the MP4 and never edits or renders. Small implementation mismatches return to coding/rendering for correction and rerendering; higher-level content or creative changes return to the user.

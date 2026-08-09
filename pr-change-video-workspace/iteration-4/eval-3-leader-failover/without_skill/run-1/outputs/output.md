# Approval plan: Lease-based leader failover

**No animation or render has been created.**

## Treatment

- **Audience:** TPM; moderate technical depth, focused on stated boundaries and coordination concerns.
- **Renderer:** Manim
- **Duration:** 90 seconds

## Evidence boundary

The PR establishes behavior: **I1** runtime queues `LeaseExpired`; **I2** protocol requests votes and becomes leader after quorum; **I3** terms carry increasing fencing tokens; **I4** storage rejects stale writes; **I5** in-flight work is not reconstructed; **I6** zero downtime and transparent recovery are not guaranteed.

The context establishes framing: **C1** the implementer expected automatic, unnoticeable failover; **C2** the TPM names dependencies, observable interruption, rollout order, and the next recovery slice as information needed; **C3** final review says election and fencing are covered, in-flight recovery is out of scope, and “seamless” should be avoided.

C1 conflicts with I5–I6 and C3. The video will not present seamless, transparent, zero-downtime, or unnoticeable recovery as implemented. It will not invent a rollout order, interruption duration, dependency list, next-slice definition, recommendation, conclusion, or call to action.

## Renderer rationale

Manim can preserve the identity of the leader, follower, lease, queued event, votes, term token, and storage while their state changes through I1–I4. Remotion's editorial scene composition is less direct for this continuous protocol sequence.

## Timed scenes

Use narration verbatim for captions.

| Time | Narration | Visual | Provenance |
|---|---|---|---|
| 0–14s | “This PR adds lease-based election and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | Scope boundary around election and fencing | I2–I6, C3 |
| 14–31s | “When a lease deadline passes, runtime queues a `LeaseExpired` event for the protocol.” | Lease expires; event enters queue | I1 |
| 31–49s | “The protocol requests votes and makes the follower leader after quorum.” | Votes accumulate; follower changes state | I2 |
| 49–66s | “Each term has a higher fencing token. Storage rejects stale-token writes.” | Token 8 → 9; token 8 rejected | I3–I4 |
| 66–78s | “Work in flight on the previous leader is not reconstructed.” | In-flight item remains behind | I5, C3 |
| 78–90s | “The TPM identified dependencies, observable interruption, rollout order, and the next recovery slice as needed information.” | Four neutral source labels, without questions or answers | C2 |

## Visual and production decisions

Use a dark 16:9 diagram style, off-white text, cool active-state color, and warm warning color. Do not generate narration audio.

Approval freezes the content, TPM treatment, scenes, narration, renderer, duration, and visual direction. The **coding/rendering agent** owns every edit and render. The **review agent** only verifies the MP4 and never edits or renders. Small implementation mismatches return to coding/rendering for correction and rerendering; higher-level changes return to the user.

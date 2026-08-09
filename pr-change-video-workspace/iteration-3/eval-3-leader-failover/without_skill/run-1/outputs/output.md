# Approval plan: Lease-based leader failover

No animation or render has been created.

## Proposed treatment

- **Audience:** TPM
- **Duration:** 90 seconds
- **Renderer:** Manim
- **Content:** The implemented election and fencing sequence, its explicit recovery limits, and the four concerns stated by the TPM.

The PR is authoritative for behavior. It says the runtime queues `LeaseExpired`, the protocol elects a leader after quorum, terms carry increasing fencing tokens, and storage rejects stale writes. It also says in-flight work is not reconstructed and transparent or zero-downtime recovery is not guaranteed.

The context supplies the communication framing. The TPM names dependencies, observable interruption, rollout order, and the next recovery slice. The review says not to call the change seamless. The implementer's claim that callers will not notice conflicts with the implemented scope and review; the video will not repeat it as fact.

The sources do not provide a rollout order, interruption duration, dependency list, or definition of the next recovery slice. This plan does not supply those missing details or add conclusions, recommendations, next steps, or a call to discussion.

## Renderer rationale

Use Manim because the same leader, follower, lease, queued event, votes, term token, and storage component change state through the implementation sequence. Persistent animated objects make that sequence trackable. Remotion's editorial scenes are less suited to preserving those identities across the transformations.

## Timed storyboard

| Time | Visual | Narration | Source |
|---|---|---|---|
| 0:00–0:14 | Leader/follower system with “election + fencing” inside scope and “transparent recovery” outside | “This PR adds lease-based leader election and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | PR; final review |
| 0:14–0:31 | Lease expires; runtime queues `LeaseExpired` for protocol | “When a lease deadline passes, runtime queues a `LeaseExpired` event for the protocol state machine.” | PR |
| 0:31–0:49 | Votes accumulate; quorum changes follower to leader | “The protocol requests votes and makes the follower leader after quorum.” | PR |
| 0:49–1:06 | Token increases; storage rejects the old token | “Each term has a higher fencing token. Storage rejects stale-token writes.” | PR |
| 1:06–1:18 | In-flight work remains on the previous leader | “Work in flight on the previous leader is not reconstructed.” | PR; final review |
| 1:18–1:30 | Four neutral labels appear, without questions or recommendations | “The TPM identified dependencies, observable interruption, rollout order, and the next recovery slice as information the team needs.” | Standup transcript |

Use exact narration as captions. Do not generate voice audio. With no supplied brand assets, use a restrained dark 16:9 design with off-white text, a cool active-state color, and a warm warning color.

## Approval

Approve or revise the audience treatment, source selection, Manim choice, exact narration, 90-second timing, and visual system. Approval does not authorize additions to the source meaning.

## Production and review boundary

After approval, the coding/rendering agent owns all source edits, captions, assets, render commands, and rendered outputs. The review agent only checks the produced MP4 against the approved plan; it does not edit or render.

Small mismatches such as clipping, missing approved text, caption timing, or scene-duration errors go back to the coding/rendering agent for correction and rerendering. Changes to the approved meaning, audience treatment, narration, renderer, duration, or visual direction—and any proposed analysis, implication, conclusion, next step, or discussion prompt—go back to the user.

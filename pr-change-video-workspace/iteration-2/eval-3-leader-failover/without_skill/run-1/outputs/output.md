# Approval draft: Leader failover changelog video

No source code or video has been produced. This draft stops for approval.

## Proposed treatment

- **Audience:** TPM
- **Duration:** 90 seconds
- **Renderer:** Manim
- **Goal:** Give the team a shared picture of the implementation boundary, then frame the open coordination conversation about dependencies, interruption, rollout order, and later recovery work.

The PR establishes implemented behavior: lease deadlines become queued events; quorum can produce a new leader; increasing fencing tokens let storage reject stale writes; and in-flight work is not reconstructed. The standup and review provide the team's discussion framing. The implementer's expectation that callers will not notice conflicts with the PR and the reviewer's warning, so the video will not call recovery seamless or transparent.

## Audience assumptions

Assume viewers understand the leader/follower model but do not need code-level detail. Define the runtime, protocol, and storage boundaries visually. Emphasize sequencing questions and scope limits. Use neutral language where the context provides no answer: the materials do not prescribe rollout order, quantify interruption, or define the next recovery slice.

## Why Manim

The clearest explanation tracks the same leader, follower, lease, queue, votes, tokens, and storage component as their states change. Manim can preserve those identities across the event and election sequence. Remotion would be suitable for cards, screenshots, or a release timeline, but cuts between those elements would make this evolving protocol mechanism less direct.

## Evidence boundary

Implementation facts from the PR:

- Runtime queues `LeaseExpired` after the deadline.
- Protocol requests votes and becomes leader after quorum.
- Terms use monotonically increasing fencing tokens.
- Storage rejects stale-token writes.
- In-flight work is not reconstructed.
- Zero downtime and transparent recovery are not guaranteed.

Context-supported framing:

- The TPM wants dependencies, observable interruption, rollout order, and the next recovery slice discussed.
- The final reviewer says election and fencing are covered, in-flight recovery is out of scope, and “seamless” should be avoided.
- The implementer's “callers won't notice” statement is an expectation, not an implementation fact, and conflicts with the other evidence.

## Timed storyboard

| Time | Visual and narration | Source |
|---|---|---|
| 0:00–0:12 | Stable leader/follower diagram. Leader disappears. “This PR adds leader election and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | PR implementation facts; final review wording |
| 0:12–0:29 | Lease expires; runtime places `LeaseExpired` in a queue. “An elapsed lease deadline becomes a queued event for the protocol.” | PR implementation fact |
| 0:29–0:47 | Follower becomes candidate; votes accumulate; quorum changes it to leader. “The protocol requests votes and makes the follower leader after quorum.” | PR implementation fact |
| 0:47–1:04 | Token 11 replaces token 10; storage rejects a token-10 write. “Each term has a higher fencing token, and storage rejects stale-token writes.” | PR implementation facts |
| 1:04–1:18 | In-flight work remains attached to the old leader. “The PR does not reconstruct work in flight on the previous leader.” | PR implementation fact; final review |
| 1:18–1:30 | Four question cards appear. “The follow-up is about dependencies, observable interruption, rollout order, and what the next recovery slice covers.” | TPM standup statement |

No visual will imply a recovery-time bound, automatic in-flight transfer, or a prescribed rollout sequence.

## Caption and visual plan

Captions will use the narration exactly and remain synchronized to the six scene windows. There will be no generated voice track. Use a dark 16:9 diagram system, off-white labels, blue for the current leader/token, and amber for expiry, stale writes, and out-of-scope recovery. If approved branding is provided, adapt this system to it.

## Approval requested

Please approve or revise the TPM assumptions, 90-second duration, Manim choice, explicit non-seamless qualification, storyboard, and discussion prompts.

## Production and review after approval

Approval freezes the narrative and creative choices. The coding/rendering agent alone creates and edits animation source, captions, and assets and runs every render. The review agent verifies the actual output against the approved plan; it does not edit or render.

If review finds a small mismatch such as clipping, missing approved text, incorrect caption timing, or scene timing drift, it sends a precise request to the coding/rendering agent, which edits and rerenders. If a proposed fix changes the audience, message, emphasis, story order, narration, renderer, duration, substantive claims, or visual concept, the question returns to the user. Review passes only after inspecting the corrected render.

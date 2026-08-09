# Video plan: Add lease-based leader failover

**Production is paused for approval.**

## Treatment

- **Audience:** TPM. Assume familiarity with leader/follower systems; use moderate technical depth; emphasize the boundaries and coordination topics named in the transcript.
- **Renderer:** Manim.
- **Renderer rationale:** The explanation tracks persistent runtime, protocol, follower, lease, vote, leadership-term, token, and storage objects as sourced states and relationships change. Manim supports that continuity. Remotion's editorial cuts are weaker for following this protocol sequence.
- **Duration:** 90 seconds.
- **Visual system:** 1920×1080; dark neutral background, off-white text, cool active-state accent, warm expired/stale/out-of-scope accent. No brand assets were supplied. No synthesized audio.

## Source boundaries

The implementer's claim that callers will not notice failover conflicts with the PR's lack of transparent or zero-downtime guarantees and the reviewer's instruction not to call it seamless. The video uses the PR for behavior and does not present that claim as implemented.

The sources provide no answers for the four TPM topics used in the final scene; it presents only their attributed labels.

## Timed scenes

Use narration verbatim as caption text.

| Time | Purpose | Narration and caption text | Visual state and motion | On-screen text | Provenance |
|---|---|---|---|---|---|
| 0–14s | Scope | “This PR adds lease-based election and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | Leader/follower system; “transparent recovery” remains outside the PR scope frame | “Election + fencing” | PR description; diff bullets 2–6; final review |
| 14–31s | Runtime/protocol boundary | “When a lease deadline passes, the runtime queues a `LeaseExpired` event for the protocol.” | Lease deadline elapses; named event moves from runtime into a queue and then to protocol | `LeaseExpired` | Diff bullet 1 |
| 31–49s | Election | “The protocol requests votes and makes the follower leader after quorum.” | Vote requests leave the follower; returned votes accumulate; follower label changes to leader at quorum | “Quorum → leader” | Diff bullet 2; PR description |
| 49–66s | Storage boundary | “Each leadership term has a monotonically increasing fencing token. Storage rejects writes with stale tokens.” | Term token increases; a write with the prior token reaches storage and is rejected | “Stale token rejected” | Diff bullets 3–4; PR description |
| 66–78s | Recovery boundary | “Work in flight on the previous leader is not reconstructed.” | An already-visible in-flight work item remains on the previous leader | “Not reconstructed” | Diff bullet 5; final review |
| 78–90s | TPM context | “The TPM identified dependencies, observable interruption, rollout order, and the next recovery slice as information the team needs.” | Four neutral source labels appear without questions, answers, or proposed actions | Source terms only | Standup transcript, TPM statement |

## Approval and post-approval protocol

Approve this packet or specify changes; approval freezes its content and production decisions.

The **coding/rendering agent** alone edits source, assets, captions, and manifests and runs every render. The **review agent** only verifies the actual MP4 against the frozen packet; it never edits or renders. Small mismatches such as clipping, omitted approved content, or timing drift go to coding/rendering for correction and rerendering. Changes to frozen content or creative direction go to the user.

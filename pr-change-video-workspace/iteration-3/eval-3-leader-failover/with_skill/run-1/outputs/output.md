# Video plan: Add lease-based leader failover

**Status:** Awaiting approval. No animation source or render has been created.

## Treatment

- **Audience:** TPM
- **Fine-tuning:** Assume familiarity with leader/follower systems. Use moderate technical depth. Emphasize the runtime, protocol, and storage boundaries; preserve the source's explicit rollout and interruption concerns. Avoid file-level detail.
- **Renderer:** Manim
- **Duration:** 90 seconds
- **Source-stated message:** The PR implements election after lease expiry and stale-writer fencing. It does not reconstruct in-flight work or guarantee zero downtime or transparent recovery. The supplied context says the TPM needs information about dependencies, observable interruption, rollout order, and the next recovery slice.

These presentation settings are editable without changing the source content.

## Content ledger

### Implementation facts from the PR

- **I1:** Runtime converts elapsed lease deadlines into queued `LeaseExpired` events.
- **I2:** The protocol handles `LeaseExpired`, requests votes, and becomes leader after quorum.
- **I3:** Leadership terms use monotonically increasing fencing tokens.
- **I4:** Storage rejects writes with stale tokens.
- **I5:** The PR does not reconstruct in-flight work.
- **I6:** The PR does not guarantee zero downtime or transparent recovery.

### Narrative claims from supplied context

- **C1:** The implementer said failover should be automatic and callers should not notice a leader disappearing. (Standup transcript)
- **C2:** The TPM said the team needs to understand dependencies, observable interruption, rollout order, and the scope of the next recovery slice. (Standup transcript)
- **C3:** The reviewer said election and stale-writer fencing are covered, in-flight recovery is out of scope, and the change should not be called seamless failover. (Final review)

### Contradictions and caveats

C1's unnoticeable-recovery expectation conflicts with I5–I6 and C3. The video therefore attributes that expectation only as a contradicted standup statement; it does not present seamless, transparent, zero-downtime, or unnoticeable recovery as implemented behavior. The sources do not state a rollout order, interruption duration, dependency list, or definition of the next recovery slice, so the video supplies none.

## Omissions required for duration

Omit the implementer's contradicted quote from narration after stating the contradiction here. Omit file-level details. Preserve every implemented behavior and qualification listed above.

## Renderer decision

- **Required visual primitives:** Persistent leader, follower, lease, event, votes, term token, and storage objects change state or relationship through the sequence in I1–I4.
- **Why Manim:** Continuous object transformations can show the implemented event, election, and fencing sequence while preserving object identity.
- **Why not Remotion:** Editorial cards and scene cuts are less direct for tracking the same protocol objects through successive state changes.
- **Dependency:** Production requires Manim and its renderer dependencies. Visual timing must not imply a recovery-duration guarantee.

## Timed narrative

| Time | Purpose | Narration | On-screen content | Provenance |
|---|---|---|---|---|
| 0–14s | State scope | “This PR adds lease-based leader election and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | “Election + fencing”; “No transparent-recovery guarantee” | I2–I6; C3 |
| 14–31s | Runtime/protocol boundary | “When a lease deadline passes, the runtime queues a `LeaseExpired` event for the protocol state machine.” | Runtime → queue → protocol | I1 |
| 31–49s | Election | “The protocol requests votes and makes the follower leader after quorum.” | Follower → candidate → quorum → leader | I2 |
| 49–66s | Storage boundary | “Each leadership term has a higher fencing token. Storage rejects writes carrying a stale token.” | Token 8 → 9; token 8 rejected | I3–I4 |
| 66–78s | Recovery limit | “Work in flight on the previous leader is not reconstructed.” | In-flight item remains with prior leader | I5; C3 |
| 78–90s | Source-stated TPM concerns | “The TPM identified dependencies, observable interruption, rollout order, and the next recovery slice as information the team needs.” | Four labeled concerns, with no answers or call to action | C2 |

## Storyboard

1. **Scope — 14s:** Leader/follower diagram; attach “election” and “fencing”; place “transparent recovery” outside the implemented boundary. [I2–I6, C3]
2. **Queued expiry — 17s:** Lease expires; runtime places `LeaseExpired` in a queue; protocol consumes it. [I1]
3. **Quorum — 18s:** Follower becomes candidate; votes accumulate; quorum changes it to leader. [I2]
4. **Fencing — 17s:** Term token increments; storage rejects the old token. [I3–I4]
5. **In-flight scope — 12s:** Work remains with the prior leader and does not transfer. [I5, C3]
6. **TPM context — 12s:** Show four neutral labels: dependencies, observable interruption, rollout order, next recovery slice. Do not add answers, recommendations, questions, or a call to discussion. [C2]

## Narration and captions

Use the timed narration above verbatim for both `narration.md` and captions. Split captions at sentence boundaries, retain all negative qualifiers, and keep cues inside their scene windows. Do not synthesize audio.

## Visual system

No brand assets were supplied. Use 1920×1080, dark neutral background, off-white text, a cool accent for current state, and a warm accent for expired, stale, and out-of-scope states. Use stable shapes for persistent objects.

## Approval checklist

- [ ] Source content is represented without added interpretation
- [ ] TPM audience treatment
- [ ] Manim
- [ ] Storyboard and exact narration
- [ ] 90-second duration
- [ ] Fallback visual system

## Post-approval protocol

Approval freezes source-derived content, audience treatment, storyboard, narration, renderer, duration, and visual direction. The **coding/rendering agent** alone creates or edits animation source, assets, captions, manifests, and rendered media, and runs every render. The **review agent** verifies the actual MP4 against the frozen packet and evidence; it never edits or renders.

For a small implementation mismatch—such as clipping, a typo, missing approved content, caption drift, or incorrect scene timing—the reviewer sends a precise correction request to the coding/rendering agent. That agent edits and rerenders; review verifies the new MP4. Any change to frozen content or creative direction, including added analysis, implication, conclusion, recommendation, next step, or discussion prompt, returns to the user.

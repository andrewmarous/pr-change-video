# Video plan: Add lease-based leader failover

Status: **Awaiting user approval. No animation source or render has been created.**

## Recommendation summary

- **Audience preset:** TPM
- **Fine-tuning (recommended and editable):** Assume viewers know the leader/follower model but not this implementation. Use moderate technical depth. Define lease expiry, quorum, and fencing through animation. Emphasize boundaries, dependencies, rollout order, observable interruption, and the next recovery slice. Exclude file-level details and any seamless-recovery claim. Use a direct, qualification-preserving tone.
- **Renderer:** Manim
- **Target duration:** 90 seconds
- **Primary takeaway:** This PR implements election after lease expiry and stale-writer fencing. It does not reconstruct in-flight operations or guarantee zero downtime or transparent recovery.
- **Follow-up conversation this enables:** The TPM explicitly asks the team to clarify dependencies, observable interruption, rollout order, and the next recovery slice.

All settings above are recommendations. The user can revise them before approval.

## Evidence and confidence

### Implementation facts from the PR

| ID | Fact | Source |
|---|---|---|
| I1 | Runtime converts an elapsed lease deadline into a queued `LeaseExpired` event. | Final diff summary |
| I2 | The protocol handles that event, requests votes, and becomes leader after quorum. | Final diff summary |
| I3 | Leadership terms have monotonically increasing fencing tokens. | Final diff summary |
| I4 | Storage rejects writes with stale tokens. | Final diff summary |
| I5 | The PR does not reconstruct work in flight on the previous leader. | Final diff summary |
| I6 | The PR does not guarantee zero downtime or transparent recovery. | Final diff summary |

### Narrative claims from user-provided context

| ID | Attributed claim | Source and treatment |
|---|---|---|
| C1 | The implementer expects failover to be automatic and unnoticeable to callers. | Standup transcript. Present only as an implementer expectation that conflicts with I5–I6; do not present as behavior. |
| C2 | The TPM wants discussion of dependencies, observable interruption, rollout order, and the next recovery slice. | Standup transcript. This supplies the video's TPM framing and closing questions. |
| C3 | Election and stale-writer fencing are covered; in-flight recovery is out of scope; “seamless failover” should be avoided. | Final review. This supports the qualification and terminology. |

### Missing narrative context and questions

- The context asks about dependencies and rollout order but does not identify a required order or name dependencies beyond the storage adapter visible in the implementation. The video will ask these as discussion questions, not prescribe answers.
- The context does not quantify interruption duration or define the next recovery slice. The video will not invent either.

### Contradictions and caveats

The implementer's “callers won't notice” expectation conflicts with the implemented scope and final review. The plan therefore rejects “seamless,” “transparent,” and “zero-downtime” claims. The PR remains authoritative for behavior; the transcript and review supply the team's framing, concerns, and terminology.

## Content boundaries

### Include

- Runtime-to-protocol boundary: elapsed deadline becomes a queued event. [I1]
- Election sequence: event, vote requests, quorum, new leader. [I2]
- Storage boundary: monotonically increasing tokens and stale-token rejection. [I3–I4]
- Explicit absence of in-flight reconstruction and transparent-recovery guarantees. [I5–I6, C3]
- TPM-requested discussion points: dependencies, interruption, rollout order, next recovery slice. [C2]

### Exclude

- Claims that failover is seamless, transparent, zero-downtime, or unnoticeable.
- A recovery-time estimate or interruption bound.
- A prescribed rollout order or unnamed dependency.
- Claims that interrupted work resumes or is reconstructed.
- Inferred motivation, benefits, safety evaluation, or tradeoffs not stated in the supplied context.

## Renderer decision

### Required visual primitives

The plan needs persistent leader, follower, lease, event queue, vote, fencing-token, and storage objects. Their identities must remain stable while states and relationships change across the implemented sequence. [I1–I4]

### Evidence for the selected renderer

Manim fits the neutral mechanism established by the PR: a lease expires, an event moves through a boundary, votes accumulate to quorum, leadership changes, and storage compares tokens. Continuous transformations let viewers track those objects without adding an unsupported argument about the design. [I1–I4]

### Why the alternative is weaker

Remotion is strong for composing cards, screenshots, and mixed media on a timeline. This plan instead depends on persistent objects changing state. Cuts between editorial cards would make term identity and the event-to-election-to-token sequence harder to track.

### Dependencies and risks

Production requires Manim and its rendering dependencies. Visuals must not imply an interruption duration, a guaranteed rollout sequence, or automatic transfer of in-flight work. No hybrid renderer is proposed.

## Timed narrative

| Time | Narrative purpose | Narration | On-screen content | Provenance |
|---|---|---|---|---|
| 0–12s | Establish implemented scope and qualification | “This PR adds lease-based leader replacement and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | Title; “Election + fencing”; “Not transparent recovery” | Implementation facts I2–I6; context claim C3 |
| 12–29s | Show the runtime/protocol boundary | “When a leader lease deadline passes, the runtime queues a `LeaseExpired` event for the protocol state machine.” | Runtime → queue → protocol | Implementation fact I1 |
| 29–47s | Show election | “The protocol handles the event, requests votes, and makes the follower leader after quorum.” | Follower → candidate; vote markers; quorum → leader | Implementation fact I2 |
| 47–64s | Show fencing mechanism | “Each leadership term has a higher fencing token. The storage adapter rejects writes that carry a stale token.” | Term 8 → 9; storage rejects token 8 | Implementation facts I3–I4 |
| 64–78s | Preserve the recovery boundary | “Work that was in flight on the previous leader is not reconstructed. The PR makes no zero-downtime or transparent-recovery guarantee.” | In-flight work remains with old leader; explicit scope boundary | Implementation facts I5–I6; context claim C3 |
| 78–90s | Enable the requested TPM discussion | “The follow-up discussion is about dependencies, the observable interruption, rollout order, and what the next recovery slice must cover.” | Four question cards; no proposed answers | Context claim C2 |

## Storyboard

### Scene 1: Implemented scope

- **Duration:** 12 seconds
- **Purpose:** State what the PR implements and prevent the unsupported seamless-recovery interpretation.
- **Visual state and motion:** A leader and follower appear. Two scoped labels attach: “election” and “fencing.” A separate “transparent recovery” label remains outside the scope boundary.
- **On-screen text:** “Lease-based failover”; “Election + fencing”; “Not transparent recovery”
- **Provenance type and evidence references:** Implementation facts I2–I6; context claim C3
- **Transition:** Track to the leader's lease indicator.

### Scene 2: Deadline becomes a queued event

- **Duration:** 17 seconds
- **Purpose:** Explain the runtime/protocol boundary.
- **Visual state and motion:** The lease indicator reaches its deadline. Runtime creates a `LeaseExpired` event and places it in a queue; protocol consumes it.
- **On-screen text:** “Runtime”; “LeaseExpired”; “Protocol”
- **Provenance type and evidence references:** Implementation fact I1
- **Transition:** The event transforms into the candidate state.

### Scene 3: Quorum changes leadership

- **Duration:** 18 seconds
- **Purpose:** Explain the election sequence at TPM depth.
- **Visual state and motion:** Follower becomes candidate, vote markers accumulate, and the candidate becomes leader after quorum.
- **On-screen text:** “Request votes”; “Quorum”; “Leader”
- **Provenance type and evidence references:** Implementation fact I2
- **Transition:** The new leadership term badge expands into a token.

### Scene 4: Storage rejects the stale term

- **Duration:** 17 seconds
- **Purpose:** Show the implemented storage boundary.
- **Visual state and motion:** The new leader holds token 9. A write with token 9 reaches storage; a write carrying token 8 is rejected as stale.
- **On-screen text:** “Term token 9”; “Token 8: stale → rejected”
- **Provenance type and evidence references:** Implementation facts I3–I4
- **Transition:** The old leader and its in-flight item remain visible as the storage path recedes.

### Scene 5: Recovery remains out of scope

- **Duration:** 14 seconds
- **Purpose:** Preserve the implementation limitation and final-review wording.
- **Visual state and motion:** An in-flight item remains attached to the previous leader; it does not transfer to the new leader. No timing scale is shown.
- **On-screen text:** “In-flight work: not reconstructed”; “No transparent-recovery guarantee”
- **Provenance type and evidence references:** Implementation facts I5–I6; context claim C3
- **Transition:** System diagram reduces into a neutral background for discussion prompts.

### Scene 6: TPM follow-up

- **Duration:** 12 seconds
- **Purpose:** Present the exact discussion areas requested by the TPM without supplying unsupported answers.
- **Visual state and motion:** Four question cards appear in sequence.
- **On-screen text:** “Dependencies?”; “Observable interruption?”; “Rollout order?”; “Next recovery slice?”
- **Provenance type and evidence references:** Context claim C2
- **Transition:** Hold final frame for the creator discussion.

## Narration script

**0:00–0:12** — This PR adds lease-based leader replacement and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.

**0:12–0:29** — When a leader lease deadline passes, the runtime queues a `LeaseExpired` event for the protocol state machine.

**0:29–0:47** — The protocol handles the event, requests votes, and makes the follower leader after quorum.

**0:47–1:04** — Each leadership term has a higher fencing token. The storage adapter rejects writes that carry a stale token.

**1:04–1:18** — Work that was in flight on the previous leader is not reconstructed. The PR makes no zero-downtime or transparent-recovery guarantee.

**1:18–1:30** — The follow-up discussion is about dependencies, the observable interruption, rollout order, and what the next recovery slice must cover.

## Caption plan

Use the approved narration verbatim. Split cues at sentence or natural-clause boundaries, keep each cue within its scene, and use no more than two short lines. Preserve the exact qualifiers “does not guarantee,” “not reconstructed,” and “makes no ... guarantee.” Produce captions but no synthesized narration audio.

## Visual system and branding

No brand assets are included in the fixture. Use the fallback system: 16:9 at 1920×1080, dark neutral background, off-white text, a cool accent for current protocol state, and a warm warning accent for expired/stale/out-of-scope states. Use a sans-serif face and monospace only for event and token labels. Preserve stable object identity throughout.

## Approval checklist

- [ ] Audience and fine-tuning
- [ ] Message and takeaway
- [ ] Content boundaries
- [ ] Renderer
- [ ] Storyboard and narration
- [ ] Duration (90 seconds)
- [ ] Brand treatment

## Post-approval rendering and review correction protocol

1. User approval freezes the message, audience, storyboard, narration, renderer, duration, visual direction, and claim provenance.
2. The **coding/rendering agent owns every creation action**: it creates and edits animation source and assets, writes captions, runs all renders, produces the MP4, and maintains the production manifest. It cannot reinterpret the approved narrative.
3. The **review agent owns verification only**. It inspects the actual MP4 and compares it with the frozen packet, evidence, source, captions, narration, and manifest. It never edits source or media and never runs a render.
4. For a small implementation mismatch—clipping, contrast, typo, caption timing, missing approved label, scene duration, or an incorrectly implemented transition—the review agent sends a precise correction request to the existing coding/rendering agent. That agent edits and rerenders; the review agent verifies the new MP4.
5. A change to message, audience, emphasis, technical depth, scene order, substantive claim, narration, renderer, duration, metaphor, visual direction, or unsupported analysis returns to the **user**. It cannot be handled inside the creation/verification loop.
6. Delivery occurs only after the review agent verifies the latest MP4 and records a pass.

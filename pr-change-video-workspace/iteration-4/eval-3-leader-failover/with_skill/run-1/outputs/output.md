# Video plan: Add lease-based leader failover

**Awaiting approval; no source or render created.**

## Treatment

- **Audience:** TPM; assume leader/follower familiarity, use moderate depth, and emphasize stated system boundaries and coordination concerns.
- **Renderer / duration:** Manim, 90 seconds.
- **Source-stated message:** Election and stale-writer fencing are covered; in-flight recovery is out of scope. Do not call this seamless failover. [C3]

## Content ledger

PR implementation sources: **I1** runtime queues `LeaseExpired`; **I2** protocol requests votes and becomes leader after quorum; **I3** terms have monotonically increasing fencing tokens; **I4** storage rejects stale-token writes; **I5** in-flight work is not reconstructed; **I6** zero downtime and transparent recovery are not guaranteed.

Context sources: **C1** implementer expected automatic, unnoticeable failover; **C2** TPM needs information about dependencies, observable interruption, rollout order, and the next recovery slice; **C3** final-review statement quoted above.

**Contradiction:** C1 conflicts with I5–I6 and C3, so the video does not present unnoticeable, seamless, transparent, or zero-downtime recovery as behavior. The sources give no rollout sequence, interruption duration, dependency list, or next-slice definition; none will be supplied.

## Not represented

The contradicted implementer quote, file-level details, inferred benefits or risks, recommendations, conclusions, answers to the TPM's concerns, and calls to action.

## Renderer decision

Persistent leader, follower, lease, event, vote, token, and storage objects change state or relationship through I1–I4. Manim preserves their identity during those transformations. Remotion's editorial cuts are weaker for tracking this continuous protocol sequence. Production requires Manim; timing must not imply a recovery-duration guarantee.

## Timed scenes

Narration is also the verbatim caption source.

| Time | Purpose | Narration and caption text | Visual state and motion | On-screen text | Provenance |
|---|---|---|---|---|---|
| 0–14s | Scope | “This PR adds lease-based election and stale-writer fencing. It does not guarantee transparent or zero-downtime recovery.” | Leader/follower diagram; recovery label remains outside scope | “Election + fencing” | I2–I6, C3 |
| 14–31s | Runtime boundary | “When a lease deadline passes, runtime queues a `LeaseExpired` event for the protocol.” | Lease expires; event moves runtime → queue → protocol | `LeaseExpired` | I1 |
| 31–49s | Election | “The protocol requests votes and makes the follower leader after quorum.” | Follower → candidate; votes accumulate; leader state appears | “Quorum” | I2 |
| 49–66s | Storage boundary | “Each term has a higher fencing token. Storage rejects stale-token writes.” | Token 8 → 9; storage rejects 8 | “Stale → rejected” | I3–I4 |
| 66–78s | Recovery limit | “Work in flight on the previous leader is not reconstructed.” | Work remains with prior leader | “Not reconstructed” | I5, C3 |
| 78–90s | TPM context | “The TPM identified dependencies, observable interruption, rollout order, and the next recovery slice as needed information.” | Four neutral labels; no questions or answers | Source terms only | C2 |

## Visual system

No brand assets were supplied. Use 1920×1080, dark neutral background, off-white text, cool active-state accent, warm expired/stale/out-of-scope accent, and stable object shapes. No synthesized audio.

## Approval and production boundary

Approve source fidelity, audience treatment, renderer, timed scenes, duration, and visual system. Approval freezes them.

The **coding/rendering agent** alone edits source, assets, captions, and manifests and runs every render. The **review agent** only verifies the actual MP4 against the frozen packet; it never edits or renders. Small mismatches such as clipping, missing approved text, or timing drift go to coding/rendering for correction and rerender. Any content or creative-direction change, including added analysis or action, goes to the user.

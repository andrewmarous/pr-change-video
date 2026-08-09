# Synthetic GitHub PR export

URL: https://github.com/acme/coordinator/pull/411
Title: Add lease-based leader failover
Audience fixture: TPM

## PR description

Add a follower state that observes leader leases and starts an election after a lease-expired event. Add fencing tokens to writes accepted by the storage adapter.

## Final diff summary

- The runtime adapter converts elapsed lease deadlines into queued `LeaseExpired` events.
- The protocol state machine handles `LeaseExpired`, requests votes, and becomes leader after quorum.
- Each leadership term has a monotonically increasing fencing token.
- The storage adapter rejects writes with stale tokens.
- The PR does not reconstruct work that was in flight on the previous leader.
- The PR does not guarantee zero downtime or transparent recovery.

## Standup transcript

Implementer: "Once this lands, failover should be automatic and callers won't notice a leader going away."

TPM: "We need to understand dependencies, the observable interruption, rollout order, and what the next recovery slice must cover."

## Final review

Reviewer: "Election and stale-writer fencing are covered. In-flight operation recovery is explicitly out of scope. Please avoid calling this seamless failover."

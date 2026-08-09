# Synthetic GitHub PR export

URL: https://github.com/acme/console/pull/928
Title: Consolidate billing settings into a guided flow
Audience fixture: executive

## PR description

Replace three separate billing settings pages with one guided flow. Users can review the current plan, update payment details, and confirm changes without leaving the flow.

## Final diff summary

- Adds `BillingFlow` with review, payment, and confirmation steps.
- Reuses the existing payment form and server mutation.
- Adds analytics for flow entry, step completion, cancellation, and success.
- Does not change pricing, permissions, invoices, or payment processing.

## Review discussion

The rollout remains behind the existing `billing_flow_v2` flag. Mobile spacing was corrected in the final revision. Reviewers explicitly rejected language implying that checkout is faster; the PR does not include performance measurements.

## Assets

Three approved before/after screenshots and the Acme horizontal logo are available. The logo must retain its aspect ratio. No other brand specification was supplied.

## Rollout notes

Enable internally first, then for ten percent of eligible workspaces. The video should prepare leadership to discuss adoption and rollout confidence, not implementation files.

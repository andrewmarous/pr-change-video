# Synthetic GitHub PR export

URL: https://github.com/acme/vector-core/pull/184
Title: Avoid exact reserve during incremental append
Audience fixture: IC

## PR description

Bulk append currently calls `reserve_exact(len + incoming.len)` before every append. This was intended to reduce allocations. Replace it with the collection's geometric growth path.

## Final diff

```diff
- items.reserve_exact(batch.len());
  items.extend(batch);
```

`extend` uses the iterator size hint and the vector's normal growth strategy. No public API changes.

## Early general discussion

Implementer: "The allocator should reuse the existing allocation here, so the old call is probably harmless."

## Final review

Reviewer: "Confirmed with the benchmark: repeated one-element batches previously forced exact growth and repeated copies. Removing `reserve_exact` restores amortized growth."

## Implementer notes

Explain the failure through a persistent vector object, its length and capacity, heap buffers, reallocations, and copied elements. Do not turn the video into a benchmark report.

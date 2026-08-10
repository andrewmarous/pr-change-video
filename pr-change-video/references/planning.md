# Planning agent contract

The planning agent owns evidence selection and presentation planning. It does not create animation source, render video, or analyze the change beyond what the sources state.

## Evidence collection

Collect and save:

- PR metadata, description, state, base and head revisions
- commits and changed files
- full diff
- review summaries and states
- inline review comments, including file and line context
- general PR discussion
- relevant repository files needed to interpret the diff
- user-supplied documents, notes, transcripts, links, images, and brand assets

Create `evidence/evidence-ledger.md`. For each material claim, record its source, whether it is an implementation fact or an attributed context claim, and any contradiction. Prefer stable links and commit-specific references when available.

The diff is authoritative only for what changed and what behavior the code implements. User-provided context is authoritative for the creator's motivation, rationale, tradeoffs, intended impact, risks, emphasis, conclusions, next steps, and way of communicating. It cannot establish behavior that the code does not implement.

Never infer argumentative or evaluative content from the code. This prohibition includes claims that a choice is simpler, faster, safer, more maintainable, more scalable, less risky, or intentionally optimized unless the user-provided context says so. It also includes inferred problem statements, motivations, benefits, drawbacks, design rationale, implications, conclusions, recommendations, next steps, questions, and calls to discussion.

Code can supply neutral mechanism details needed to visualize an established point. It cannot supply the point itself. If context does not explain why the change exists, which tradeoff matters, or what happens next, omit that content. Mark a blocking narrative gap only when the remaining source material cannot form a coherent artifact. Do not fill gaps with analysis.

A visual can show only objects, states, relationships, and transitions that a supplied source names or that are directly observable in the PR code. Do not add a plausible intermediate state to make an animation feel complete. Labeling a value or state as illustrative does not make an unsupported mechanism acceptable.

Treat the represented information as immutable. You may shorten it, reorder it, define source terminology, and choose a visual representation. Do not strengthen or weaken qualifiers, combine separate claims into a new conclusion, translate uncertainty into certainty, or add connective statements that assert an unstated causal relationship.

Separate source content from production metadata. Renderer choice, timing, layout, audience treatment, and the approval gate are production decisions. Keep them concise and do not present them as claims about the change. Do not invent operational prerequisites from how evidence happens to be packaged; if a source says an asset is available, accept that statement unless production actually fails to access it.

## Audience presets

Recommend one preset, explain the recommendation, and expose every assumption for editing.

### TPM

- Start with the delivery or coordination problem.
- Include system boundaries, dependencies, rollout information, and open points only when the sources state them.
- Include enough mechanism to make sequencing and risk understandable.
- Avoid implementation detail that the selected source material does not need.

### Executive

- Start with the highest-level message explicitly stated in the supplied context; if none exists, state the change neutrally.
- Include outcomes, risks, tradeoffs, and organizational relevance only when the sources state them.
- Use technical mechanisms only when they establish credibility or explain a material constraint.
- Avoid file-level narration and implementation vocabulary unless essential.

### IC

- Start with the engineering problem or failure mode when the sources state one; otherwise start with the neutral change.
- Include mechanisms, design choices, tradeoffs, and operational effects only as established by the sources.
- Use precise domain terminology and small code excerpts when they clarify behavior.
- Avoid walking through the diff chronologically.

For every preset, expose these editable fields:

- assumed viewer knowledge
- technical depth
- terminology and definitions
- emphasis
- exclusions
- tone

## Renderer selection

Choose based on the dominant explanatory primitive, not on whether the topic merely looks technical.

Choose **Manim** when comprehension depends on objects preserving identity while their state, value, position, structure, or relationships change. Strong signals include:

- memory layout, allocation, ownership, or data-structure evolution
- algorithms and stepwise transformations
- distributed state, concurrency, queues, protocols, or control flow
- compiler, type-system, or execution semantics
- signal processing, optimization, numerical methods, probability, geometry, or other mathematical models
- a mechanism that is much clearer as a spatial or temporal model than as slides

Choose **Remotion** when comprehension depends on editorial composition across a timeline. Strong signals include:

- product or UI behavior
- feature tours and before/after comparisons
- screenshots, recordings, assets, and branded layouts
- architecture summaries whose components do not need continuous transformation
- release narratives, milestones, timelines, and stakeholder impact
- code excerpts, callouts, and mixed media arranged as scenes

Technical depth is evidence, not the deciding rule. A technical API change can still favor Remotion; a moderately technical data-structure change can favor Manim.

Use this deciding question:

> Does the explanation primarily need persistent objects to transform so the viewer can build a mental model, or does it need media and narrative beats composed on a timeline?

The approval packet must include:

- selected renderer
- evidence from the PR and planned scenes supporting the choice
- why the other renderer is less effective for this explanation
- any established renderer-specific risk or dependency material to the choice

Keep the entire video in one renderer for v1.

## Narrative provenance

Every narrative beat must have one of two provenance types:

- **Implementation fact:** a neutral statement of what the PR changes or what behavior the code implements.
- **Context-supported claim:** motivation, rationale, tradeoff, intended impact, risk, emphasis, evaluation, conclusion, next step, or argumentative framing stated in user-provided context.

Do not create an `inference` provenance type. Do not convert an implementation fact into an evaluative claim. For example, code that removes an allocation does not by itself establish that performance motivated the change or that the result is faster. Do not end with a discussion prompt or next step unless its wording is supported by context.

The timed narrative and every storyboard scene must cite its provenance. If a scene cannot be supported under these rules, remove it or place a direct question in the approval packet.

## Duration and scope

Target 90 seconds for all audiences. Require explicit user approval for more than 120 seconds. If the story does not fit, reduce scope to one explanatory thread rather than increasing pace or making text unreadable.

Use only the parts of this compact narrative arc that the sources support:

1. Problem or motivation
2. Change
3. Mechanism at the chosen audience depth
4. Stated impact, constraint, tradeoff, conclusion, or next step

## ElevenLabs narration

Own the exact spoken-only text and all generation-affecting choices. Do not include timestamps, speaker labels, scene labels, or production directions in the submitted text. Save the approved generation inputs as `plan/approved-narration.json` with the fields consumed by `scripts/narration-request.mjs`; derive its `text` by concatenating the timed-scene narration in scene order exactly once.

Before approval, use only free read-only metadata requests to establish:

- voice ID and name;
- model ID, text-to-speech support, and maximum text length per request;
- voice settings and pronunciation dictionary ID/version, when used;
- exact submitted character count;
- documented credit-per-character rate or model multiplier and its source; and
- estimated request credits.

Do not generate previews, samples, partial narration, or tests. If the applicable rate cannot be established, state that it is unknown and keep generation blocked. If the text exceeds the selected model's limit, shorten the plan and request approval again; never plan multiple speech requests.

Use natural speech timing as authoritative after generation. Planned timestamps are estimates and may be retimed locally without changing scene order, content, or visual direction. Set one global scene-padding default and record only intentional per-scene overrides. Mark silent scenes and transitions explicitly; never encode silence through punctuation alone. Require fresh user approval if actual retiming would push the video over 120 seconds.

## Approval packet

Target no more than 550 words. A longer packet requires a concrete reason. State each fact, caveat, exclusion, and production decision once. Combine the narrative, storyboard, narration, captions, and provenance into one timed scene table instead of repeating the same content across separate sections.

Write `plan/approval-packet.md` with this structure:

```markdown
# Video plan: [PR title]

## Treatment
- Audience preset:
- Fine-tuning:
- Renderer:
- Renderer rationale and rejected alternative:
- Target duration:
- Visual system and brand treatment:
- Narration: ElevenLabs
- Narration authorization: voice ID; model ID and settings; pronunciation dictionary ID/version or none; exact spoken character count; documented credit rate and source; estimated credits; model request limit; one full-script request
- Timing policy: global scene padding and any per-scene overrides or explicit silent intervals

## Source boundaries
- Include only material contradictions, omissions, or gaps that the user must see before approval.
- Do not repeat claims that already appear in the timed scenes.
- Do not list generic prohibitions or absent topics.
- Omit this section when there is no material item to present. Never assert that no other contradiction, conflict, gap, risk, or omission exists; that is an unsupported completeness claim.

## Timed scenes
| Time | Purpose | Narration and caption text | Visual state and motion | On-screen text | Provenance |

## Approval
Approve this packet or specify changes. Production remains paused.
```

Ensure scene durations sum to the target duration and every narrative beat points back to IDs in the separate evidence ledger. Use the narration column verbatim as the caption source; split it into cues during production. Check that every evaluative, argumentative, causal, future-looking, or discussion-oriented statement is directly supported by user-provided context. Do not add speculative production risks; include only established renderer-specific risks or dependencies material to the choice. Clearly label presentation recommendations so the user can override them without changing source meaning.

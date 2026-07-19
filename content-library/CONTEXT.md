# CONTEXT: load order and prompt slices

Read (and fold) in this order. Earlier files govern later ones.

1. `constraints/connection-northstar.md`: the governing rule. Every other file must obey it.
2. `constraints/humanizer.md`: how every model output talks. Both prompts embed it.
3. `skills/<routed-skill>.md`: the principle being drilled, its observable signals and
   bands. Feeds the unit's `principle`, `exemplar`, `rubric`, and the pack's `signals`.
4. `personas/<persona>.md`: who the character is. Feeds the unit's `persona` block
   (brief, hidden_depth, opener, warmth_rules, behavior_by_warmth).
5. `prompts/character-system-prompt.md`: the per-turn template. Composes 1 + 2 + 4.
6. `prompts/feedback-prompt.md`: the session-end template. Composes 1 + 2 + 3.
7. `library/talks.md`: reference only. Deepens 3. Never served.

## Which file feeds which prompt slice

CHARACTER CALL (`assembleCharacterTurn`, tag: 'character')

| slice                              | source                            | static or variable |
| ---------------------------------- | --------------------------------- | ------------------ |
| identity, never-break-character    | persona brief + scenario          | static (cacheable) |
| hidden depth + reveal-in-layers    | persona hidden_depth              | static             |
| warmth rules (+1 / -1 / 0)         | persona warmth_rules              | static             |
| behavior at ALL warmth levels 0..3 | persona behavior_by_warmth        | static             |
| voice directives                   | constraints/humanizer.md          | static             |
| strict JSON output contract        | prompts/character-system-prompt   | static             |
| current warmth level               | session (server-held)             | variable, in the [session context] first message |
| compact user profile (<=5 lines)   | DB projections via renderUserProfile | variable, same message |
| conversation so far                | session transcript                | variable, the remaining messages |

FEEDBACK CALL (`assembleFeedback`, tag: 'feedback')

| slice                               | source                          | static or variable |
| ----------------------------------- | ------------------------------- | ------------------ |
| did-they-connect frame + paradox    | connection-northstar + skill    | static (cacheable) |
| evidence rules, no-score rule       | prompts/feedback-prompt.md      | static             |
| strict JSON output contract         | prompts/feedback-prompt.md      | static             |
| compact user profile                | renderUserProfile               | variable           |
| labeled transcript                  | session transcript              | variable           |

The static slice is the `system` string; `AnthropicChatModel` marks it `cache_control:
ephemeral`, so keeping it byte-identical across turns is what makes prompt caching keep
the cost near zero. Anything that changes per turn goes in the messages, never in system.

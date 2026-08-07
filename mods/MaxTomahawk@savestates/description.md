# Save States

Save States adds native rolling quicksaves, event-based autosaves and permanent
save slots to Gen1Recomp without replacing the normal Pokémon save system.

- rolling manual and automatic checkpoint histories;
- ten renameable permanent slots;
- one-level undo-load recovery;
- native START-menu and state-manager screens;
- configurable histories, triggers, and notifications;
- strict game/playthrough isolation and corruption-safe loading;
- settled overworld and supported ordinary wild/trainer battle restoration.

Only runtime boundaries proven safe by the engine are accepted. Suspended scripts,
transitions, partial animations, unsupported battle variants, and arbitrary frames
are rejected rather than approximated.

## Status

This staged entry mirrors the current technical-preview manifest. It must not be
submitted until an installable non-experimental GitHub Release exists; version,
engine range, and compatibility fields must be copied again from that release.

## License

MIT

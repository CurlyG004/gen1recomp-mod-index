A developer tool for mod authors; regular players don't need it.

Once installed, the START menu gains a HOOKS entry listing every loaded
mod. Pick one to see its public surface: the exports other mods can
call through `mod.find(id)`, and the events it broadcasts. Pick a hook
to read its description. Every pick is also printed to the console,
untruncated and copyable.

No mod has to cooperate to show up. Exports are enumerated live off
the loader, so the list reflects what is actually installed and
running. Events are found in each mod's own source, and a watcher on
the event bus catches names built at runtime. A hook's description is
the comment written above its definition, when there is one.

The model behind the screens is itself a public hook:
`exports.inspect()` returns every loaded mod with its hooks, so other
tools can build on the same data.

# Who's That Trainer?
Ever wanted to play Pokémon as yourself or Giovanni, Pikachu, or face Red as the rival? Now you can!

**Who's That Trainer?** lets you swap between your character or 17 iconic Gen 1 characters — complete with overworld sprites, battle sprites, and trainer portraits. Choose your character, rival, and follower independently from the start menu. You can also add unlimited custom characters by dropping your own sprites into a folder.

## ✨ Features

- **17 Built-in Characters:** RED, GIOVANNI, PIKACHU, BROCK, MISTY, LT. SURGE, ERIKA, KOGA, SABRINA, BLAINE, LORELEI, BRUNO, AGATHA, LANCE, BLUE, JESSIE, and JAMES
- **Unlimited Custom Characters:** Drop your own sprites into `custom_characters/` — no Lua editing required
- **Independent Selection:** Pick your player character, follower, and rival separately
- **Full Sprite Support:** Overworld walking sprites, bike sprites, battle back sprites, and trainer card portraits
- **Runtime Transforms:** All built-in sprites generated from your ROM cache — no copyrighted artwork shipped
- **Seamless Integration:** Access all three menus from the start menu (CHARACTER, RIVAL, FOLLOWER)

## 🎮 How to Use

1. **Enable the mod** via the in-game mod manager (F10) or edit `options.lua`
2. **Open the start menu** during gameplay
3. Select **CHARACTER** to change your player sprite
4. Select **RIVAL** to change your rival's appearance
5. Select **FOLLOWER** to change your follower appearance
6. Changes apply immediately — no restart needed!

## 🎨 Custom Characters

You can add your own characters to the mod without editing any Lua files. Just create a subfolder with your sprites and an optional config file.

### Step by step on mod repository

## ⚠️ Known Limitations

- **Rival battle portraits:** Currently display in grayscale due to engine palette pipeline limitations. This requires adding a `trainer.pic` hook to the engine core (tracked as future enhancement).
- **Palette accuracy:** Some built-in characters may use fallback palettes if their original sprite data is unavailable in your ROM cache.

## 🔄 Updating from Previous Versions

If you're updating from an older version (< 0.0.3), you may need to regenerate back sprites to get the corrected orientation:

1. Delete the `assets/generated/battle/player_back/` folder
2. Restart the game — assets will regenerate automatically
3. Reimport your ROM.

🗺️ **Roadmap**
- [x] Player Sprite Swap (Overworld, Bike & Battle).
- [x] Rival Sprite Swap.
- [x] Select follower Sprite in overworld.
- [x] Custom Sprite Injection: Allow players to load custom PNG files to create their own characters.
- [x] Starter Swap: Syncs the starter with the character(at now just yellow and it add as a 2nd starter).
- [ ] **Custom Starter follow as the default(maybe another mod PC follower) could solve it) and add humor window to all pkmn** In progress.
- [ ] **Custom Rival battle pallete:** a BUG that rival pallete on battles are appearing in mono colors.
- [ ] **follower vanilla and rival:** a BUG that rival and follower back to original sometimes on overworld.


## 📝 Credits

All built-in character sprites are derived from the original Red/Blue/Yellow ROMs via runtime transformation. No copyrighted artwork is distributed with this mod.

PS: only tested on Yellow and recomp version 0.1.6

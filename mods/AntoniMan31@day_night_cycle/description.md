**Ce mod nécessite la traduction française.** Ses textes sont en français, et
la police extraite du ROM ne connaît qu'un seul accent : `é`. Tous les autres
viennent de la page de police que le mod de traduction enregistre. Sans elle,
les répliques s'affichent avec des trous. La traduction se génère avec
[gen1recomp-translation-mod-generator](https://github.com/thibautbus/gen1recomp-translation-mod-generator).

---

Une journée simulée de **24 heures**, parcourue en **24 minutes réelles** : une
minute réelle vaut une heure simulée. Le jour va de **8h à 20h**.

Le temps ne passe **qu'en marchant sur la carte, en extérieur**. Il s'arrête
dans un bâtiment, en combat, dans les menus, pendant un dialogue, un warp ou une
cinématique.

## Ce que ça change

- **La nuit tombe.** La carte s'assombrit progressivement — une heure simulée de
  crépuscule, une d'aube.
- **Les dresseurs dorment.** La nuit, ils gardent leur sprite et leur place mais
  ne provoquent plus au regard. Leur parler les réveille — ils grognent — puis
  le combat se lance comme avant. Les combats scénarisés (rival, Giovanni,
  champions d'arène) gardent leur ouverture d'origine.
- **Les portes se frappent.** Entrer dans un bâtiment la nuit demande de toquer.
- **DORMIR** au menu START, la nuit et en extérieur : fondu au noir, soin complet
  de l'équipe (PV, statuts, PP avec le bonus PP-Plus) et retour au matin.
- **Un indicateur** JOUR / NUIT et l'heure simulée en `HH:MM` dans le coin de
  l'écran, grisé en intérieur pour rendre la pause visible.
- **60 répliques tirées au hasard** — 20 aux portes, 20 à l'endormissement, 20
  aux dresseurs réveillés. Jamais deux fois la même d'affilée.

## Dix réglages, dans MODS → Cycle Jour/Nuit

| Ligne | Défaut | Effet |
| --- | --- | --- |
| `CYCLE` | ON | interrupteur général ; OFF rend le mod entièrement silencieux |
| `DUREE` | 24 MIN | 12, 24, 48 ou 72 min pour une journée de 24 h |
| `NUIT SOMBRE` | ON | assombrissement de la carte la nuit |
| `DRESSEURS` | ON | la nuit, plus de provocation au regard |
| `TOC TOC` | ON | la nuit, frapper avant d'entrer |
| `DORMIR` | ON | la ligne de sommeil dans le menu START |
| `DORMIR: NUIT` | ON | restreint le sommeil à la nuit |
| `INDICATEUR` | ON | le mot JOUR/NUIT et l'heure à l'écran |
| `INTENSITE NUIT` | NORMALE | LEGERE / NORMALE / FORTE |
| `FIGER L'HEURE` | AUTO | arrête la journée sur JOUR (14h) ou NUIT (2h) |

`DUREE` change la vitesse, jamais les bornes : le jour commence toujours à 8h.

## Installation

Téléchargez le `.zip` de la dernière release, puis dans le launcher :
**MODS → Import mod .zip**.

## Comment c'est fait

Le cycle répond au hook `world.tod` du moteur, prévu exactement pour ça : le
moteur met la période en cache et la passe à `map.palette` et `music.select`.

Quatre fonctionnalités enveloppent en revanche une méthode interne, faute de
hook — `Renderer.blitCanvas`, `OverworldState.checkTrainerSight`, `.takeWarp` et
`.engageTrainer`. C'est pourquoi le mod se déclare en profil `overhaul`. Chacune
s'installe défensivement (l'emplacement posé sur la table cible porte le module
vivant, donc un rechargement à chaud reste correct), dégrade proprement en
journalisant la méthode déplacée si le moteur change, et porte son propre
interrupteur dans le menu MODS.

La non-collision a été vérifiée contre les 45 mods de l'index lus en source.
2435 vérifications automatisées pilotent le vrai moteur — `Renderer`,
`ScriptRunner`, `OverworldState`, `TextBox`, `ManagerState` — vertes sur
gen1recomp v0.1.72.

## À savoir

- **Ce mod n'a pas encore été joué en session longue.** Les tests prouvent qu'il
  fait ce qu'on lui demande, pas qu'il soit agréable. Trois réglages existent
  précisément pour ajuster après coup : `INTENSITE NUIT`, `DUREE`, `TOC TOC`.
- Les grottes, la Forêt de Jade, le Parc Safari et la Route 23 comptent comme
  extérieur : le temps y passe et la nuit y tombe. Pokémon Cristal fait le même
  choix pour ses donjons.
- Les intérieurs ne s'assombrissent pas la nuit.
- Pas d'éclairage de fenêtres dans cette version.
- Si un autre mod assombrit déjà le monde la nuit (Dramatic Shape Voxel Mod),
  ce mod le détecte et ne peint pas par-dessus.

## Traductions

**Les traductions vers d'autres langues sont les bienvenues.** Tout le texte
visible passe par le registre `text` sous des identifiants numérotés
(`DAY_NIGHT_KNOCK_01` … `DAY_NIGHT_WAKE_20`), donc un mod de traduction peut les
remplacer sans toucher une ligne de code. Contraintes : 18 colonnes par ligne,
deux lignes visibles, et aucune majuscule accentuée n'existe dans les polices du
jeu. Ouvrez une issue ou une pull request.

## Crédits

- **gen1recomp** — le moteur, ses hooks, son harnais de test et `modkit`.
- **gen1recomp-translation-mod-generator** — la traduction française et la page
  de police qui rend les accents dessinables.
- **pret/pokecrystal** — référence pour le traitement des donjons et le
  mécanisme d'éclairage nocturne par palette.
- **Bulbapedia** — le walkthrough Rouge/Bleu (CC BY-NC-SA 2.5), utilisé en
  référence locale pour vérifier qu'aucun PNJ bloqueur de progression n'est
  cassé. Non redistribué.
- **Dramatic Shape Voxel Mod** — point de comparaison pour la teinte 2D, et mod
  détecté à l'exécution pour ne pas peindre par-dessus la sienne.
- **widescreen_battle_intro** — modèle pour la discipline d'enveloppement.
- **trainer_rematch** — non-collision vérifiée en chargeant les deux ensemble.
- **HEAL_ANYWHERE** — référence pour la cohabitation dans le menu START.

MIT.

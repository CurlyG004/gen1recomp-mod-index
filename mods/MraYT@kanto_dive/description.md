# Kanto Dive

Kanto Dive adds HM06 DIVE and Emerald-style underwater exploration to Gen1Recomp. Surface water regions are explicitly linked to authored underwater landing regions, allowing the player to dive, move beneath Kanto and surface at the corresponding location.

## Features

- HM06 DIVE as a battle move and field action.
- DIVE and SURFACE actions on explicitly linked water cells.
- Bidirectional coordinate mapping between surface and underwater regions.
- Dark DIVE water visible in 2D, Tilt and Voxel views.
- Surf movement and mount rendering preserved while underwater.
- Route 19 Reef Passage with two separate entrances and an underwater corridor.
- Route 20 Seafloor, Seafoam Sunken Cave and Route 21 Trench.
- Wild encounters on underwater maps.
- Tiled-based authoring workflow with paired `DiveZones` and `DiveLandings` objects.
- Public API allowing other mods to register additional DIVE zones.
- Compatibility handling for Dramatic Sky Ride mounted rendering.

## Obtaining HM06

After defeating Blaine and obtaining the Volcano Badge, visit the Metronome Room in the Cinnabar Pokémon Lab. The scientist who normally gives TM35 also grants HM06 without replacing the original TM35 reward.

## Authoring

The repository includes editable TMX examples, a route template and a converter for creating additional underwater areas. Links use a shared `linkId`, so surface and underwater regions can be placed at different map coordinates while retaining Emerald-style paired movement.

Kanto Dive is released under the MIT License.

/**
 * XP for a capture. Figma shows "+70 XP earned" on the first species but
 * defines no rule, so this is ours: 50 for a species new to the life list, 10
 * for seeing one again, and 20 more when the capture reaches a milestone. That
 * makes a first capture worth 70, as drawn.
 *
 * Everything here follows from the life list itself (species, sightings,
 * milestones reached), so a total can be recomputed at any time without
 * storing XP anywhere.
 */
export const XP_NEW_SPECIES = 50;
export const XP_REPEAT_SIGHTING = 10;
export const XP_MILESTONE = 20;

export function xpForCapture(isNewSpecies: boolean, reachedMilestone: boolean): number {
  return (isNewSpecies ? XP_NEW_SPECIES : XP_REPEAT_SIGHTING) + (reachedMilestone ? XP_MILESTONE : 0);
}

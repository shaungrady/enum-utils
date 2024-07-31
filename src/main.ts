export { default as EnumSet } from './classes/EnumSet.js';
export { default as EnumMap } from './classes/EnumMap.js';

export { default as enumToSet } from './functions/enumToSet.js';
export { default as isEnumMember } from './functions/isEnumMember.js';
export { default as isValidEnumMember } from './functions/isValidEnumMember.js';

// Fixes downstream `TS2742` errors:
//   The inferred type of "X" cannot be named without a reference to "Y".
//
// This is related to package A using `enum-utils` and exporting an `EnumSet`,
// then package B importing that `EnumSet` and calling `toEnumMap()`.
export type { Opaque } from 'type-fest';

export type { EnumSetMembers } from './types/EnumSetMembers.js';
export type { EnumMapMembers } from './types/EnumMapMembers.js';
export type { EnumMapValues } from './types/EnumMapValues.js';
export type { EnumMember } from './types/EnumMember.js';

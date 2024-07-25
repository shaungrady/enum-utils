import type EnumMap from '../classes/EnumMap.js';

export type EnumMapMembers<TEnumMap> =
	TEnumMap extends EnumMap<any, infer TMembers, any, any> ? TMembers : never;

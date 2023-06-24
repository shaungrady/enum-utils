import type EnumMap from '../classes/EnumMap.js';

export type EnumMapValues<TEnumMap> = TEnumMap extends EnumMap<
	any,
	any,
	any,
	infer TValues
>
	? TValues
	: never;

import type EnumSet from '../classes/EnumSet.js';

export type EnumSetMembers<TEnumSet> = TEnumSet extends EnumSet<infer TMembers>
	? TMembers
	: never;

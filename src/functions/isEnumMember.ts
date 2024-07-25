import type { StringKeyOf } from 'type-fest';
import type { EnumMember } from '../types/EnumMember.js';
import enumToSet from './enumToSet.js'; // WeakMap cache of previously-processed enums

// WeakMap cache of previously-processed enums
const enumMembersByEnum = new WeakMap<
	Record<string, EnumMember>,
	Set<EnumMember>
>();

/**
 * Checks if the given value is a valid member of the specified enum object,
 * acting as a type guard.
 *
 * @param enumObject The runtime representation of an enum definition.
 * @param value The value to check enum membership with.
 * @returns Returns true if a member with the specified value exists in the
 *   EnumSet object; otherwise, false.
 */
export default function isEnumMember<
	TEnum extends Record<StringKeyOf<TEnum>, EnumMember>,
	TEnumMember extends TEnum[StringKeyOf<TEnum>],
>(enumObject: TEnum, value: unknown): value is TEnumMember {
	const isCached = enumMembersByEnum.has(enumObject);

	if (isCached) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		return enumMembersByEnum.get(enumObject)!.has(value as any);
	}

	const enumMembers = enumToSet<TEnumMember>(enumObject);
	enumMembersByEnum.set(enumObject, enumMembers);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	return enumMembers.has(value as any);
}

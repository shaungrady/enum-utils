import type { StringKeyOf } from 'type-fest';
import type { EnumMember } from '../types/EnumMember';
import enumToSet from './enumToSet';

// WeakMap cache of previously-processed enums
const enumMembersByEnum = new WeakMap<
	Record<string, EnumMember>,
	Set<EnumMember>
>();

export default function isEnumMember<
	TEnum extends Record<StringKeyOf<TEnum>, EnumMember>,
	TEnumMember extends TEnum[StringKeyOf<TEnum>]
>(enumObject: TEnum, value: unknown): value is TEnumMember {
	const isCached = enumMembersByEnum.has(enumObject);

	if (isCached) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		return enumMembersByEnum.get(enumObject)!.has(value as any);
	}

	const enumMembers = new Set(enumToSet<TEnumMember>(enumObject));
	enumMembersByEnum.set(enumObject, enumMembers);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	return enumMembers.has(value as any);
}

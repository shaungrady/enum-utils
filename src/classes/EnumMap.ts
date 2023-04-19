import type {
	IfUnknown,
	LiteralToPrimitive,
	Opaque,
	StringKeyOf,
} from 'type-fest';
import enumToSet from '../functions/enumToSet';
import { type EnumMember } from '../types/EnumMember';

export default class EnumMap<
	TEnum extends Record<StringKeyOf<TEnum>, EnumMember>,
	TEnumMember extends TEnum[StringKeyOf<TEnum>],
	TRecord extends Record<TEnumMember, any>,
	TRecordValue extends TRecord[keyof TRecord],
	TGuarded = Opaque<TEnumMember>
> implements ReadonlyMap<TEnumMember, TRecordValue>
{
	static fromEnum<
		TEnum extends Record<StringKeyOf<TEnum>, EnumMember>,
		TEnumMember extends TEnum[StringKeyOf<TEnum>],
		TRecord extends Record<TEnumMember, any>,
		TRecordValue extends TRecord[keyof TRecord]
	>(
		enumObject: TEnum,
		mappings: TRecord
	): EnumMap<TEnum, TEnumMember, TRecord, TRecordValue> {
		const enumMembers = Array.from(enumToSet<TEnumMember>(enumObject));
		return new this(enumMembers.map((member) => [member, mappings[member]]));
	}

	readonly #map = new Map<TEnumMember, TRecordValue>();

	get size(): number {
		return this.#map.size;
	}

	constructor(entries: ReadonlyArray<readonly [TEnumMember, TRecordValue]>) {
		for (const entry of entries) {
			this.#map.set(...entry);
		}
	}

	has = (
		key: unknown
	): key is TEnumMember extends number ? TEnumMember & TGuarded : TEnumMember =>
		this.#map.has(key as TEnumMember);

	get = <T>(
		key: T
	): T extends TEnumMember
		? // If we're dealing with a numeric enum,
		  T extends number
			? // Then we can only be sure it's a valid key if it's been guarded by
			  // `has` because the types for numeric enum members are number
			  // primitives instead of number literals, like you'd expect.
			  T extends TGuarded
				? TRecordValue
				: TRecordValue | undefined
			: TRecordValue
		: T extends LiteralToPrimitive<TEnumMember>
		? TRecordValue | undefined
		: IfUnknown<T, TRecordValue | undefined, undefined> =>
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
		this.#map.get(key as any) as any;

	keys = this.#map.keys.bind(this.#map);
	values = this.#map.values.bind(this.#map);
	entries = this.#map.entries.bind(this.#map);
	forEach = this.#map.forEach.bind(this.#map);
	[Symbol.iterator] = this.#map[Symbol.iterator].bind(this.#map);

	toString(): string {
		return '[object EnumMap]';
	}
}

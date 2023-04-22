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
	/**
	 * Returns an `EnumMap` instance that maps each enum member in the given enum
	 * to a corresponding value in the given mappings object. The mapping object
	 * value types may either be inferred or defined by the optional type
	 * argument. If inferred, it's recommended to use the `as const` assertion on
	 * the mapping object to narrow the value types.
	 *
	 * @example
	 * 	enum Color {
	 * 		Red,
	 * 		Green,
	 * 		Blue,
	 * 	}
	 *
	 * 	const colorHexMap = EnumMap.fromEnum({
	 * 		[Color.Red]: '#f00',
	 * 		[Color.Green]: '#0f0',
	 * 		[Color.Blue]: '#00f',
	 * 	} as const);
	 *
	 * @param enumObject - The enum object to create the `EnumMap` from.
	 * @param mappings An object that maps each EnumSet member to a corresponding
	 *   value.
	 * @returns An instance of `EnumMap` containing the enum members and their
	 *   corresponding values.
	 */
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

	/** @returns The number of enum members in EnumMap. */
	get size(): number {
		return this.#map.size;
	}

	constructor(entries: ReadonlyArray<readonly [TEnumMember, TRecordValue]>) {
		for (const entry of entries) {
			this.#map.set(...entry);
		}
	}

	/**
	 * The **has()** method returns a boolean indicating whether an enum member
	 * with the specified value exists in the `EnumMap` object or not, acting as a
	 * [type
	 * guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).
	 *
	 * @param value The value to test for presence in the EnumMap object.
	 * @returns Returns true if a member with the specified value exists in the
	 *   `EnumMap` object; otherwise false.
	 */
	has = (
		value: unknown
	): value is TEnumMember extends number
		? TEnumMember & TGuarded
		: TEnumMember => this.#map.has(value as TEnumMember);

	/**
	 * The **get()** method returns a specified element from an `EnumMap` object.
	 *
	 * @param key The key of the element to return from the EnumMap object.
	 * @returns If the key's value has been guarded by the **has()** method, then
	 *   the return type will be non-nullish. If the key is an illegal enum member
	 *   type, then return type will be `undefined`.
	 */
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

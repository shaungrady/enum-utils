import type { StringKeyOf } from 'type-fest';
import enumToSet from '../functions/enumToSet.js';
import type { EnumMember } from '../types/EnumMember.js';
import EnumMap from './EnumMap.js';

export default class EnumSet<TEnumMember extends EnumMember>
	implements ReadonlySet<TEnumMember>
{
	/**
	 * Creates a new `EnumSet` instance from the given enum object.
	 *
	 * @example
	 * 	enum Color {
	 * 		Red,
	 * 		Green,
	 * 		Blue,
	 * 	}
	 * 	const colors = EnumSet.fromEnum(Color); // EnumSet<Color>
	 *
	 * @param enumObject - The enum object to create the EnumSet from.
	 * @returns A new `EnumSet` instance containing all the members of the enum
	 *   object.
	 */
	static fromEnum<
		TEnum extends Record<StringKeyOf<TEnum>, EnumMember>,
		TEnumMember extends TEnum[StringKeyOf<TEnum>]
	>(enumObject: TEnum): EnumSet<TEnumMember> {
		return new this(enumToSet<TEnumMember>(enumObject));
	}

	readonly #set = new Set<TEnumMember>();

	/** @returns The number of enum members in `EnumSet`. */
	get size(): number {
		return this.#set.size;
	}

	constructor(members: readonly TEnumMember[] | Set<TEnumMember>) {
		for (const member of members) {
			this.#set.add(member);
		}
	}

	/**
	 * The **has()** method returns a boolean indicating whether an enum member
	 * with the specified value exists in the `EnumSet` object or not, acting as a
	 * [type
	 * guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).
	 *
	 * @param value The value to test for presence in the `EnumSet` object.
	 * @returns Returns `true` if a member with the specified value exists in the
	 *   `EnumSet`; otherwise false.
	 */
	has = (value: unknown): value is TEnumMember =>
		this.#set.has(value as TEnumMember);

	/**
	 * The **subset()** method returns a new `EnumSet` instance containing only
	 * the enum members specified, which must be members of the `EnumSet`.
	 *
	 * @param members A subset of the `EnumSet`'s members.
	 * @returns A new `EnumSet` instance consisting of the specific subset of enum
	 *   members.
	 */
	subset = <T extends TEnumMember[]>(members: T): EnumSet<T[number]> =>
		new EnumSet(members.filter(this.has));

	/**
	 * Returns an `EnumMap` instance that maps each enum member in the `EnumSet`
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
	 * 	const colorHexMap = EnumSet.fromEnum(Color).toEnumMap<`#${string}`>({
	 * 		[Color.Red]: '#f00',
	 * 		[Color.Green]: '#0f0',
	 * 		[Color.Blue]: '#00f',
	 * 	});
	 *
	 * @param mappings An object that maps each `EnumSet` member to a
	 *   corresponding value.
	 * @returns An instance of `EnumMap` containing the enum members and their
	 *   corresponding values.
	 */
	toEnumMap = <TRecordValue = any>(
		mappings: Record<TEnumMember, TRecordValue>
	) => {
		const enumMapTuples = Array.from(this.#set).map(
			(member) => [member, mappings[member]] as const
		);

		return new EnumMap<
			Record<string, TEnumMember>,
			TEnumMember,
			typeof mappings,
			TRecordValue
		>(enumMapTuples);
	};

	keys = this.#set.keys.bind(this.#set);
	values = this.#set.values.bind(this.#set);
	entries = this.#set.entries.bind(this.#set);
	forEach = this.#set.forEach.bind(this.#set);
	[Symbol.iterator] = this.#set[Symbol.iterator].bind(this.#set);

	toString(): string {
		return '[object EnumSet]';
	}
}

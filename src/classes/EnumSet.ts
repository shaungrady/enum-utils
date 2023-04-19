import type { StringKeyOf } from 'type-fest';
import enumToSet from '../functions/enumToSet';
import type { EnumMember } from '../types/EnumMember';
import EnumMap from './EnumMap';

export default class EnumSet<TEnumMember extends EnumMember>
	implements ReadonlySet<TEnumMember>
{
	static fromEnum<
		TEnum extends Record<StringKeyOf<TEnum>, EnumMember>,
		TEnumMember extends TEnum[StringKeyOf<TEnum>]
	>(enumObject: TEnum): EnumSet<TEnumMember> {
		return new this<TEnumMember>(enumToSet(enumObject));
	}

	readonly #set = new Set<TEnumMember>();

	get size(): number {
		return this.#set.size;
	}

	constructor(members: readonly TEnumMember[] | Set<TEnumMember>) {
		for (const member of members) {
			this.#set.add(member);
		}
	}

	has = (value: unknown): value is TEnumMember =>
		this.#set.has(value as TEnumMember);

	subset = <T extends TEnumMember[]>(members: T): EnumSet<T[number]> =>
		new EnumSet(members.filter(this.has));

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

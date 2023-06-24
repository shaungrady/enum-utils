import test from 'ava';
import { HeterogeneousEnum, NumericEnum, StringEnum } from './utils/Enums.js';
import { expectTypeOf } from 'expect-type';
import EnumMap from '../src/classes/EnumMap.js';
import { EnumMapMembers } from '../src/types/EnumMapMembers.js';
import EnumSet from '../src/classes/EnumSet.js';

const createMap = () =>
	EnumMap.fromEnum(HeterogeneousEnum, {
		[HeterogeneousEnum.Zero]: NumericEnum.Zero,
		[HeterogeneousEnum.One]: StringEnum.Alpha,
		[HeterogeneousEnum.Alpha]: NumericEnum.One,
		[HeterogeneousEnum.Bravo]: StringEnum.Bravo,
	} as const);

const createSet = () => EnumSet.fromEnum(HeterogeneousEnum);

test('returns the original enum type', (t) => {
	const map = createMap();

	expectTypeOf<EnumMapMembers<typeof map>>().toEqualTypeOf<HeterogeneousEnum>();

	t.pass();
});

test('returns a union of enum members for subsets', (t) => {
	const map = createSet()
		.subset([HeterogeneousEnum.Alpha, HeterogeneousEnum.One])
		.toEnumMap({
			[HeterogeneousEnum.Alpha]: 'foo',
			[HeterogeneousEnum.One]: 'bar',
		} as const);

	expectTypeOf<EnumMapMembers<typeof map>>().toEqualTypeOf<
		HeterogeneousEnum.Alpha | HeterogeneousEnum.One
	>();

	t.pass();
});

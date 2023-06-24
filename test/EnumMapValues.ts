import test from 'ava';
import { HeterogeneousEnum, NumericEnum, StringEnum } from './utils/Enums.js';
import { expectTypeOf } from 'expect-type';
import EnumMap from '../src/classes/EnumMap.js';
import { EnumMapValues } from '../src/types/EnumMapValues.js';

const createMap = () =>
	EnumMap.fromEnum(HeterogeneousEnum, {
		[HeterogeneousEnum.Zero]: NumericEnum.Zero,
		[HeterogeneousEnum.One]: StringEnum.Alpha,
		[HeterogeneousEnum.Alpha]: 7,
		[HeterogeneousEnum.Bravo]: ':D',
	} as const);

test('returns a union of values', (t) => {
	const map = createMap();

	expectTypeOf<EnumMapValues<typeof map>>().toEqualTypeOf<
		NumericEnum.Zero | StringEnum.Alpha | 7 | ':D'
	>();

	t.pass();
});

import test from 'ava';
import EnumSet from '../src/classes/EnumSet.js';
import { HeterogeneousEnum } from './utils/Enums.js';
import { expectTypeOf } from 'expect-type';
import { EnumSetMembers } from '../src/types/EnumSetMembers.js';

const createSet = () => EnumSet.fromEnum(HeterogeneousEnum);

test('returns the original enum type', (t) => {
	const set = createSet();

	expectTypeOf<EnumSetMembers<typeof set>>().toEqualTypeOf<HeterogeneousEnum>();

	t.pass();
});

test('returns a union of enum members for subsets', (t) => {
	const subset = createSet().subset([
		HeterogeneousEnum.Alpha,
		HeterogeneousEnum.One,
	]);

	expectTypeOf<EnumSetMembers<typeof subset>>().toEqualTypeOf<
		HeterogeneousEnum.Alpha | HeterogeneousEnum.One
	>();

	t.pass();
});

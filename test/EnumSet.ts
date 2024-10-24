import test from 'ava';
import { expectTypeOf } from 'expect-type';
import EnumSet from '../src/classes/EnumSet.js';
import { HeterogeneousEnum, NumericEnum, StringEnum } from './utils/Enums.js';

const createSet = () => EnumSet.fromEnum(HeterogeneousEnum);

test('constructs', (t) => {
	t.notThrows(createSet);
});

test("'size' reflects the number of enum members", (t) => {
	const set = createSet();

	t.is(set.size, 4);
});

test("'has' returns true for enum members", (t) => {
	const set = createSet();

	t.is(set.has(HeterogeneousEnum.Zero), true);
	t.is(set.has(HeterogeneousEnum.Alpha), true);
	t.is(set.has(1), true);
	t.is(set.has('B'), true);
});

test("'has' returns false for non-enum members", (t) => {
	const set = createSet();

	t.is(set.has(3), false);
	t.is(set.has('C'), false);
});

test("'has' is a type guard", (t) => {
	const set = createSet();
	const value = 0 as number;

	if (set.has(value)) {
		expectTypeOf(value).toMatchTypeOf<HeterogeneousEnum>();
		t.pass();
	} else {
		expectTypeOf(value).toMatchTypeOf<number>();
		t.fail();
	}
});

test("'subset' defines a new order", (t) => {
	enum OrderedEnum {
		Zero,
		One,
		Two = 'Z',
		Three = 'A',
		Four = 'S',
		Five = -1,
	}

	const set = EnumSet.fromEnum(OrderedEnum);
	const subsetArray = [
		OrderedEnum.One,
		OrderedEnum.Zero,
		OrderedEnum.Three,
		OrderedEnum.Five,
	];
	const subset = set.subset(subsetArray);

	t.deepEqual(subsetArray, Array.from(subset));
});

test("'subset.has' throws compile error for invalid array elements", (t) => {
	const set = createSet();

	// @ts-expect-error
	const subsetA = set.subset([HeterogeneousEnum.Zero, NumericEnum.Zero]);
	// @ts-expect-error
	const subsetB = set.subset([StringEnum.Alpha]);
	// @ts-expect-error
	const subsetC = set.subset([2]);

	t.pass();
});

test("'subset.has' is a type guard", (t) => {
	const set = createSet();
	const subset = set.subset([HeterogeneousEnum.Zero, HeterogeneousEnum.Alpha]);
	const value = 0 as number;

	if (subset.has(value)) {
		expectTypeOf(value).toMatchTypeOf<
			HeterogeneousEnum.Zero | HeterogeneousEnum.Alpha
		>();
		t.pass();
	} else {
		expectTypeOf(value).toMatchTypeOf<number>();
		t.fail();
	}
});

test('ergonomically filters', (t) => {
	const set = createSet();
	const array = ['1', 'Two', HeterogeneousEnum.Bravo, '👎'];
	const result: HeterogeneousEnum[] = array.filter(set.has);

	t.deepEqual(result, [HeterogeneousEnum.Bravo]);
});

test("'toEnumMap' constructs an EnumMap", (t) => {
	const set = createSet();

	const map = set.toEnumMap({
		[HeterogeneousEnum.Zero]: 'Zero',
		[HeterogeneousEnum.One]: 'One',
		[HeterogeneousEnum.Alpha]: 'Alpha',
		[HeterogeneousEnum.Bravo]: 'Bravo',
	} as const);

	const keys = Array.from(map.keys());
	const values = Array.from(map.values());

	expectTypeOf(keys).branded.toEqualTypeOf<HeterogeneousEnum[]>();
	expectTypeOf(values).toEqualTypeOf<
		Array<'Zero' | 'One' | 'Alpha' | 'Bravo'>
	>();

	t.deepEqual(keys, [0, 1, 'A', 'B']);
	t.deepEqual(values, ['Zero', 'One', 'Alpha', 'Bravo']);
});

test("'toEnumMap' mappings are exhaustive", (t) => {
	const set = createSet();

	// @ts-expect-error
	set.toEnumMap({
		[HeterogeneousEnum.Zero]: 'Zero',
	});

	t.pass();
});

test("'toEnumMap' preserves order", (t) => {
	enum OrderedEnum {
		Zero,
		One,
		Two = 'Z',
		Three = 'A',
		Four = 'S',
		Five = -1,
	}

	const set = EnumSet.fromEnum(OrderedEnum);

	set.toEnumMap({
		[OrderedEnum.Five]: '',
		[OrderedEnum.Four]: '',
		[OrderedEnum.One]: '',
		[OrderedEnum.Three]: '',
		[OrderedEnum.Two]: '',
		[OrderedEnum.Zero]: '',
	});

	const keys = Array.from(set.keys());
	t.deepEqual(keys, [
		OrderedEnum.Zero,
		OrderedEnum.One,
		OrderedEnum.Two,
		OrderedEnum.Three,
		OrderedEnum.Four,
		OrderedEnum.Five,
	]);
});

test("'toEnumMap' mapping values can be set via type argument", (t) => {
	const set = createSet();

	set.toEnumMap<1 | 2 | 3 | '4'>({
		[HeterogeneousEnum.Zero]: 1,
		[HeterogeneousEnum.One]: 2,
		[HeterogeneousEnum.Alpha]: 3,
		// @ts-expect-error
		[HeterogeneousEnum.Bravo]: 4,
	});

	t.pass();
});

test("'toEnumMap' mapping values can be heterogeneous types", (t) => {
	const set = createSet();

	set.toEnumMap({
		[HeterogeneousEnum.Zero]: 1,
		[HeterogeneousEnum.One]: '',
		[HeterogeneousEnum.Alpha]: [],
		[HeterogeneousEnum.Bravo]: {},
	} as const);

	t.pass();
});

test("'values' returns enum members", (t) => {
	const set = createSet();
	t.snapshot(set.values());
});

test("'keys' returns enum members", (t) => {
	const set = createSet();
	t.snapshot(set.keys());
});

test("'entries' returns enum members", (t) => {
	const set = createSet();
	t.snapshot(set.entries());
});

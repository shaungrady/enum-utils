import test from 'ava';
import { expectTypeOf } from 'expect-type';
import EnumMap from '../src/classes/EnumMap.js';
import { HeterogeneousEnum, NumericEnum, StringEnum } from './utils/Enums.js';

const createNumericMap = () =>
	EnumMap.fromEnum(NumericEnum, {
		[NumericEnum.Zero]: StringEnum.Alpha,
		[NumericEnum.One]: StringEnum.Bravo,
	} as const);

const createStringMap = () =>
	EnumMap.fromEnum(StringEnum, {
		[StringEnum.Alpha]: HeterogeneousEnum.Zero,
		[StringEnum.Bravo]: HeterogeneousEnum.One,
	} as const);

const createHeterogeneousEnum = () =>
	EnumMap.fromEnum(HeterogeneousEnum, {
		[HeterogeneousEnum.Zero]: NumericEnum.Zero,
		[HeterogeneousEnum.One]: StringEnum.Alpha,
		[HeterogeneousEnum.Alpha]: NumericEnum.One,
		[HeterogeneousEnum.Bravo]: StringEnum.Bravo,
	} as const);

test('constructs', (t) => {
	t.notThrows(createNumericMap);
});

test('constructs with a mapping of heterogeneous values', (t) => {
	t.notThrows(() =>
		EnumMap.fromEnum(HeterogeneousEnum, {
			[HeterogeneousEnum.Zero]: 1,
			[HeterogeneousEnum.One]: '',
			[HeterogeneousEnum.Alpha]: [],
			[HeterogeneousEnum.Bravo]: {},
		}),
	);
});

test("'size' reflects the number of enum members", (t) => {
	const map = createNumericMap();

	t.is(map.size, 2);
});

test("'has' returns true for enum members", (t) => {
	const map = createNumericMap();

	t.is(map.has(NumericEnum.Zero), true);
	t.is(map.has(NumericEnum.One), true);

	t.is(map.has(0), true);
	t.is(map.has(1), true);
});

test("'has' returns false for non-enum members", (t) => {
	const map = createNumericMap();

	t.is(map.has(2), false);
	t.is(map.has('2'), false);
	t.is(map.has(NumericEnum), false);
});

test("'has' is a type guard", (t) => {
	const map = createNumericMap();
	const value = 0 as string | number;

	if (map.has(value)) {
		expectTypeOf(value).toMatchTypeOf<NumericEnum>();
		expectTypeOf(map.get(value)).toMatchTypeOf<StringEnum>();
		t.pass();
	} else {
		expectTypeOf(value).toEqualTypeOf<number | string>();
		t.fail();
	}
});

test("'has' guards number values for numeric enums", (t) => {
	const map = createNumericMap();
	const value = NumericEnum.One;

	const preHasMappedValue = map.get(value);
	expectTypeOf(preHasMappedValue).toEqualTypeOf<StringEnum | undefined>();

	if (map.has(value)) {
		const postHasMappedValue = map.get(value);
		expectTypeOf(preHasMappedValue).not.toEqualTypeOf(postHasMappedValue);
		expectTypeOf(postHasMappedValue).toMatchTypeOf<StringEnum>();
		t.pass();
	} else {
		t.fail();
	}
});

test("'get' returns dynamic types for numeric enums", (t) => {
	const map = createNumericMap();

	const enumKey = NumericEnum.Zero;
	const numberKey = 0;
	const stringKey = 'A';
	const illegalKey = Symbol();
	const unknownKey = '👾' as unknown;

	// Limitation of numeric/heterogeneous enums… (these must be guarded with `has`)
	expectTypeOf(map.get(enumKey)).toEqualTypeOf<StringEnum | undefined>();
	expectTypeOf(map.get(numberKey)).toEqualTypeOf<StringEnum | undefined>();
	// The rest should have types that you'd expect
	expectTypeOf(map.get(stringKey)).toEqualTypeOf<undefined>();
	expectTypeOf(map.get(illegalKey)).toEqualTypeOf<undefined>();
	expectTypeOf(map.get(unknownKey)).toEqualTypeOf<StringEnum | undefined>();

	t.pass();
});

test("'get' returns dynamic types for heterogeneous enums", (t) => {
	const map = createHeterogeneousEnum();

	const numericEnumKey = HeterogeneousEnum.Zero;
	const stringEnumKey = HeterogeneousEnum.Alpha;

	const numberKey = 0;
	const stringKey = 'A';
	const illegalKey = Symbol();
	const unknownKey = '👾' as unknown;

	type MapValues = NumericEnum | StringEnum;

	// Limitation of numeric/heterogeneous enums… (these must be guarded with `has`)
	expectTypeOf(map.get(numericEnumKey)).toEqualTypeOf<MapValues | undefined>();
	expectTypeOf(map.get(stringEnumKey)).toEqualTypeOf<MapValues | undefined>();
	expectTypeOf(map.get(numberKey)).toEqualTypeOf<MapValues | undefined>();
	// The rest should have types that you'd expect
	expectTypeOf(map.get(stringKey)).toEqualTypeOf<MapValues | undefined>();
	expectTypeOf(map.get(illegalKey)).toEqualTypeOf<undefined>();
	expectTypeOf(map.get(unknownKey)).toEqualTypeOf<MapValues | undefined>();

	t.pass();
});

test("'get' returns dynamic types for string enums", (t) => {
	const map = createStringMap();

	const enumKey = StringEnum.Alpha;
	const stringKey = 'A';
	const numberKey = 0;
	const illegalKey = Symbol();
	const unknownKey = '👾' as unknown;

	type MapValues = HeterogeneousEnum.Zero | HeterogeneousEnum.One;

	expectTypeOf(map.get(enumKey)).toEqualTypeOf<MapValues>();
	expectTypeOf(map.get(stringKey)).toEqualTypeOf<MapValues | undefined>();
	expectTypeOf(map.get(numberKey)).toEqualTypeOf<undefined>();
	expectTypeOf(map.get(illegalKey)).toEqualTypeOf<undefined>();
	expectTypeOf(map.get(unknownKey)).toEqualTypeOf<MapValues | undefined>();

	t.pass();
});

test('ergonomically filters', (t) => {
	const map = createStringMap();

	const array = ['2', StringEnum.Alpha, 'One', '👎'];
	const result: StringEnum[] = array.filter(map.has);

	t.deepEqual(result, [StringEnum.Alpha]);
});

test('ergonomically filters and maps', (t) => {
	const map = createNumericMap();
	const array = [NumericEnum.One, 'Foo', Symbol(), NumericEnum.Zero];
	const result = array.filter(map.has).map(map.get);

	expectTypeOf(result).branded.toEqualTypeOf<StringEnum[]>();
	t.deepEqual(result, [StringEnum.Bravo, StringEnum.Alpha]);
});

test("'keys' returns enum members", (t) => {
	const map = createHeterogeneousEnum();
	t.snapshot(map.keys());
});

test("'values' returns mapping values", (t) => {
	const map = createHeterogeneousEnum();
	t.snapshot(map.values());
});

test("'entries' returns enum member and mapping value pairs", (t) => {
	const map = createHeterogeneousEnum();
	t.snapshot(map.entries());
});

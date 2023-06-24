import test from 'ava';
import { expectTypeOf } from 'expect-type';
import isEnumMember from '../src/functions/isEnumMember.js';
import { NumericEnum } from './utils/Enums.js';

test('guards valid values', (t) => {
	const validValue = 0 as unknown;

	if (isEnumMember(NumericEnum, validValue)) {
		expectTypeOf(validValue).toEqualTypeOf<NumericEnum>();
		t.pass();
	} else {
		expectTypeOf(validValue).toEqualTypeOf<unknown>();
		t.fail();
	}
});

test('guards invalid values', (t) => {
	const validValue = Number.POSITIVE_INFINITY as any;

	if (isEnumMember(NumericEnum, validValue)) {
		expectTypeOf(validValue).toEqualTypeOf<NumericEnum>();
		t.fail();
	} else {
		expectTypeOf(validValue).toEqualTypeOf<any>();
		t.pass();
	}
});

test('ignores reverse-lookup values in numeric enums', (t) => {
	enum Enum {
		One = 1,
	}

	const value = 'One';

	t.is(Enum['1'], 'One');
	t.false(isEnumMember(NumericEnum, value));
});

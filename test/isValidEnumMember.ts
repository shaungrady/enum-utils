import test from 'ava';
import isValidEnumMember from '../src/functions/isValidEnumMember';

const macro = test.macro({
	exec(t, input: any, expected: boolean) {
		t.is(isValidEnumMember(input), expected);
	},
	title(providedTitle = '', input, expected: boolean) {
		return `${expected ? 'validates' : 'invalidates'} ${providedTitle}`.trim();
	},
});

test('strings', macro, '', true);
test('finite numbers', macro, 0, true);

// @ts-expect-error
test('BigInts', macro, 1n, false);
test('infinite numbers', macro, Number.POSITIVE_INFINITY, false);
test('NaN', macro, Number.NaN, false);
test('objects', macro, {}, false);
test('symbols', macro, Symbol(), false);
test('null', macro, null, false);
test('undefined', macro, undefined, false);

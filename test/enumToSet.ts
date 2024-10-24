import test from 'ava';
import enumToSet from '../src/functions/enumToSet.js';
import { HeterogeneousEnum } from './utils/Enums.js';
import { expectTypeOf } from 'expect-type';

test('creates a Set of members', (t) => {
	const members = enumToSet<HeterogeneousEnum>(HeterogeneousEnum);

	expectTypeOf(members).toEqualTypeOf<Set<HeterogeneousEnum>>();
	t.deepEqual(members, new Set([0, 1, 'A', 'B']));
});

test('preserves the enum order', (t) => {
	enum OrderedEnum {
		Zero,
		One,
		Two = 'Z',
		Three = 'A',
		Four = 'S',
		Five = -1,
	}

	const members = enumToSet(OrderedEnum);

	t.deepEqual(members, new Set([0, 1, 'Z', 'A', 'S', -1]));
});

import test from 'ava';
import enumToSet from '../src/functions/enumToSet';
import { HeterogeneousEnum } from './utils/Enums';

test('creates a Set of members', (t) => {
	const members = enumToSet(HeterogeneousEnum);
	t.deepEqual(members, new Set([0, 1, 'A', 'B']));
});

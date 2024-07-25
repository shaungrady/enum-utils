import type { Finite } from 'type-fest';

/**
 * Type guards values as an eligible enum member: a finite number or string.
 *
 * @param value The value to guard.
 */
export default function isValidEnumMember(
	value: unknown,
): value is string | Finite<number> {
	const type = typeof value;

	return type === 'string' || (type === 'number' && Number.isFinite(value));
}

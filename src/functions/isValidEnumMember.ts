import type { Finite } from 'type-fest';

/**
 * Type guard for validating values as potential enum member values.
 * @param value The value to validate
 */
export default function isValidEnumMember(
	value: unknown
): value is string | Finite<number> {
	return (
		typeof value === 'string' ||
		(typeof value === 'number' && Number.isFinite(value))
	);
}

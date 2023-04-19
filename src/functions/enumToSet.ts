import type { EnumMember } from '../types/EnumMember';
import isValidEnumMember from './isValidEnumMember';

/**
 * Converts an enum runtime object to an array of its members. This is safe to
 * use with numeric, string, and heterogeneous enums.
 * @param enumObject The runtime representation of an enum definition
 */
export default function enumToSet<TEnumMember extends EnumMember>(
	enumObject: Record<string, unknown>
): Set<TEnumMember> {
	const members = Object.values(enumObject).filter(
		(value): value is TEnumMember => {
			if (isValidEnumMember(value)) {
				return typeof value === 'string'
					? typeof enumObject[value] !== 'number'
					: true;
			}

			return false;
		}
	);

	return new Set(members);
}

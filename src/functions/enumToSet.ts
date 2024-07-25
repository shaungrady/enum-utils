import type { EnumMember } from '../types/EnumMember.js';
import isValidEnumMember from './isValidEnumMember.js';

/**
 * Converts an enum runtime object to an array of its members. This is safe to
 * use with numeric, string, and heterogeneous enums.
 *
 * @param enumObject The runtime representation of an enum definition.
 * @returns A Set of each enum member.
 */
export default function enumToSet<TEnumMember extends EnumMember>(
	enumObject: Record<string, EnumMember>,
): Set<TEnumMember> {
	const members = Object.values(enumObject).filter(
		(value): value is TEnumMember => {
			if (isValidEnumMember(value)) {
				return typeof value === 'string'
					? // Make sure this isn't a reverse-lookup for a numeric member
						typeof enumObject[value] !== 'number'
					: true;
			}

			return false;
		},
	);

	return new Set(members);
}

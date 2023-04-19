import type { Finite } from 'type-fest';

export type EnumMember = Finite<number> | string;

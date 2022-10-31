import { FilterType } from "./enums";

export type FilterObj = {
	type: FilterType;
	value: string | number;
	field: string;
};

export type SearchFields<T> = Extract<keyof T, string>[];

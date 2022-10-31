import {
	FindOptionsWhere,
	LessThan,
	LessThanOrEqual,
	MoreThan,
	MoreThanOrEqual,
} from 'typeorm';
import { FilterType } from './enums';
import { FilterObj } from './types';

const isNumeric = (num: string) => !Number.isNaN(Number(num.trim()));

export const filterObjToTypeORM = (
	filterList: FilterObj[]
): FindOptionsWhere<any> => {
	const filterWhere: FindOptionsWhere<any> = {};
	filterList.forEach((filter) => {
		if (filter.type == FilterType.eq)
			filterWhere[filter.field] = filter.value;
		else if (filter.type == FilterType.gt)
			filterWhere[filter.field] = MoreThan(filter.value);
		else if (filter.type == FilterType.gte)
			filterWhere[filter.field] = MoreThanOrEqual(filter.value);
		else if (filter.type == FilterType.lt)
			filterWhere[filter.field] = LessThan(filter.value);
		else if (filter.type == FilterType.lte)
			filterWhere[filter.field] = LessThanOrEqual(filter.value);
	});
	return filterWhere;
};

export const filterQueryObjMapper = (value: string | string[]): FilterObj[] => {
	const filterArray = Array.isArray(value) ? value : value.split(',');
	return filterArray.map((filterValue) => {
		if (!filterValue.includes('=')) throw Error("Filter must contain '='");
		const [key, value] = filterValue.split('=');
		if (
			key.endsWith(`__${FilterType.gt}`) ||
			key.endsWith(`__${FilterType.lt}`)
		) {
			return {
				type: key.slice(-2) as FilterType,
				value: Number(value),
				field: key.slice(0, -4),
			};
		} else if (
			key.endsWith(`__${FilterType.gte}`) ||
			key.endsWith(`__${FilterType.lte}`)
		) {
			return {
				type: key.slice(-3) as FilterType,
				value: Number(value),
				field: key.slice(0, -5),
			};
		} else {
			return {
				type: FilterType.eq,
				value: isNumeric(value) ? Number(value) : value,
				field: key,
			};
		}
	});
};

import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SortOrder } from './enums';
import { filterQueryObjMapper } from './helper';
import { FilterObj } from './types';

export class ListFilter {
	@Transform(({ value }) => Math.max(Number(value), 1))
	@IsNumber()
	@IsOptional()
	public page = 1;

	@Transform(({ value }) => Math.max(Number(value), 1))
	@IsNumber()
	@IsOptional()
	public pageSize = 10;

	@IsOptional()
	public orderBy?: string;

	@IsEnum(SortOrder)
	@IsOptional()
	public sortOrder?: SortOrder = SortOrder.DESC;

	@IsOptional()
	public search?: string;

	@IsOptional()
	@IsArray()
	@Type(() => String)
	@Transform(({ value }) => filterQueryObjMapper(value))
	filter?: FilterObj[];
}

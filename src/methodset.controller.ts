import {
	Body,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	BaseEntity,
	DeepPartial,
	FindManyOptions,
	FindOptionsWhere,
	ILike,
	Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { filterObjToTypeORM } from './helper';
import { ListFilter } from './query';
import { SearchFields } from './types';

export abstract class MethodSet<T extends BaseEntity> {
	protected abstract readonly repository: Repository<T>;
	protected pagination = true;
	protected pageSize: number;
	protected searchFields: SearchFields<T>;
	protected where: FindManyOptions<T>;
	@Get(':id')
	async get(@Param('id', ParseIntPipe) id: number): Promise<T> {
		return this.repository.findOneById(id);
	}

	@Get()
	async list(@Query() filter: ListFilter) {
		const queryBuilder = this.repository.createQueryBuilder('alias');
		if (this.searchFields && filter.search) {
			const whereSearch: FindOptionsWhere<T> = {};
			this.searchFields.forEach(
				(field) =>
					(whereSearch[`${field}` as string] = ILike(
						`%${filter.search}%`
					))
			);
			queryBuilder.andWhere(whereSearch);
		}
		if (this.where) {
			queryBuilder.andWhere(this.where);
		}
		if (filter.filter && filter.filter.length > 0) {
			const filterWhere = filterObjToTypeORM(filter.filter);
			queryBuilder.andWhere(filterWhere);
		}
		if (filter.orderBy) {
			queryBuilder.orderBy(
				`${queryBuilder.alias}.${filter.sortOrder}`,
				filter.sortOrder
			);
		}
		if (this.pagination) {
			const pageSize = this.pageSize ?? filter.pageSize;
			queryBuilder.take(pageSize);
			queryBuilder.skip((filter.page - 1) * pageSize);
		}
		const [items, totalCount] = await queryBuilder.getManyAndCount();
		return { items, totalCount };
	}

	@Post()
	async post(@Body() dto: DeepPartial<T>): Promise<T> {
		return this.repository.save(dto);
	}

	@Delete()
	async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
		this.repository.delete(id);
	}

	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: QueryDeepPartialEntity<T>
	): Promise<void> {
		this.repository.update(id, dto);
	}
}

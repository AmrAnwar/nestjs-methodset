# nestjs-methodset

NestJS MethodSet is influenced by ViewSet Django Rest Framework, which is basically extendable Controller that contains all required methods already implemented with TypeORM (all CRUD).


[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Installation

```bash
npm i nestjs-methodset
```

in `main.ts` add following to the app:

```typescript
import { ValidationPipe } from '@nestjs/common';
...
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
```

# Code

-   Simply extends `MethodSet` in your controller and you done.
    Make sure to have the `repository` in your controller dependencies!

```typescript
import { MethodSet } from 'nestjs-methodset';

@Controller({ path: 'article' })
export class ArticleController extends MethodSet<ArticleEntity> {
	constructor(
		@InjectRepository(ArticleEntity)
		protected readonly repository: Repository<ArticleEntity>
	) {
		super();
	}
}
```

-   Now your API has the following implemented functions:
    -   get: GET `/article/<id>`
    -   list: GET `/article`
    -   post: POST `/article`
    -   update: UPDATE `/article/<id>`

# List EndPoint Options:

the list endpoint contains different options as following:

-   page & page size: `?&page=1&pageSize=3`
-   order & sortOrder(default: DESC): `?orderBy=timestamp&sortOrder=ASC`
-   search : `?search=test`
-   filter: `?filter=price__lte=10,total=2` or can be written `?filter[]=price__lte=10&filter[]=total=2`

# All Filter Valid Options:

-   `<field>=<value>`, equals, ie: `?filter=price=10`
-   `<field>__gt=<value>`, greater than, ie: `filter=price__lte=10`
-   `<field>__gte=<value>` greater than or equal
-   `<field>__lt=<value>` less than
-   `<field>__lte=<value>` less than or equal

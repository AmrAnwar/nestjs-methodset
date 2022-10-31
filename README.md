# nestjs-methodset

**MethodSet** is an abstract controller that when extended will provide:
- All the required `GET`/`DELETE`/`POST`/`UPDATE` endpoints for the TypeORM repository.
- List endpoint contains: pagination, order, search, filter options.
- filter options contains: `=`, `gt`, `gte`, `lt`, `lte`

**nestjs-methodSet** is influenced by **ViewSet** in Django Rest Framework

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
    -   delete: DELETE `/article/<id>`

# List URL Params:

the list endpoint contains different options as following:

-   **page** & **pageSize**: `?&page=1&pageSize=3`
-   **orderBy** & **sortOrder**(default: DESC): `?orderBy=timestamp&sortOrder=ASC`
-   **search** : `?search=test`
    -   Must specify search fields in the controller, ie:
    ```typescript
    searchFields: SearchFields<ArticleEntity> = ['body', 'title'];
    ```
-   **filter[]**:
    -   separate conditions by `,` ie: `?filter=price__lte=10,total=2`,
    -   Or can be written: `?filter[]=price__lte=10&filter[]=total=2`

# All Filter Valid Options:

-   `<field>=<value>`, equals, ie: `?filter=price=10`
-   `<field>__gt=<value>`, greater than, ie: `filter=price__lte=10`
-   `<field>__gte=<value>` greater than or equal
-   `<field>__lt=<value>` less than
-   `<field>__lte=<value>` less than or equal

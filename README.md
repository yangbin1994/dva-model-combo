[see it pre use](https://github.com/dvajs/dva-model-extend/issues/2#issuecomment-336608205)
# dva-model-combo

[![](https://img.shields.io/travis/yangbin1994/dva-model-combo.svg?style=flat-square)](https://travis-ci.org/yangbin1994/dva-model-combo)
[![npm package](https://img.shields.io/npm/v/dva-model-combo.svg?style=flat-square)](https://www.npmjs.org/package/dva-model-combo)
[![Dependency Status](https://david-dm.org/yangbin1994/dva-model-combo.svg?style=flat-square)](https://david-dm.org/yangbin1994/dva-model-combo)

Utility method to combo dva model.

## Installation

```bash
npm install --save dva-model-combo
```

## Usage

````js
import modelCombo from 'dva-model-combo';

const tableClass = {
  reducers: {
    querySuccess(state, { payload: pagination }) {
      return { 
        ...state, 
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
  },
}

const routeModel = modelCombo('media_search', {
  domain: 'header',
  state: {
    menu: [],
    extend: true,
  },
}, {
  domain: 'body',
  state: {
    data: [],
    pagination: {}
  },
  mixin: tableClass,
})

=>

{
    "namespace":
    "media_search",
    "state":
    {
        "header":
        {
            "menu": [],
            "extend": true,
        },
        "body":
        {
            "data": [],
            "pagination": {},
        }
    },
    "subscriptions": {},
    "effects": {},
    "reducers": {
        'body$querySuccess': (state, { payload: pagination }) => {
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...pagination,
                },
            }
        },
    },
}

````

## API

### modelCombo(namespace, ...domains) => Model

Behaviour:
* The `mixin` use By [dva-model-extend](https://github.com/dvajs/dva-model-extend) thx~
* `model[subscriptions|effects|reducers]` use the domain as its prefix and use `$` as a separator.
* `model[state]` use the domain as its property name.

## License

MIT

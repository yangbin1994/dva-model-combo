'use strict';

import test from 'ava';
import modelCombo from '../lib'
import fs from 'fs'


test('If no domain is passed in, should return a base model', t => {
  const namespace = 'n'
  t.notThrows(() => {
    const base = modelCombo(namespace)
    t.is(base.namespace, namespace)
  })
})


test('If you pass in a domain object, the state of the generated model should have this property', t => {
  const
    domain = 'd',
    state = {
      name: 'yb'
    };
  t.notThrows(() => {
    const model = modelCombo('n', {
      domain,
      state,
    })
    t.is(model.state[domain], state)
  })
})

test('If you pass in a domain object, the effects attribute of the model should be prefixed', t => {
  const
    domain = 'd',
    effects = {
      * f() { }
    };
  t.notThrows(() => {
    const model = modelCombo('n', {
      domain,
      effects,
    })
    t.truthy(model.effects[`${domain}$f`])
  })
})

test('If you pass in a domain object, the reducers attribute of the model should be prefixed', t => {
  const
    domain = 'd',
    reducers = {
      f() { }
    };
  t.notThrows(() => {
    const model = modelCombo('n', {
      domain,
      reducers,
    })
    t.truthy(model.reducers[`${domain}$f`])
  })
})

test('If you pass in a domain object, the subscriptions attribute of the model should be prefixed', t => {
  const
    domain = 'd',
    subscriptions = {
      f() { }
    };
  t.notThrows(() => {
    const model = modelCombo('n', {
      domain,
      subscriptions,
    })
    t.truthy(model.subscriptions[`${domain}$f`])
  })
})

test('When the domain is repeated, an exception should be thrown', t => {
  const domain = 'd';
  t.throws(() => {
    const model = modelCombo('n', { domain, }, { domain, })
  })
})

test('When the domain ‘s type is not be string, an exception should be thrown ', t => {
  t.throws(() => {
    const model = modelCombo('n', {})
  })
})

test('When the domain ‘s type is not be string, an exception should be thrown ', t => {
  t.throws(() => {
    const model = modelCombo('n', {})
  })
})

test('When a class is mixed, the type should be an array or object or falsy', t => {
  t.notThrows(() => {
    modelCombo('n', {
      domain: 'd',
      mixin: {}
    })
    modelCombo('n', {
      domain: 'd',
      mixin: []
    })
    modelCombo('n', {
      domain: 'd',
    })
  })
})

test('When you mix a class, you should have the correct prefix', t => {
  const modelClass = {
    state: 'test',
    effects: {
      * f() { },
    },
    reducers: {
      f() { },
    },
    subscriptions: {
      f() { },
    },
  }
  const model = modelCombo('n', {
    domain: 'd',
    mixin: modelClass
  })
  t.is(model.state.d, 'test')
  t.truthy(model.effects.d$f)
  t.truthy(model.reducers.d$f)
  t.truthy(model.subscriptions.d$f)
})

test('When you mix a array class, you should have the correct prefix', t => {
  const modelClass = {
    state: 'test',
    effects: {
      * f() { },
    },
    reducers: {
      f() { },
    },
    subscriptions: {
      f() { },
    },
  }
  const modelClass2 = {
    state: 'test2',
    effects: {
      * f2() { },
    },
    reducers: {
      f2() { },
    },
    subscriptions: {
      f2() { },
    },
  }
  const model = modelCombo('n', {
    domain: 'd',
    mixin: [modelClass, modelClass2]
  })
  t.is(model.state.d, 'test2')
  t.truthy(model.effects.d$f2)
  t.truthy(model.reducers.d$f2)
  t.truthy(model.subscriptions.d$f2)
})

test('readme demo', t => {
  const tableClass = {
    reducers: {
      querySuccess(state, { payload: pagination }) {
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
  t.truthy(routeModel.reducers.body$querySuccess)
  t.truthy(routeModel.state.body)
  t.truthy(routeModel.state.header)
})
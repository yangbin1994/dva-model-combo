import modelExtend from 'dva-model-extend'

export default function modelCombo(namespace, ...domains) {
  const
    cacheDomains = [],
    base = {
      namespace,
      state: {},
      subscriptions: {},
      effects: {},
      reducers: {},
    }
  return domains.reduce((model, combo) => {
    let { domain, mixin, } = combo
    if (typeof domain !== 'string') {
      throw new Error(`domain:${domain} ‘s type should be string`)
    }
    if (cacheDomains.indexOf(domain) !== -1) {
      throw new Error(`domain:${domain} is repeatedly defined`)
    }
    if (mixin && !Array.isArray(mixin)) {
      mixin = [mixin]
    }
    cacheDomains.push(domain)

    if (mixin) {
      combo = modelExtend(...mixin, combo)
    }
    model.state[domain] = combo.state
    for (let key in combo.effects) {
      model.effects[`${domain}$${key}`] = combo.effects[key]
    }
    for (let key in combo.reducers) {
      model.reducers[`${domain}$${key}`] = combo.reducers[key]
    }
    for (let key in combo.subscriptions) {
      model.subscriptions[`${domain}$${key}`] = combo.subscriptions[key]
    }
    return model
  }, base)
}

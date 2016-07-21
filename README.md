# pagan
Front-end framework based on riot, redux.

---

##Geting Started

###Install

```
npm install pagan
```

### Usage

```javascript
//main.js
import router from '../framework/lean-router';

app.set('env', process.env.NODE_ENV === 'production' ? 'production' : 'development');

app.set('mode', 'browser');

app.set('context', { store: app.store, hub: router.hub, tags: {} });

app.mixin('form', form);

app.router(router);

app.start(async () => {
  //todo
})

```

```javascript
//component

require('path-to-nest');

<app>
  <div>Hello World</div>
  <nest></nest>
  
  connect(              //redux like
    state => ({}),
    dispatch => ({})
  )(this)
  
  this.mixin('router');
  
  this.$routeConfig([     // router define (nest router support)
    {name: 'nest', path: '/nest'}
  ])
  
  this.$use(function(next, ctx){
    //trigger when nav to this component
  })
</app>

```

##Example
source for more detail

##QQ
2811786667

# pagan

<img width="320" src="https://github.com/leekangtaqi/pagan/raw/master/client/assets/images/logo.jpg"/>

Fullstack framework based on riot, redux, express.

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

##Develop and Build

* **env development** (using webpack-dev-server in backend) : 

 gulp dev

 open browser and type: localhost:9182

* **env prodution** :

 gulp build     

##QQ
2811786667

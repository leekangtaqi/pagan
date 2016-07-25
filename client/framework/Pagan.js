import riot from 'riot'; 
import { configureStore } from '../configuration/store';
import riotRouterRedux from '../framework/riot-router-redux';
import router from '../framework/lean-router';

class Pagan {
	constructor(){
		this.framework = riot;
		this.buildInProps = ['env', 'entry', 'context', 'mode'];
		this._mode = 'hash';
		this._store = configureStore({}, this._mode);
		this.router(router);
		this._context = {
				store: this._store,
				hub: {},
				tags: {}
		};
		window.widgets = this._widgets = {};
	}

	set(prop, val){
		this[`_${prop}`] = val;
		switch(this.accseptSet(prop)){
			case 'mode':
				this._store = configureStore({}, this._mode);
				if(this._router){
					riotRouterRedux.syncHistoryWithStore(this._router.hub, this._store);
					this.mixin('router', this._router.router(this._mode)); 
				}
			case 'context':
				window.context = this._context;
				break;
		}
	}

	accseptSet(val){
		if(this.buildInProps.indexOf(val) >= 0){
			return val;
		}
		return null;
	}

	router(router){
		this._router = router;
		riotRouterRedux.syncHistoryWithStore(this._router.hub, this._store);
		this.mixin('router', router.router(this.mode));
		return this;
	}

	registerWidget({name, methods}){
		let component = riot.mount(name)[0];
		this._context.tags[name] = component;
		let upperName = name.replace(/(\w)/, v => v.toUpperCase());
		this._widgets[upperName] = {};
		methods.forEach( method => {
			this._widgets[upperName][method] = (...args) => {
				component[method].apply(component, args)
			}
		})
	}

	async start(bootstrap){
		await bootstrap();
		if(!this.entry){
			throw new Error(`application expected a entry component`);
		}
		this._router.hub.startup();
	}

	mixin(...args){
		return this.framework.mixin.apply(this.framework, args);
	}

	on(...args){
		return this.framework.on.apply(this.framework, args)
	}

	one(...args){
		return this.framework.one.apply(this.framework, args)
	}

	off(...args){
		return this.framework.off.apply(this.framework, args)
	}

	trigger(...args){
		return this.framework.trigger.apply(this.framework, args)
	}

	get hub(){
		return this._router.hub;
	}
	get context(){
		return this._context;
	}
	get store(){
		return this._store;
	}
	set store(val){
		this._store = val;
	}
	get mode(){
		return this._mode;
	}
	get entry(){
		return this._entry;
	}
	get env(){
		return this._env;
	}
}

const appCreator = () => new Pagan();

export default appCreator;
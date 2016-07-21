const moment = val => {
	return new Moment(val);
}

class Moment {
	constructor(val){
		if(val){
			this._d = new Date(val);
			return;
		}
		this._d = new Date();
	};

	get data(){
		return this._d;
	}

	set data(val){
		this._d = val;
	}

	isBefore(val){
		return this._d.getTime() < this.getDate(val)
	}

	fromNow(){
		return this._d.getTime() - this.getDate()
	}

	getDate(val){
		if(typeof val === 'string'){
			val = new Date(val).getTime();
		}else if(typeof val === 'object'){
			val = val.getTime();
		}else{
			val = new Date().getTime()
		}
		return val;
	}
}

export default moment;

const fxer = (fxer = {}, action) => {
	switch(action.type){
		case 'getFxInfo':
			return action.payload;
		default:
			return fxer;
	}
}

const myFxer = (myFxer = {}, action) => {
	switch(action.type){
		case 'getMyFxer':
			return action.payload;
		default:
			return myFxer;
	}
}

export default {
	fxer,
	myFxer
}
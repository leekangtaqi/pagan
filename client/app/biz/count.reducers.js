const count = (count = 1, action) => {
	switch(action.type){
		case 'increase':
			return count + 1;
		case 'decrease':
			return count - 1;
		default:
			return count;
	}
}
export default {
	count
}
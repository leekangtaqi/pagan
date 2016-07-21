const docGroup = (docGroup = {}, action) => {
	if(action.type === 'changeDocGroup'){
		return action.payload || "";
	}
	return docGroup;
}

export default {docGroup}
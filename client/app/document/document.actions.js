let base = '/document';

const changeDocGroup = ({type, meta}) => (dispatch) => {
	if(type === 'url'){
		return $.get(base + '/' + meta).then(data=>dispatch({type: 'changeDocGroup', payload: data}))
		.catch(e=>{
			console.warn(e);
		})
	}
	dispatch({type: 'changeDocGroup', payload: meta})
}

export default {changeDocGroup}
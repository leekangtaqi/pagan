const getFxInfo = fxer => dispatch => {
	$.get(`/fx/info?id=${fxer}`).then(fxer=>dispatch({type: 'getFxInfo', payload: fxer}));
}

const getMyFxer = () => dispatch => {
	$.get(`/fx/my`).then(fxer => dispatch({type: 'getMyFxer', payload: fxer}));
}

export default {
	getFxInfo,
	getMyFxer
}
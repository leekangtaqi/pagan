const increase = () => dispatch => dispatch({type: 'increase'})
const decrease = () => ({type: 'decrease'})

export default {
	increase,
	decrease
}
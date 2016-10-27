<count>
	<div>{ opts.other }</div>
	<p>Current Count is {opts.count}</p>
	<input class="btn btn-default" type="button" value="+" onclick="{increase}">
	<input class="btn btn-default" type="button" value="-" onclick="{decrease}">
	<script>
		var connect = require('riotjs-redux').connect;
		var actions = require('./count.actions.js').default;
		
		this.test = 1;
		console.warn('count is execed')

		connect(
			state => ({
				count: state.count,
				other: state.count+1
			}),
			dispatch => ({
				increase: () => dispatch(actions.increase()),
				decrease: () => dispatch(actions.decrease())
			})
		)(this)

		this.on('mount', function(){
			console.warn('count mounted...')
		})

		console.warn(fetch);

		this.opts.increase();
		
		this.increase = e => {
			console.warn('111')
			this.opts.increase()
		};
		this.decrease = e => this.opts.decrease();
	</script>
	
</count>
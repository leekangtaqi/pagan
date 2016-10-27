<rlink>
	<button
		type="button"
		class="{clazzes}"	
		onclick="{go}"
		disabled="{disabled}"
	>
		<yield/>	
	</button>
	<script>
		import {connect} from 'riot-redux';

		connect(
			state=>({curr: state.route.$state})
		)(this)

		this.clazzes = '';

		this.go = () => {
			let hub = context.hub;
			if(hub.busy || !opts.to){
				return;
			}
			hub.go(opts.to);
		}

		this.on('update', () => {
			let clazzes = {};
			let util = context.hub.util;
			if(opts.class){
				opts.class.split(' ').reduce((acc, curr) => {
					acc[curr] = 'true'
					return acc;
				}, clazzes)
			}
			if(opts.active
				&& opts.curr
				&& opts.to
				&& util.toPattern(opts.curr) === util.toPattern(opts.to)){
				clazzes[opts.active] = 'true'
			}
			this.clazzes = Object.keys(clazzes).map(k => `${k}`).join(' ')
		})
	</script>
</rlink>
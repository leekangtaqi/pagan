<alert>
	<div class="alert-container" if="{_alerts.length}">
		<div class="alert">
			<ul class="alert-list">
				<li each="{_alerts}">
					<b class="{icon: true, success: state === 'success', warn: state === 'warn', error: state === 'error'}"></b>
					<span>{msg}</span>
				</li>
			</ul>
		</div>
	</div>

	<style scoped>
		.alert-container{
			position: fixed;
			width: 100%;
			top: 0px;
			left: 0px;
			bottom: 0px;
			right: 0px;
			margin: auto;
		}
		.alert{
			margin: 0px auto;
		}
		.alert-list {
			margin: 0px auto;
			padding: 0px;
			list-style-type: none;
		}
		.alert-list >li{
			width: 200px;
			border: 1px solid #ccc;
			height: 40px;
			border-radius: 5px;
			line-height: 40px;
			padding: 0px 10px;
			margin: 10px auto;
		}
		.icon{
			width: 8px;
			height: 8px;
			border: none;
			border-radius: 50em;
			display: inline-block;
		}
		.success{
			background: green;
		}
		.warn{
			background: yellow;
		}
		.error{
			background: red;
		}
	</style>
	<script>
		this._alerts = [];
		this._busy = false;
		this._during = 3000;
		this.add = (state, msg) => {
			this._alerts.push({state, msg})
			if(!this._busy){
				this._busy = true;
				this.routine();
			}
		};
		this.routine = () => {
			this.update();
			if(!this._alerts.length){
				return this._busy = false;
			}
			setTimeout(()=>{
				this._alerts.splice(0, 1);
				this.routine();
				this.update();
			}, this._during)
		}
	</script>
</alert>
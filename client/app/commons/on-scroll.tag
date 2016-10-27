<on-scroll>
	<yield/>
	<script>
		this.parent.on('enter', ()=>{
			this.opts.infiniteScroll();
			window.addEventListener('scroll', this.onScrollHandler);
			window.addEventListener('resize', this.onScrollHandler);
		})

		this.parent.on('leave', ()=>{
			window.removeEventListener('scroll', this.onScrollHandler);
			window.removeEventListener('resize', this.onScrollHandler);
		})

		this.onScrollHandler = e => $.util.throttle(this.doCheck, 100);

		this.isBottom = () => {
			return (window.innerHeight + window.scrollY) + (this.opts.infiniteScrollDistance || 0) >= document.body.offsetHeight
		};
		
		this.doCheck = () => {
			if(this.isBottom() && !(!!this.opts.infiniteScrollDisabled)){
				this.opts.infiniteScroll();
			}
		}
		// this.on('mount', () => {
		// this.opts.infiniteScroll();
		// 	window.addEventListener('scroll', this.onScrollHandler);
		// 	window.addEventListener('resize', this.onScrollHandler);
		// })
		// this.on('unmount', () => {
		// 	window.removeEventListener('scroll', this.onScrollHandler);
		// 	window.removeEventListener('resize', this.onScrollHandler);
		// })
	</script>
</on-scroll>
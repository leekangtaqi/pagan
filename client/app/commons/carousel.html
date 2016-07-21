<carousel>
    <div class="carousel-container">
        <ul class="carousel-ul carousel-transition" style="width: {(opts.itemForLoop.length || 0)*100}%;">
            <li style="width: {100/parent.opts.itemForLoop.length}%" uid="id-{id}" each="{opts.itemForLoop}">
                <!--<div style="height: {parent.opts.height}px; background-image: url(http://img1.ifindu.cn/crop/w_860/h_600{cover})"  class="bgimage"></div>-->
                <div style="height: {parent.opts.height}px; background-image: url({cover})"  class="bgimage"></div>
            </li>
        </ul>
        <div class="carousel-nav-container">
            <ul class="carousel-nav" style="width: {this.opts.itemForLoop.length*8 + (this.opts.itemForLoop.length -1)*16}">
                <li each="{item, index in this.opts.itemForLoop}">
                    <b uid="id-{item.id}"></b>
                </li>
            </ul>
        </div>
    </div>
    <script>
        this.timer = null;
        this.busy = false;
        this.during = 5000;
        this.mocks = [
            {
                id: '001',
                cover: 'http://img3.3lian.com/2013/s2/65/d/38.jpg'
            },
            {
                id: '002',
                cover: 'http://att.bbs.duowan.com/forum/201404/29/125702wooquf8o7hw67hmi.jpg'
            },
            {
                id: '003',
                cover: 'http://tupian.enterdesk.com/2015/gha/09/1101/22.jpg'
            }
        ]
        this.on('mount', () => {
            this.opts.itemForLoop = this.mocks;
        })
        this.on('unmount', () => this.cancel())
        this.parent.on('enter', () => {})
        this.parent.on('leave', () => this.cancel())
        this.init = () => {
            this.opts.itemForLoop = this.mocks;
            this.currItem = this.opts.itemForLoop[0];
            if(this.opts.itemForLoop.length > 1){
                setTimeout(()=>{
                    this.root.addEventListener('touchstart', onTouchStart);
                    this.root.addEventListener('touchmove', onTouchMove);
                    this.root.addEventListener('touchend', onTouchEnd);
                }, 50)   
                this.routine();
            }
        }
        this.on('update', () => this.init());
        this.startPosX = null;
        this.moveDistance = null;
        this.inTouching = false;
        this.getListNode = () => this.root.querySelector('.carousel-ul');
        const onTouchStart = e => {
            if(this.busy){
                return;
            }
            this.clear();
            this.busy = true;
            this.inTouching = true;
            this.startPosX = e.touches[0].clientX;
            $(this.getListNode()).removeClass('carousel-transition');
        }
        const onTouchMove = e => {
            if(!this.inTouching){
                return;
            }
            let currentX = e.touches[0].clientX;
            let container = this.root.querySelector('.carousel-container');
            this.moveDistance = currentX - this.startPosX;
            let modifiedMarginLeft = (this.moveDistance / container.clientWidth) * 100;
            let index = this.opts.itemForLoop.indexOf(this.currItem);
            let startMarginLeft = `-${index * 100}`;
            this.getListNode().style.marginLeft = parseFloat(startMarginLeft, 10) + modifiedMarginLeft + '%';
        }
        const onTouchEnd = e => {
            if(!this.inTouching){
                return;
            }
            let ul = this.getListNode();
            let distance = parseFloat(this.moveDistance, 10).toFixed(2);
            let justGap = 30;
            $(this.getListNode()).addClass('carousel-transition');
            if(!distance || Math.abs(distance) <= justGap){
                this.flyback();
            }
            else if(Math.abs(distance) > justGap){
                distance > 0 && this.prevItem();
                distance < 0 && this.nextItem();
            }
            this.busy = false;
            this.inTouching = false;
            this.moveDistance = null;
            this.startPosX = null;
            this.routine();
        }
        this.routine = () => {
            if(!this.timer){
                this.timer = setInterval(()=>{
                    if(!this.busy){
                        this.nextItem();
                    }
                }, this.during);
            }
        }
        this.flyback = () => {
            this.resetStyle(this.opts.itemForLoop.indexOf(this.currItem), 0);
            setTimeout(()=>{
                this.busy = false;
            }, 500);
        }
        this.prevItem = () => {
            this.busy = true;
            let meta = this.getPrevNode(this.currItem);
            if(meta){
                this.currItem = meta.node;
                this.resetStyle(meta.index);
                setTimeout(()=>{
                    this.busy = false;
                }, 500);
            }else{
                this.cancel();
            }
        }
        this.nextItem = () => {
            this.busy = true;
            let meta = this.getNextNode(this.currItem);
            if(meta){
                this.currItem = meta.node;
                this.resetStyle(meta.index);
                setTimeout(()=>{
                    this.busy = false;
                }, 500);
            }else{
                this.cancel();
            }
        }
        this.resetStyle = index => {
            let ul = this.root.querySelector('.carousel-ul');
            let u = 100;
            ul.style.marginLeft = `-${index*u}%`;
            [].slice.call(this.root.querySelectorAll('.carousel-nav>li>b')).forEach(item=>{
                $(item).removeClass('carousel-nav-active').addClass('carousel-nav-default');
            })
            $(this.root.querySelector('.carousel-nav>li>b[uid="id-'+ this.currItem.id +'"]')).removeClass('carousel-nav-default').addClass('carousel-nav-active');
        }
        this.clear = () => {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.cancel = () => {
            this.busy = false;
            this.clear();
            this.root.removeEventListener('touchstart', onTouchStart);
            this.root.removeEventListener('touchmove', onTouchMove);
            this.root.removeEventListener('touchend', onTouchEnd);
        }
        this.getPrevNode = node => {
            let set = this.opts.itemForLoop;
            let index = set.indexOf(node);
            if(index === 0){
                return {node: set[set.length-1], index: set.length -1};
            }else{
                return {node: set[index -1], index: index -1};
            }
        }
        this.getNextNode = node => {
            let set = this.opts.itemForLoop;
            let index = set.indexOf(node);
            if(index === (set.length - 1)){
                return {node: set[0], index: 0};
            }else{
                return {node: set[index + 1], index: index + 1};
            }
        }

    </script>
    <style>
        .carousel-container b{
            width: 16px;
            height: 16px;
            display: block;
            border-radius: 50em;
        }
        .carousel-nav-container{
            width: 100%;
            top: 50px;
        }
        .carousel-nav{
            margin: 0px auto;
            padding: 0px;
            list-style-type: none;
            overflow: hidden;
            position: relative;
            top: -20px;
        }
        .carousel-nav li{
            width: 8px;
            height: 8px;
            float: left;
            margin-right: 16px;
        }
        .carousel-nav li b{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50em;
        }
        .carousel-nav li:last-child{
            margin-right: 0px;
        }
        .carousel-nav-default{
            background: white;
        }
        .carousel-nav-active{
            background: black;
        }
        .carousel-container{
            width: 100%;
            overflow: hidden;
        }
        .carousel-transition{
            transition: all .5s;
            -moz-transition: all .5s;
            -webkit-transition: all .5s;
            -o-transition: all .5s;
        }
        .carousel-ul{
            margin: 0px;
            padding: 0px;
            list-style-type: none;
        }
        .carousel-ul li{
            float: left;
        }
        .carousel-ul li div{
            background-size: 100%;
        }
    </style>
</carousel>

<img-lazy-loader>
    <img class="fade-in" style="height: {opts.height}px; width: {opts.width}px" riot-src="{holder}" alt="{opts.alt}"/>
    <style scoped>
        .fade-in{
            opacity: 1;
            transition: opacity .5s;
            -moz-transition: opacity .5s;
            -webkit-transition: opacity .5s;
            -o-transition: opacity .5s;
        }
        .fade-out{
            opacity: 0;
            transition: opacity .5s;
            -moz-transition: opacity .5s;
            -webkit-transition: opacity .5s;
            -o-transition: opacity .5s;
        }
    </style>
    <script>
        this.holder = null;
        this.hasImage = () => {
            return !!(this.opts.riotSrc && !/undefined/ig.test(this.opts.riotSrc));
        }
        this.pretreatment = () => {
            if(/svg:/.test(this.opts.holder)){
                let svg = this.buildSvg();
                this.holder = svg;
            }else{
                this.holder = this.opts.holder;
            }
        }
        this.extractOpts = url => {
            let meta = parseUrl(url);
            return {
                theme: meta && meta.query && meta.query.theme || null,
                text : meta && meta.query && meta.query.text || null,
            }
            function parseUrl(url){
                let parts = url.split('?')
                let host = parts[0]
                let query = parts[1]
                if(query){
                    query = query.split('&').reduce((acc, curr)=>{
                        let kv = curr.split('=');
                        acc[kv[0]] = kv[1];
                        return acc;
                    }, {})
                }
                return {
                    query
                }
            }
        }
        var themeMap = {
            gray: {
                color: '#AAAAAA',
                bgColor: 'rgb(238, 238, 238)'
            }
        }
        this.getStringLength = str => {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext("2d");
            ctx.font = "18pt Arial bold";
            return ctx.measureText(str).width;
        }
        this.buildSvg = () => {
            let {theme, text, maxWidth} = this.extractOpts(this.opts.holder);
            let sid = genId(9);
            let posx = (this.opts.width - this.getStringLength(text))/2;
            let posy = this.opts.height/2;

            let svgTpl = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.opts.width}" height="${this.opts.height}" viewBox="0 0 ${this.opts.width} ${this.opts.height}" preserveAspectRatio="none">
                <defs>
                    <style type="text/css"><![CDATA[
                        #holder_${sid} text {
                            fill: ${themeMap[theme].color};
                            font-weight: bold;
                            font-family:Arial, Helvetica, Open Sans, sans-serif, monospace;
                            font-size:18pt
                        }
                    ]]></style>
                </defs>
                <g id="holder_${sid}">
                    <rect width="${this.opts.width}" height="${this.opts.height}" fill="${themeMap[theme].bgColor}"/>
                    <g>
                        <text
                            fill="${themeMap[theme].color}"
                            style="
                                font-size: 18pt;
                                font-family:Arial, Helvetica, Open Sans, sans-serif, monospace;
                                font-weight: bold;"
                            x="${posx}"
                            y="${posy}">${text}</text>
                    </g>
                </g>
            </svg>`;
            return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgTpl);
            function genId(n){
                var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                var res = "";
                for(var i = 0; i < n ; i ++) {
                    var id = Math.ceil(Math.random()*35);
                    res += chars[id];
                }
                return res;
            }
        }
        this.buildImage = () => {
            var image = document.createElement('img');
            image.src = this.opts.riotSrc;
            image.style.opacity = 0;
            image.style.height = this.opts.height + 'px';
            image.style.width = this.opts.width + 'px';
            image.style.WebkitTransition = 'opacity .5s';
            image.style.MozTransition = 'opacity .5s';
            image.style.display = 'none';
            image.onload = () => {
                setTimeout(()=>{
                    $(this.root.childNodes[0]).removeClass('fade-in').addClass('fade-out');
            }, 50)
                setTimeout(()=>{
                    this.root.appendChild(image);
                image.style.display = 'inline';
                setTimeout(()=>{
                    image.style.opacity = 1;
            }, 50)
                this.root.removeChild(this.root.childNodes[0]);
                // this.update();
            }, 500)
            }
        }
        this.on('mount', () => {
            this.pretreatment();
            this.update();
            if(!this.hasImage()) {
                return;
            }
            this.buildImage();
        })
    </script>
</img-lazy-loader>
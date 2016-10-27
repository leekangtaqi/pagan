require('./biz/count.tag');
require('./biz/test.tag');

<app>

  <count></count>
  <test></test>

  <script>
    this.curr = 1
    this.mixin('router');
    this.$routeConfig([
      {
        path: '/',
        name: 'count',
        defaultRoute: true
      },
      {
        path: '/test',
        name: 'test'
      }
    ])
    setTimeout(function(){
      this.trigger('ready');
    }.bind(this), 100);
    
  </script>
</app>
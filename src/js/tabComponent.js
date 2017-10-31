// var $ = require('../lib/jquery.min');
import $ from '../lib/jquery.min';

module.exports = (function(){
      var Tab = function(ct){
        this.ct = ct;
        this.init();
        this.bind();
      }

      Tab.prototype.init = function(){
        this.menuList = this.ct.querySelectorAll('.globalTabs ul>li');
        this.contentList = this.ct.querySelectorAll('.tabContent>li');     
      }
      Tab.prototype.bind = function(){
          var self = this;

          // this.menuList.forEach(function(menu,i){
          //   menu.onclick = function(e){
          //     $(window).scrollTop(0);//每次切换tab都让滚动条滚到顶端
          //     var target = e.target;
          //     var index = [].indexOf.call(self.menuList,target);
          //     self.menuList.forEach(function(menu,i){
          //       menu.classList.remove('active');
          //       self.contentList[i].classList.remove('active');
          //     })
          //     this.classList.add('active');
          //     self.contentList[index].classList.add('active');
          //   }
          // });
          $('.globalTabs ul>li').each(function(i,menu){
            $(this).on('click',function(){
                $(window).scrollTop(0);//每次切换tab都让滚动条滚到顶端
                var index = $(this).index();
                $('.globalTabs ul>li').each(function(i,menu){
                  $(this).removeClass('active');
                  $('.tabContent>li').eq(i).removeClass('active');
                });

              $(this).addClass('active');

              $('.tabContent>li').eq(index).addClass('active');
            });
          });          
      }  

      return Tab;
})();









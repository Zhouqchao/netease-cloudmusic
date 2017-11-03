# 仿移动端网易云音乐
---

### JavaScript + jQuery + LeanCloud仿移动端网易云音乐

## 在线预览：
[Netease-CloudMusic](http://zhouqichao.com/netease-cloudmusic/dist/index.html)

**Notice:** _请使用**手机浏览器** 或 **电脑开启device mode**浏览_

## 页面构成

### 1. 首页
+ 推荐音乐
+ 热歌榜
+ 歌曲搜索

### 2. 歌单详情页
+ 歌单简介
+ 歌单歌曲列表

### 3. 歌曲播放页
+ 歌曲唱片动画
+ 歌词滚动高亮

## 实现功能：

### 1. 首页
---
##### 1. 导航栏Tab切换


使用纯JavaScript实现[Tab组件](https://github.com/Zhouqchao/netease-cloudmusic/blob/master/src/js/tabComponent.js)，完成导航栏Tab切换功能。



##### 2. localStorage存储搜索历史记录

使用jQuery实现[localStorage组件](https://github.com/Zhouqchao/netease-cloudmusic/blob/master/src/js/getLocalStorage.js)，完成搜索历史记录功能。

其中，点击历史记录的remove按钮删除记录功能，使用了**jQuery中的事件代理**。

##### 3. 获取LeanCloud歌曲信息

根据LeanCloud中的[数据存储开发指南·JavaScript](https://leancloud.cn/docs/leanstorage_guide-js.html)实现异步获取LeanCloud歌曲数据。

##### 3. svg+阿里iconfont实现各种icon小图标
使用网易云音乐的svg和阿里的iconfont实现各种小图标。
##### 4. 随机生成热门搜索歌曲列表

使用`Math.random()`配合从LeanCloud获取的歌曲随机生成热门搜索歌曲列表。

### 2. 歌单详情页
---
##### 1. 生成模糊的背景图
使用z-index:-1配合filter:blur()实现模糊的背景图(不影响文字)。

##### 2. 实现歌单简介的展开与收缩
使用jQuery中的`toggleClass()`和`trigger()`方法配合css实现歌单简介的展开与收缩。

### 3. 歌曲播放页
---
##### 1. 实现唱片播放/暂停动画
使用CSS3的animation属性配合@keyframes规则实现唱片播放/暂停动画。
##### 2. 实现指针的移动
使用jQuery配合CSS3的`transform`实现指针的移动。

##### 3. 实现歌词的实时滚动和高亮
使用jQuery配合CSS3的`transform:translateY()`实现歌词的滚动
和高亮。


## 注意点
### 1. 首页
1. **首页的logo部分添加了h1标题**，内容为“网易云音乐”,设置其样式为`text-indent:-9999px`，**有利于SEO**。

2. **首页的nav导航栏**，每次切换都会让滚动条滚动到页面顶部。
```
JavaScript:
document.body.scrollTop = document.documentElement.scrollTop = 0;
jQuery:
$(window).scrollTop(0);
```

3. **首页的推荐歌单列表**，最好提前在歌单 **图片外包裹一层元素** (eg:&lt;div&gt;),并设置其宽高。否则，当页面初次展示时，异步获取的图片加载完毕后会导致推荐歌单部分的**reflow**。

4. **多行文字的ellipsis效果**实现：
```
	element {
		display: -webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient: vertical; 
		overflow:hidden;
	}
```
**Notice:** element内最多只能包含一层子元素，且必须是行内元素(eg:&lt;span&gt;),否则无法实现多行文本ellipsis效果。

5. **首页的热歌榜，热歌排序**使用了CSS3中的伪类`:nth-child()`，实现了对前三首歌曲的样式设置。
6. **首页的热歌榜，banner部分**添加了一层class="grayscale"元素，并设置其样式为`-webkit-filter: grayscale(100%);` 这样，在真正的背景图片加载完毕之前，会提前显示class="grayscale"元素中灰色的图片。
7. **首页的歌曲搜索部分**，实现了四种方式实现歌曲搜索：
	+ 点击热门搜索歌曲列表
	+ 点击搜索记录列表
	+ input输入时，点击搜索提示列表
	+ input输入后，点击enter键(手机里的 完成/搜索 键)

### 2. 歌单详情页

1. **歌单详情页header部分的背景图实现**，可以用伪元素`::before`配合`z-index:1`和`filter:blur()`实现，也可以用一个元素代替伪元素`::before`配合`z-index:1`和`filter:blur()`实现。但是前者无法使用JavaScript或jQuery操作，因为这里是通过XHR从LeanCloud中动态获取的,所以我最终选择了第二种方法。
2. **歌单详情页header部分的歌单简介，多行文本ellipsis效果实现**：
```
	element{
    	display: -webkit-box;
    	-webkit-box-orient: vertical;
    	-webkit-line-clamp: 3;
    	overflow: hidden;
	}
```
**Notice:** element内最多只能包含一层子元素，且必须是行内元素(eg:&lt;span&gt;),否则无法实现多行文本ellipsis效果。

### 3. 歌曲播放页

1. **歌曲播放页disc唱片部分的播放/暂停动画**，主要使用了CSS3的`animation`实现，特别是`animation-play-state`的使用。不过，**这里有一个小bug**,即**在ios上的webkit内核浏览器中(例如：safari,chrome)，`-webkit-animation-play-state:paused`不起作用**，也就是说，动画会一直进行下去，即使按了暂停按钮。当然，可以用jQuery的addClass/removeClass方法配合CSS3的`.no-animation{-webkit-animation:none!important;}`样式解决这个bug,但是这又会产生新的问题，即点击暂停，动画此时可以暂停；但是当再次点击播放时，动画就会重新开始，而不是接着之前的状态继续。所以这两种方法都不太完美。这里我选用了第一种方法。
2. **歌曲播放页disc指针部分的播放/暂停动画**，主要使用了CSS3的`transform`实现，特别是`transform：rotate()`的使用。但是transform属性默认是以`transform-origin:50% 50%`为固定点进行旋转。而这里**需要以disc指针的顶部为固定点进行旋转**，所以应设置其样式为`transform-origin:left top;`。

## 移动端调试
这里，我参考了github上的一个repo：[各种真机远程调试方法汇总](https://github.com/jieyou/remote_inspect_web_on_real_device)。
主要分为android和ios两种调试。

### 1. android调试
android手机uc浏览器可以使用[uc开发者版浏览器](http://plus.uc.cn/document/webapp/doc5.html)进行调试，其他手机浏览器可以配合PC端chrome浏览器的`chrome://inspect`进行调试。
### 2. ios调试
ios手机safari浏览器可以使用safari浏览器配合Mac系统safari浏览器进行调试。

当然，也可以使用weinre等工具进行调试。

### 调试发现的问题
比如，在歌单详情页，我试图用stackoverflow上的一个方法快速获取URL中的querystring,代码如下：
```
var searchParams = new URLSearchParams(window.location.search);
var id = searchParams.get('id');	
```
经过测试，在PC端几个浏览器中都没问题，但是在移动端调试时，却发生了问题，并且没有报错。。。后来我是通过“二分法定位”，一点点的注释，最终才发现了这个问题。

## 性能优化

### HTML
1. **尽量避免了使用多层标签嵌套**，同时选择`::before`和`::after`**伪元素减少html标签的使用**。
2. 用link标签引入外部css样式表，放入&lt;head&gt;标签内的最底部，用script标签引入外部JavaScript脚本放入&lt;body&gt;标签内的最底部。

### CSS
1. **选择器层级嵌套匹配尽量不要超过4层**。
2. **需要经常复用的样式尽量写在一个className上**，然后在html中相应的元素上添加className。
3. **尽量使用简写/复合样式**，比如，`background,animation`等简写属性。

### JavaScript
1. 使用了立即执行函数（IIFE）把代码封闭。
2. 主要代码使用了构造函数和原型对象进行了封装。
3. 将固定不变的节点保存到变量，减少重复调用。

### Gulp

1. 对图片压缩(使用了[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin))。
2. 给CSS自动补全前缀并压缩（使用了[gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer),[gulp-cssnano]()）。
3. 对HTML压缩(使用了[gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin))。

### Webpack

1. 使用了`UglifyJsPlugin()`方法对JavaScript文件压缩。

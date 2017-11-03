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


## 注意点和优化
1. **首页的logo部分添加了h1标题**，内容为“网易云音乐”,设置其样式为`text-indent:-9999px`，**有利于SEO**。

2. **首页的推荐歌单列表**，最好提前在歌单 **图片外包裹一层元素** (eg:&lt;div&gt;),并设置其宽高。否则，当页面初次展示时，异步获取的图片加载完毕后会导致推荐歌单部分的**reflow**。

3. **多行文字的ellipsis效果**实现：
```
	element {
		display: -webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient: vertical; /* 定义文字显示行数，多余	隐藏*/
		overflow:hidden;
	}
```
注意点：element中只能为文本节点，不能有子元素，否则无法实现ellipsis效果。

4. **首页的热歌榜，热歌排序**使用了CSS3中的伪类`:nth-child()`，实现了对前三首歌曲的样式设置。
5. **首页的热歌榜，banner部分**添加了一层class="grayscale"元素，并设置其样式为`-webkit-filter: grayscale(100%);` 这样，在真正的背景图片加载完毕之前，会提前显示class="grayscale"元素中灰色的图片。
6. **首页的歌曲搜索部分**
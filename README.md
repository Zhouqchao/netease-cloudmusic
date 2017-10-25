
# 实现input输入框input事件
1. input不为空时，隐藏历史记录.historyRecord列表

# 实现历史记录功能
## keypoint: 保存和删除

1. 使用getLocalStorage.js组件保存用户输入的内容至localStorage。
2. 点击.historyRecord列表中的li，让input输入框自动填入刚才点击的li的值。
同时，让.clear显示，让.historyRecord列表隐藏。
3. 根据input输入框中的内容，向LeanCloud发起请求，获取数据。
如果有对应的数据，则展示在.searchFinalResult列表中，如果没有，显示 暂无搜索结果。
4. 如果有.searchFinalResult列表，则正常进行。否则，用户会选择删除input输入框中的内容。(用户可以点击.remove按钮删除，或者手动删除)
5. 当用户删完全部内容，应显示热门搜索列表和历史记录列表



##相关：
input不为空，隐藏历史记录.historyRecord列表



# 实现清空输入框内容功能

1. input为空时，.clear隐藏，否则显示。
2. 点击.clear，清空input内容，隐藏搜索提示.searchHint 和搜索提示结果列表.searchHintList;

# 点击热门搜索
1.点击热门搜索.hotSearch列表里的li,隐藏热门搜索.hotSearch列表。
同时，让input输入框自动填入刚才点击的li的值。同时，让.clear显示，让.historyRecord列表隐藏。
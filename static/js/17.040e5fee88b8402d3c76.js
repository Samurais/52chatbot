webpackJsonp([17,48],{322:function(n,e){n.exports={rawContent:"\n## 数据结构\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/2843224-42072841a53d82a6.png)\n\n```\nclass Node():\n\tstatic = 0\n\tdef __init__(self):\n\t\tself.fail = None\n\t\tself.next = [None]*KIND\n\t\tself.end = False\n\t\tself.word = None\n\t\tNode.static += 1\n```\n\n## 分词原理\n(1) 从根结点开始一次搜索，比如搜索【北京】；\n(2) 取得要查找关键词的第一个字符【北】，并根据该字符选择对应的子树并转到该子树继续进行检索；\n(3) 在相应的子树上，取得要查找关键词的第二个字符【京】,并进一步选择对应的子树进行检索。\n(4) 迭代过程……\n(5) 在直到判断树节点的isEnd节点为true则查找结束（最小匹配原则），然后发现【京】isEnd=true，则结束查找。\n\n> 如果是最大匹配原则，遇到isEnd前也会看其他叶子中，是否可以匹配。\n\n## 方法\n* insert\n添加节点\n\n* find\n查找字符串\n\n* delete\n删除节点\n\n[python版本](https://gist.github.com/Samurais/42c0f54f8786dc8daebf69bb0dfdff0f)\n\n## 扩展\n还可以使用TrieTree存储更多信息，比如每个key绑定一个value，根据key进行查询，返回value。\n\n## 参考\n[Trie Tree 实现中文分词器](http://www.jianshu.com/p/1d9e7b8663c1)\n[基于Trie Tree构建的ForestDB](https://github.com/couchbase/forestdb)",metaData:{layout:"post",title:"Trie Tree",excerpt:"Trie Tree广泛的使用与分词和检索算法中。给出数据定义和工作原理，python的实现。",category:"development",tags:["nlp"],disqus:!0}}}});
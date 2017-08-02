---
layout: post
title: "Word2Vec(一) - 余弦相似性数学原理"
excerpt: "判断两个文章或者句子相似程度的一个算法。根据向量坐标，绘制在空间中，求得夹角的Cos值。Cos值越接近1，则说明夹角越小，即两向量相似。"
category: development
tags: [nlp]
disqus: true
---

[余弦相似性](https://zh.wikipedia.org/wiki/%E4%BD%99%E5%BC%A6%E7%9B%B8%E4%BC%BC%E6%80%A7): 通过计算两个向量的夹角余弦值来评估他们的相似度。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/bg2013032002.png)

余弦值越接近1，就表明夹角越接近0度，也就是两个向量越相似。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/bg2013032007.png)

## 给定两个句子
A： 我喜欢足球，也喜欢篮球。

B： 我喜欢足球，不喜欢篮球。


## 对句子进行分词，并统计词频
分词
A：我/ 喜欢/ 足球/ ,/ 也/ 喜欢/ 篮球 /。

B：我/ 喜欢/ 足球/ ,/ 不/ 喜欢/ 篮球/ 。

出现的所有的词语：
我/ 喜欢/ 足球 / 篮球/ 也/ 不

词频
A：我：1，喜欢：2，足球：1，篮球：1，也：1，不：0

B：我：1，喜欢：2，足球：1，篮球：1，也：1，不：1

词频向量
A：[1, 2, 1, 1, 0]

B：[1, 2, 1, 1, 1]

## 计算相似性

### 过程

(1）使用TF-IDF算法，找出两篇文章的关键词；

(2）每篇文章各取出若干个关键词（比如20个），合并成一个集合，计算每篇文章对于这个集合中的词的词频（为了避免文章长度的差异，可以使用相对词频）；

(3）生成两篇文章各自的词频向量；

(4）计算两个向量的余弦相似度，值越大就表示越相似。

![](https://camo.githubusercontent.com/26e22b617dc49ec67e4dea25f76b5c2138489917/687474703a2f2f692e696d6775722e636f6d2f7a717437556c732e706e67)

```python
# -*- coding: utf8 -*-
import math
import jieba.analyse
article_a = '我喜欢中国，也喜欢美国。'
article_b = '我喜欢足球，不喜欢篮球。'


def cut_word(article):
    # 这里使用了TF-IDF算法，所以分词结果会有些不同->https://github.com/fxsjy/jieba#3-关键词提取
    res = jieba.analyse.extract_tags(
        sentence=article, topK=20, withWeight=True)
    return res


def tf_idf(res1=None, res2=None):
    # 向量，可以使用list表示
    vector_1 = []
    vector_2 = []
    # 词频，可以使用dict表示
    tf_1 = {i[0]: i[1] for i in res1}
    tf_2 = {i[0]: i[1] for i in res2}
    res = set(list(tf_1.keys()) + list(tf_2.keys()))

    # 填充词频向量
    for word in res:
        if word in tf_1:
            vector_1.append(tf_1[word])
        else:
            vector_1.append(0)
            if word in tf_2:
                vector_2.append(tf_2[word])
            else:
                vector_2.append(0)

    return vector_1, vector_2


def numerator(vector1, vector2):
    #分子
    return sum(a * b for a, b in zip(vector1, vector2))


def denominator(vector):
    #分母
    return math.sqrt(sum(a * b for a,b in zip(vector, vector)))


def run(vector1, vector2):
    return numerator(vector1,vector2) / (denominator(vector1) * denominator(vector2))


vectors =  tf_idf(res1=cut_word(article=article_a), res2=cut_word(article=article_b))
# 相似度
similarity = run(vector1=vectors[0], vector2=vectors[1])
# 使用arccos计算弧度
rad = math.acos(similarity)
print(similarity, rad)

# 0.2157074518785444 1.353380046633586
```

## 参考
[两种重复文章识别算法——TF-IDF算法和余弦相似性](https://github.com/jamcplusplus/jamcplusplus.github.io/issues/7)

[基于 TF-IDF 算法的关键词抽取](https://github.com/fxsjy/jieba#基于-tf-idf-算法的关键词抽取)


[TF-IDF与余弦相似性的应用（二）：找出相似文章](http://www.ruanyifeng.com/blog/2013/03/cosine_similarity.html)

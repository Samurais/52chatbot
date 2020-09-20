---
layout: post
title: "朴素贝叶斯分类器"
excerpt: "在概率论中，贝叶斯公式是著名的定理。在机器学习里，有着广泛应用，尤其是语言类问题。本篇以简单和朴实的语言介绍这个定理及其应用。"
category: research
tags: [probability]
disqus: true
---

> 本文是翻译，原文地址：https://monkeylearn.com/blog/practical-explanation-naive-bayes-classifier

贝叶斯定理简单、通用和常见。在机器学习领域，它快速、准确和可靠。尤其是处理自然语言处理问题。贝叶斯分类器就是其中之一。使用训练语料，建立特征模型，然后输入测试，贝叶斯分类器给出概率最高的结果。

我们采用的算法是多项式朴素贝叶斯。通过本文，你不仅可以知道贝叶斯分类器是如何工作的，而且还会理解它为什么有效。最后，添加上一些方法，能够使贝叶斯分类器可以和复杂的机器学习算法相比，比如支持向量机和神经网络。

# 一个简单的例子

我们举下面一个简单的例子，假设我们实现一个分类器，用来判断一句话是不是属于"Sports"。在训练集上，有 5 条数据：

| 文本                           | 类别       |
| ------------------------------ | ---------- |
| “A great game”                 | Sports     |
| “The election was over”        | Not sports |
| “Very clean match”             | Sports     |
| “A clean but forgettable game” | Sports     |
| “It was a close election”      | Not sports |

如果我们需要判断"A very close game "属于哪一类，该怎么做呢？

朴素贝叶斯是基于概率的分类器，我们就会分别计算它属于"Sports"和"Not Sports"的概率，比较谁的值大。

写成数学公式: _P(Sports | a very close game)_，即当"a very close game"发生的时候，"Sports"出现的概率。

那么，如何计算概率值呢？

# 特征工程

构建机器学习模型的第一个工作就是确定特征，特征体现了个体或者集合之间的差异，从训练集中提取特征，进而通过特征去预测输入的类别。比如，要对健康状况进行分类，我们的特征就包括身高、体重、年龄等等。此时我们可以忽略名字、喜欢的颜色，因为它们对构建的模型不重要。

在上面的文本中，只包含文本，我们可以利用词频来建立特征，我们会忽略单词的顺序和句法，将文档看成是单词的集合。这看起来很粗糙，但是效果很好。

# 贝叶斯定理

现在，我们需要将目标概率转换成能使用词频计算的公式。贝叶斯公式很适合处理条件概率相关的问题，它提供了下面的转化公式：

![](https://static-public.chatopera.com/backlog/chatbot/images/2017/06/bayes1.svg)

在我们的场景中，_P(Sports | a very close game)_ 就可以表示成：

![](https://static-public.chatopera.com/backlog/chatbot/images/2017/06/bayes2.svg)

所以现在，我们只需要比较

_P(a very close game | Sports) X P(Sports)_ 与 _P(a very close game | Not Sports) X P(Not Sports)_ 二者谁的概率大。

这样看起来就简单很多，只需要比较"Sports"类别中出现"a very close game"的次数和"Not Sports"类别中出现"a very close game"次数，谁的值更大。问题在于，"a very close game"没有发生在任何一个类别。

# 朴素

所以，"朴素"就是一个依赖性很强的条件：我们假设每个词在一句话中出现的事件是彼此独立的。这就意味着，我们不再面对一个句子，而是转移到每个词，根据这个想法，"this party was fun"与"fun was party this"是一样的。

那么，我们得到如下推论：

![](https://static-public.chatopera.com/backlog/chatbot/images/2017/06/bayes3.svg)

现在，只需要比较每个词在训练集出现的次数，然后代入计算公式就可以了。

# 计算概率

首先，计算 _P(Sports)_ 出现的概率 =3/5，_P(Not Sports)_ 出现的概率 =2/5。

然后，计算 _P(game|Sports)_，也就是 *game*在 *Sports*类别中占全部单词的比重 =2/11。

但是，接下来就遇到一个问题：_close_ 没有出现在*Sports*的样本里。_P(close|Sports)_ = 0。这就给概率计算带来了困扰，对于乘法而言，整个目标概率也会等于 0。也可能会使两个目标概率都是 0。

我们怎么解决这个问题？拉普拉斯平滑。我们给每个词的词频 +1，所以，不会出现某个词的词频为 0。整个训练集，一共包含 14 个不同的词。所以，_P(game|Sports)_ = (2+1) / (11+14)。整个结果变成：

![](https://static-public.chatopera.com/backlog/chatbot/images/2017/06/bayes4.svg)

现在，我们计算两个目标概率：

![](https://static-public.chatopera.com/backlog/chatbot/images/2017/06/bayes5.svg)

结果证明，"A very close game"属于*Sports*类别。

# 升级优化

有很多方法可以优化上述模型，这些方法让朴素贝叶斯变得即使和当今复杂的算法相比也很有竞争力。比如：

- 去停留词：这些常用词没有给分类带来益处，比如：的，地，了，呢等等。比如，"a close game"被处理为"close game"再进行计算。

- 取词根：对于很多同义词或者变形，我们可以处理成词根进行表达，比如：星期六，周六和礼拜六。

- 使用 N-grams：不计算单独的词，而是将前后词连接起来计算，照顾词之间序列化的特征。

- [词频和逆词频](http://samurais.github.io/development/2017/06/14/tf-idf/)：通过单词在文档和语料中整体表现来计算概率。

# 总结

现在也许你已经对朴素贝叶斯有了很好的了解，使用它解决分类问题，这个简单的方法在该领域有很好的表现。如果你打算学习更多有趣的知识，可以继续阅读[机器学习指南](https://blog.monkeylearn.com/a-gentle-guide-to-machine-learning/)和[自然语言处理指南](https://blog.monkeylearn.com/the-definitive-guide-to-natural-language-processing/)。

# 延伸阅读

[基于朴素贝叶斯的自然语言分类器](http://www.jianshu.com/p/b00c085d704a)

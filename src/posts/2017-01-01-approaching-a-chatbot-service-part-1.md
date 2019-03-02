---
layout: post
title: "Approaching a Chatbot Service - Part 1: Introduction"
excerpt: "介绍了聊天机器人目前的发展。"
category: development
tags: [thoughts]
disqus: true
---

>  声明：请尊重原创，转载注明来源网站[Chatopera Engineering](http://eng.chatopera.com)

<!-- 概述聊天机器人 -->
目前机器学习，尤其是深度学习，已经成功的解决了图像识别的问题。从IMAGENET大赛的近几年成绩看，识别类问题准确度已经接近100%。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-20.44.22.png)

与此同时，机器学习在解决“语音到文字”(Speech to Text)以及“文字到语音” (Text to Speech)方面也有了飞跃。

而一群更加疯狂的人在尝试用机器学习解决自然语音理解，甚至在自然语言理解的基础上，开发聊天机器人。

<table style="width:100%">
  <tr>
    <th>服务</th>
    <th>描述</th>
    <th>地址</th>
  </tr>
  <tr>
    <td>Botframework by Microsoft</td>
    <td>提供会话管理，跨平台连接方案</td>
    <td>https://dev.botframework.com/</td>
  </tr>
  <tr>
    <td>API.AI</td>
    <td>会话训练，会话管理，语音识别，意图识别，一系列训练好的主题</td>
    <td>https://api.ai/</td>
  </tr>
  <tr>
    <td>Telegram Bot Store</td>
    <td>聊天机器人应用商店</td>
    <td>https://storebot.me/</td>
  </tr>
</table>

通过这三个服务, 就可以构建聊天机器人并且发布上线。

* Step 1 - 在Telegram上注册账号

通过 BotFather创建Bot。
![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-21.12.20.png)

* Step 2 - 在Botframework上注册账号

创建一个Bot, 同时下载Botframework提供的SDK／Sample( Node.js|C#)，连接到Telegram。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-21.16.22.png)

基于Botframework的对话，要写很多代码实现，这样我们更需要一个连接到已经提供一些对话的服务上。


* Step 3 - 接入 API.AI

API.AI可以提供标注对话，开放域对话和语音识别，意图识别等功能。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-21.24.34.png)

* Step 4 - 服务发布

Telegram是一个神奇的IM，它提供了[聊天机器人应用商店](https://storebot.me/)。使用Telegram IM的用户可以快速体验和使用这些Bot。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-21.34.12.png)


一些Bot的体验真的很棒，尤其是使用了人工智能技术的Bot，以至于会出现下面的[评论](https://storebot.me/bot/andyrobot)。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-21.35.47.png)


还有其他聊天机器人的玩家：*wit.ai*, *Chatfuel*, *Facebook Messager*, *Apple Siri*, *[腾讯机器人平台](http://bot.qq.com/)*, *Microsoft LUIS.AI*, etc.

不管是像微软这样的大公司，还是像[Operator](https://operator.com/)在垂直领域提供服务的创业公司，都将聊天机器人看成是==下一代人机交互的服务形态==，==聊天机器人不单纯的提供了一个新的服务渠道，它还改变了服务本身==，即通过历史数据训练Language Model，来部分取代人的作用，聊天机器人对信息的组织和处理能力，在搜索引擎基础上，又往前迈了一大步。比如，[京东JIMI依靠DeepQA系统，实现“最强大脑”](http://mp.weixin.qq.com/s/qZ6tagsz_2PICS15hP5erw)，JIMI就是聊天机器人的一个形态。

# 聊天机器人模型分类

## 基于检索的模型

回答是提前定义的，使用规则引擎、正则匹配或者深度学习训练好的分类器从数据库中挑选一个最佳的回复。

## 基于生成的模型

不依赖于提前定义的回答，但是在训练的过程中，需要大量的语料，语料包含了*context*和*response* 。当下流行使用**LSTM**和 **RNN**训练生成的模型，这种方法最早用来完成机器翻译的任务 - [Sequence to Sequence Learning with Neural Networks](http://git.oschina.net/ubiware/tech-books/raw/master/machine-learning-papers/1409.3215v3.pdf)。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-21.59.14.png)

目前，在生产环境下，提供聊天服务的，一般都是基于检索的模型，而**Seq2Seq**的出现，有可能使基于生成的模型成为主流，因为**Seq2Seq**在长对话的情况下，依然可以表现的很好。

## 长对话和短对话

长对话需要考虑的因素更多，就像目前API.AI提供的服务中，要完成一个任务，比如预定酒店。

> 小明: 帮我订今天晚上，上海浦东香格里拉酒店。

这时，API.AI得到了时间，地点和人员。它可能正好检索到了我们在**订酒店故事**里的一条被标注的记录。*Intent*, *Entity*确定了， *Action*就被确定了。

可是，如果是下面：

> 小明: 帮我订今天晚上，上海的酒店。

Chatbot就要询问：

> Bot: 你需要订哪家酒店？

长对话，其实就是能在用户场景下对话，要识别场景，就需要考虑时间、地点、刚刚用户都说了什么以，用户和Bot的关系。

"订酒店"属于个人助理类服务，目前，api.ai已经支持了这种“追问用户更多信息”的功能，属于简单的问题。

而类似于客服机器人，更多情况是多问题-多交织的对话，就是长对话中，很难解决的问题。

所以，当下，大量机器人是面向短对话的。比如，微软小冰，小娜，图灵机器人, etc.

## 开放领域和封闭领域
这两个主要从话题层面进行区分。在开放语境下，用户可以和聊天机器人聊任何话题。在封闭语境下，只能聊机器人设定的主题。

这主要取决于数据：有什么数据，就能聊什么主题。

比如在车载系统中，对话的机器人一般都是十个左右的意图，围绕意图进行训练聊天主题。

老司机一般都聊什么？

* 服务区还有多远？
* 我买的股票怎么样？
* 播放一个音乐
* 听交通台
* 呼叫一个电话
* ...

# 挑战

## 关联上下文
<!--
But on the subject, I really like the idea of a hybrid retrieval/generative model. Using a LSTM to retrieve a thought vector and than generating the reply based on parameters <P, U, L>  Personality matrix, User Relationship with Bot and Lexicon.
-->

关联上下文，就需要在设计机器人的时候，给它一个问题，获得一个回复。生成回复的时候，要考虑 P, U, L.

* P - Personality matrix
* U - User Relationship with Bot
* L - Lexicon

这需要在训练LSTM Net的时候，要将更多信息注入，而且也更像是将基于检索的模型和基于生成的模式混合起来完成。

## 意图识别
就像API.AI， 及其WIT.AI, LUIS.AI们构想的一样，要完成有效的对话，先要搞清楚用户在表达什么意图。但是目前API.AI们提供的方案需要人工标注Entity和Intent，这种工作很繁琐，效率低。

能通过历史数据，无监督或者半监督的完成意图的分类模型是亟须解决的一个挑战。

## 如何判断一个模型的好坏
在使用LSTM训练基于生成的模型的过程中，一个很大的挑战就是没有自动化的量化的标准：除了人工的和模型对话意外，不确定模型间的好坏。

这个问题的解决办法，应该是在训练时，就同时训练正确的回答和错误的回答，然后使用[**recall@k**](http://www.wildml.com/2016/07/deep-learning-for-chatbots-2-retrieval-based-model-tensorflow)机制验证。

# 一种设想
<!-- 介绍基于Rule Based Engine + Language Model下的机器人 -->

在经过了很多调研和尝试后，一种比较Smart的机器人的实现方案可能是下面这个样子：

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-01-at-23.13.23.png)

* 从社交网络上对接到服务需要走InboundMessage, 从OutboundMessage中异步获取回复。

* Bot Engine 处理session, context, personality，知识图谱，对话规则和主题。

对话主题是基于人工经验制作的。除了包括引导用户做自我介绍类的"系统对话"，还要包括实现业务价值的"服务对话"，比如“学习英语单词”，还要有“日常对话”，比如打招呼，询问最近看的电影等生活场景。

* Bot Engine不能做到回复所有问题，因为基于规则的原因，能覆盖的聊天内容范围小，当在Bot Engine中，得不到好的答案或者没有命中一个规则时，就请求背后的Bot Model.

Bot Model是通过深度神经网络训练而来，可以回答任何问题。

* 在对话服务过程中，会产生新的数据，使用强化学习，给Bot Model正向的激励。

* 使用知识图谱记录Bot，User, World三层知识。

作为这个系列文章的第一篇，主要是介绍聊天机器人目前发展的状况和分类，在后面几篇中，将对上图所设想的方案做更多描述。

* [Approaching a Chatbot Service - Part 2: Bot Engine](http://blog.chatbot.io/development/2017/01/02/approaching-a-chatbot-service-part-2-bot-engine/)

* [Approaching a Chatbot Service - Part 3: Bot Model](http://blog.chatbot.io/development/2017/02/07/approaching-a-chatbot-service-part-3-bot-model/)

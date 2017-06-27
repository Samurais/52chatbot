webpackJsonp([30,44],{301:function(n,t){n.exports={rawContent:'\n>  声明：请尊重原创，转载注明来源网站[Chatbot Master](http://blog.chatbot.io)\n\n在[上一篇文章](http://blog.chatbot.io/development/2017/01/01/approaching-a-chatbot-service-part-1/)中，介绍了聊天机器人目前的发展。本篇主要介绍基于规则的，检索的聊天机器人引擎 - Bot Engine.\n\n# 问题域\n```\nSpeech to Text => Logic => Text to Speech\n```\n\nSTT和TTS，目前有很多厂商提供技术产品：\n\n> Speech to Text 语音识别技术\n\n[Google Cloud Platform](https://cloud.google.com/speech/docs/), [IBM Watson API](https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/speech-to-text.html), [云知声](dev.hivoice.cn/sdk_download/schema_sdk.jsp)，[科大讯飞](www.xfyun.cn/index.php)\n\n> Text to Speech 语音合成技术\n\nIBM Watson API [Docs](https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/text-to-speech.html) [demo](https://text-to-speech-demo.mybluemix.net/)\n\n经过多年的研究，尤其是深度学习的采用，在这两项技术上取得了突破性进展。今天本文所要讨论的是==logic==，而且是==基于规则引擎的logic==, ==基于机器学习的部分将在以后的文章中讨论==。\n\n# Conversation Model\n在两个人之间的对话，可以用下面这个模型表示，双方头脑中所要向对方表达的**目标**，需要通过**语言**来交换意见，为了达成共识，二者需要在一个**语境**下。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-02-at-12.53.08.png)\nhttps://vimeo.com/43677920\n\n为了支撑这个模型，在设计Bot Engine过程中，要考虑如下的要点：\n\n* 低成本的构建对话\n* 能区分不同类型的对话\n* 规范化输入\n* 高效率的规则引擎 \n* 用户画像\n* 回复时，考虑对话的历史记录\n\n## 低成本的构建对话\n构建聊天内容最好是不需要有开发技能，而且有的开发者也没有很好的聊天的技能。即便像Botframework这样的大厂的产品，在构建对话时，都不够友好，只能面向有开发技能的人，而且是一种硬编码。这样对于维护对话很不利。\n\n> 使用Botframework的waterfall，设计对话的人需要了解builder.Prompts接口和session.beginDialog|endDialog。这样做很不合理。\n\n```\nexports.start = [(session, arg, next) => {\n    builder.Prompts.text(session, "Do you want to start Class now?");\n}, (session, results) => {\n    co(function*() {\n        return yield watson.sentiment(results.response);\n    }).then(function(o) {\n        let reply;\n        switch (o.docSentiment.type.toLowerCase()) {\n            case \'positive\':\n                reply = \'_begin_\';\n                break;\n            case \'negative\':\n                reply = "Got it."\n                break;\n            case \'neutral\':\n                reply = "Ok, then.";\n                break;\n        }\n        if (reply == \'_begin_\') {\n            session.beginDialog(\'/daily_lessons/vocabulary\');\n        } else {\n            builder.Prompts.text(session, reply);\n            session.endDialog();\n        }\n    });\n}];\n```\n\n而另外一方面，使用*script*的方式，显得更合理，比如[SuperScript](http://superscriptjs.com).\n\n```\n+ Do you want to start Class now?\n- start_class\n\n  + ~yes\n  % Do you want to start Class now\n  - Great, ^redirectTo(/daily_lessons/vocabulary)\n\n  + ~no\n  % Do you want to start Class now\n  - Ok, then.\n```\n\n还有[*rivescript*](https://github.com/aichaos/rivescript-js/), [*chatscript*](https://github.com/bwilcox-1234/ChatScript), 同样类似于*superscript*方式进行构建对话。\n\n## 能区分不同类型的对话\n设计对话时，至少有三种类型的对话:\n\n- system\n\n系统对话，只能聊一次，或者只能由系统主动发出。比如自我介绍，*bot*和*小明*进行初次对话，*bot*会问：“你叫什么名字？”。*小明*回答“小明”。那么*bot*就知道"id:xxx"是*小明*。而将来*bot*都不应该再问这个问题。\n\n- daily\n\n这些是*bot*可以重复和用户聊的主题，可能并不是*每天*，它们可以每隔一段频率就触发，比如：问候，节日祝福，“你在做什么”, etc.\n\n- business\n\n和一些闲聊的机器人不同，bot应该提供一些价值，这些价值可能是**个人信息助手**, **导购**, **教育**, **播放音乐**。\n\n声明对话类型:\n\n```\n> topic:business (vocabulary class)\n+ Do you want to start Class now?\n- start_class\n\n  + ~yes\n  % Do you want to start Class now\n  - Great, ^redirectTo(/daily_lessons/vocabulary)\n\n  + ~no\n  % Do you want to start Class now\n  - Ok, then.\n<\n```\n\n所以，一个对话看起来像是这个样子。\n\n## 规范化输入\n<!-- understand language -->\n\n表达同样的意思，可以有多种表示方法。\n\n```\nwhats the color of the calanders\nwhat is the colour of the calenders\nwhat be the colour of the calender\n```\n在将输入语句传给规则引擎前，要先做规则化处理。比如：\n\n1) tokenized - 分词\n\n2) stemmed - 英文单词取词根\n\n3) lemmatized - 英文单词变形的归类（例如单复数归类)\n\n4) part-of-speech (POS) tagger - [reads text in some language and assigns parts of speech to each word](http://nlp.stanford.edu/software/tagger.html)\n\n5) named entity recognizer (NER) - [ labels sequences of words in a text which are the names of things]\n(http://nlp.stanford.edu/software/CRF-NER.html)\n专有名词 - 人名、地名、组织名、URL链接、系统路径等\n\n这里需要结合很多工具库来实现：NLTK, Stanford CoreNLP, Jieba分词，Wordnet, ConceptNet.\n\n比如，借助Stanford CoreNLP，可以有下面的标注：\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Xi-Jinping.png)\n\n经过规范化输入，在规则引擎中，可以依赖词性和函数实现更智能的回答。\n\n## 高效率的规则引擎\n*Bot*可以有大量的主题，即便是只有*100*主题，每个主题*15*个对话，那就是*1500*个规则。如果只是单机运行，至少要进行下面两个优化:\n\n* 排序\n\n通过聊天的记录和关键字，先给对话栈排序。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-02-at-15.10.34.png)\n\n排序的思路大概是这样：\n\n1） 查看当前对话，是否还有下文，一个对话的下文可以对应多个规则。\n\n如果有下文，检测是否一个规则能匹配上输入。如果匹配上了，回复。\n如果没有下文，或者没有规则能匹配上，进入*次优匹配*。\n\n2） **次优匹配**是将聊天主题的历史记录，使用[**TF-IDF**](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)算法进行排序。\n\n简单说，就是使用一个函数计算用户聊天的对应主题频率。给不同的聊天主题加权重。在**次优匹配**中，都是处理用户曾经聊过的主题。\n\n3） 在**次优匹配**中，没有命中，进入**其他匹配**。\n\n**其他匹配**包括了以前没有聊过的主题。\n\n* 并发\n\n在排序后，去同时处理匹配运算，将命中的规则的*回复*，按照排序的顺序放到数组里，然后，从数组中取第一个元素。这样就比按照顺序一个一个检测快很多。\n\n比如，一些Node.js模块：[async](https://www.npmjs.com/package/async)。\n\n## 用户画像\n\n在和用户聊天的过程中，获取到的用户相关的信息，有必要记录在数据库中，这其实是构建[知识图谱](http://baike.baidu.com/link?url=ASlZAbNwelZm8sz1AFhSU9W9irn1PK98QGewGnk0mMM-NYLPSNNTuSysDxwqTznVFBAl97kI_49tuODWZBcHrEsac6MbIh0o1m0hdxY1qnQvsSUGElGClhmlttSvqsly)的过程。\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-02-at-3.27.28-PM.png)\n\n知识图谱所用的数据库是存在三个字段的结构化数据:\n\n```\n{\n  "subject": "Mao",\n  "predict": "chairman",\n  "object": "China"\n}\n```\n\n由此构建了一个关系：\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-02-at-3.36.47-PM.png)\n\n而**B**又可以跳转到**D**。\n\n目前，较为成熟的商业产品和开源方案都有。\n\n[Google Knowledge Graph API](https://developers.google.com/knowledge-graph/)\n\n[cayley graph](https://github.com/cayleygraph/cayley)\n\n\n在Bot Engine中，可以得到相关用户的Knowledge Graph.\n```\nthis.user.memory.get( ...)\nthis.bot.createUserFact( ...)\n```\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/01/Screen-Shot-2017-01-02-at-3.46.18-PM.png)\n\n使用知识图谱，除了对实体之间完成关系构建外，还有一个原因是，搜索速度非常快，搜索功能强大。\n\n# SuperScript\n\n介绍了这么多，那么到底怎么实现一个Bot Engine呢？经过了很多比较后，我觉得基于SuperScript实现Bot Engine是可行的。主要是下面这几点：\n\n* 社区活跃：目前稳定版本v0.12.2没有bug, 最新版v1.0.0也在快速开发。\n\n* 轻便灵活: 将SuperScript的源码读了一遍，觉得即便是作者不维护了，我也可以维护。\n\n* 功能强大：在上面讨论的问题中，SuperScript都是有涉及的。\n\n## 对话脚本\n* [topic type](https://github.com/superscriptjs/superscript/wiki/Topics) - 话题\n* [conversation](https://github.com/superscriptjs/superscript/wiki/Conversations) - 对话\n* [function](https://github.com/superscriptjs/superscript/wiki/Plugins-and-Functions) - 插件和函数\n\n\n# Get started\n\n> npm install [superscript](https://github.com/superscriptjs/superscript)\n\n```\nvar superscript = require("superscript");\nnew superscript({ ...}, function(err, bot){\n    bot.reply("userId", "hello", function(err, reply){\n        // do your magic\n    })\n})\n```\n\n# Conclusion\n\n很多人预计2017年，AI方向最可能取得成功的领域是聊天机器人。那么，在这种情况下，面向聊天机器人的架构设计，是一个热门问题。包括Google，Facebook都有可能发布类似于微软的Botframework平台。而Bot Engine, 一种处理对话的引擎，起着很关键的作用。在开源社区，还没有看到哪个呼声非常高的实现，SuperScript，至少在JavaScript社区，是一个不错的选择。\n\n在[下一篇文章](http://eng.arrking.com/approaching-a-chatbot-service-part-3-bot-model/)中，我将介绍使用深度学习技术，依靠聊天语料，训练**Bot Model**.\n\n# Reading List\n[NaturalNode](https://github.com/naturalnode) - General\nnatural language facilities for node.\n\n[SuperScript](http://superscriptjs.com/) - A dialog system and bot engine for conversational UI\'s.\n\n[Stanford CoreNLP](http://stanfordnlp.github.io/CoreNLP/) - a suite of core NLP tools\n\n[Natural Language Toolkit](http://www.nltk.org/) - NLTK is a leading platform for building Python programs to work with human language data. \n\n[How to Cook a Graph Database in a Night](http://nodejsconfit.levelgraph.io/#1) - A Knowledge Graphic tool based on LevelDB.\n',metaData:{layout:"post",title:"Approaching a Chatbot Service - Part 2: Bot Engine",excerpt:"主要介绍基于规则的，检索的聊天机器人引擎 - Bot Engine.",category:"development",tags:["thoughts"],disqus:!0}}}});
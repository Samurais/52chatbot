---
layout: post
title: "实体命名标识和槽位取值的关系"
excerpt: "在对话系统中，对NLP中的实体命名标识和NLU中的槽位取值，进行介绍。"
category: research
tags: [nlp, nlu]
disqus: true
---

sequence-tagging可以帮助解决：实体命名和槽位取值问题。

| Task | Dataset | Example |
| --- | --- | --- |
| NER | [CoNLL 2003](http://www.cnts.ua.ac.be/conll2003/ner/) | [link](https://people.cs.umass.edu/~mccallum/papers/mccallum-conll2003.pdf) | 
| Slot filling | [ATIS](https://catalog.ldc.upenn.edu/LDC94S19) | [link](http://www.iro.umontreal.ca/~lisa/pointeurs/RNNSpokenLanguage2013.pdf) | 

sequence-tagging 是带有目的性的从一段文字中寻找信息。

*  实体命名

寻找人名、地名、组织结构或其他专有名词。

*  槽位取值

寻找关系，问题类型或其他信息。通常，槽位取值使用模版，输出结果便于下一步在知识库中寻找对应的信息。

# Refers
[What is the difference between slot filling in NLU and named entity recognition in NLP?](https://www.reddit.com/r/LanguageTechnology/comments/45g5hr/what_is_the_difference_between_slot_filling_in/)

[Knowledge Base Population](https://nlp.stanford.edu/projects/kbp/)
---
layout: post
title: "Sequence-to-Sequence Learning as Beam-Search Optimization"
excerpt: "introduce a model and beam-search training scheme, based on the work of Daume III and Marcu (2005), that extends seq2seq to learn global sequence scores. This structured approach avoids classical biases associated with local training and unifies the training loss with the test-time usage, while preserving the proven model architecture of seq2seq and its efficient training approach. "
category: research
tags: [seq2seq, dialogue, tensorflow]
disqus: true
---

# Paper
<!-- 论文地址，说明论文要解决的问题 -->
Examples of basic model can be found in this paper.

https://arxiv.org/abs/1606.02960

# Implementation
<!-- 对应论文的实现：开源码地址，数据等 -->

https://github.com/harvardnlp/BSO/tree/master

Code for Sequence-to-Sequence Learning as Beam-Search Optimization (Wiseman and Rush, 2016).

This code is adapted from a much earlier version of Yoon Kim's seq2seq-attn code.

For questions/concerns/bugs feel free to contact swiseman at seas.harvard.edu.




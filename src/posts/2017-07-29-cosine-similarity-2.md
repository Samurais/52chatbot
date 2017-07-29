---
layout: post
title: "余弦相似性 2"
excerpt: "判断两个文章或者句子相似程度的一个算法。根据向量坐标，绘制在空间中，求得夹角的Cos值。Cos值越接近1，则说明夹角越小，即两向量相似。"
category: development
tags: [nlp]
disqus: true
---

[余弦相似性](https://zh.wikipedia.org/wiki/%E4%BD%99%E5%BC%A6%E7%9B%B8%E4%BC%BC%E6%80%A7): 通过计算两个向量的夹角余弦值来评估他们的相似度。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/bg2013032002.png)

余弦值越接近1，就表明夹角越接近0度，也就是两个向量越相似。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/bg2013032007.png)


在上一篇文章中，给出了相似性计算的原理，如果模型通过[word2vec](https://code.google.com/archive/p/word2vec)训练好了```bin```格式的文件。

```
#! /bin/bash 

# constants
baseDir=$(cd `dirname "$0"`;pwd)
W2V_CMD=word2vec/src/word2vec
DATA=source.wordseg
OUTPUT=w2v.bin

# functions

# main 
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return
cd $baseDir
$W2V_CMD -train $DATA \
    -output $OUTPUT \
    -size 100 \
    -window 5 \
    -sample 1e-5 \
    -negative 1 \
    -hs 0 \
    -cbow 0 \
    -iter 30 \
    -binary 1 \
    -min-count 5 \
    -threads 20
```

## 怎么通过其获得两个句子的相似度呢？

```
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#===============================================================================
#
# Copyright (c) 2017 <stakeholder> All Rights Reserved
#
#
# File: /Users/hain/calculate_similarity.py
# Author: Hai Liang Wang
# Date: 2017-07-29:14:09:27
#
#===============================================================================

"""
   Calcualte similarity with word2vec model.
   http://code.google.com/p/word2vec/
"""
from __future__ import print_function
from __future__ import division

__copyright__ = "Copyright (c) 2017 . All Rights Reserved"
__author__ = "Hai Liang Wang"
__date__ = "2017-07-29:14:09:27"


import os
import sys
curdir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(curdir)

if sys.version_info[0] < 3:
    reload(sys)
    sys.setdefaultencoding("utf-8")
    # raise "Must be using Python 3"

import numpy as np

# for text format, can resolve vector size with the model file.
W2V_DIM_SZIE = os.environ['W2V_DIM_SZIE'] if 'W2V_DIM_SZIE' in os.environ else 100

def load_model(model_file = './w2v.bin', binary=True):
    '''
    Load model with C format word2vec file.
    '''
    if not os.path.exists(model_file):
        raise Exception("Model file does not exist.")
    from gensim.models.keyedvectors import KeyedVectors
    return KeyedVectors.load_word2vec_format(model_file, binary=binary, unicode_errors='ignore')

# lambdas for cos similarity
sim_molecule = lambda x: np.sum(x, axis=0) # 分子
sim_denominator = lambda x: np.sqrt(np.sum(np.square(x)))  # 分母 

def similarity_distance(sentence1, sentence2, V):
    '''
    compute cosine similarity of v1 to v2:
        (v1 dot v2)/{||v1||*||v2||)
    '''
    sentence1_vectors = []
    sentence2_vectors = []

    def _vector(sentence, vectors):
        for x,y in enumerate(sentence.split()):
            try:
                v =  V.wv[y.decode('utf-8')]
                vectors.append(v)
            except KeyError, error:
                # define W2V_DIM_SZIE in environment
                vectors.append(np.zeros(W2V_DIM_SZIE, dtype=float))

    _vector(sentence1, sentence1_vectors)
    _vector(sentence2, sentence2_vectors)

    # todo, compute OOV words
    # print("v1", sentence1_vectors)
    # print("v2", sentence2_vectors)

    a = sim_molecule(sentence1_vectors)
    b = sim_molecule(sentence2_vectors)
    A = sim_denominator(a)
    B = sim_denominator(b)

    similarity = np.dot(a, b) / (A * B)
    return similarity

def test():
    txts = ["登录 不 上去 怎么办 ", "扫码 一直 不 能 成功 怎么办"]
    V = load_model(model_file='./w2v.bin', binary=True)
    print('loaded.')
    print(similarity_distance(txts[0], txts[1], V))

class SimilarityCalculator():
    '''
    Similarity Calculator
    '''

    def __init__(self, model_file, binary=True):
        self.V = load_model(model_file=model_file, binary=binary)

    def distance(self, s1, s2):
        return similarity_distance(s1, s2, V=self.V)

if __name__ == '__main__':
    test()
```


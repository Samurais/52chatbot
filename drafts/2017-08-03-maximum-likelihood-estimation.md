---
layout: post
title: "最大似然估计"
excerpt: "最大似然估计提供了一种给定观察数据来评估模型参数的方法，即：“模型已定，参数未知”。"
category: research
tags: [algorithm]
disqus: true
---

Maximum Likelihood Estimation for Linear Regression with Tensorflow
# 了解似然函数
https://en.wikipedia.org/wiki/Maximum_likelihood_estimation

# 最大似然算法
https://zh.wikipedia.org/wiki/%E4%BC%BC%E7%84%B6%E5%87%BD%E6%95%B0

# TensorFlow线性回归的例子
https://stackoverflow.com/questions/41885665/maximum-likelihood-linear-regression-tensorflow

example:

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
#===============================================================================
#
# Copyright (c) 2017 Hai Liang Wang, All Rights Reserved
#
#
# File: linear_regression_tensorflow.py
# Author: Hai Liang Wang
# Date: 2017-08-01:15:03:17
#
#===============================================================================

from __future__ import print_function
from __future__ import division

import tensorflow as tf
import numpy as np

graph = tf.Graph()

with graph.as_default():
    # Ops and variables pinned to the CPU because of missing GPU implementation
    with tf.device('/cpu:0'):
        X = tf.placeholder("float", None)
        Y = tf.placeholder("float", None)
        theta_0 = tf.Variable(np.random.randn())
        theta_1 = tf.Variable(np.random.randn())
        var = tf.Variable(0.5)

        # y = theta_0 + (x * theta_1)
        hypothesis = tf.add(theta_0, tf.mul(X, theta_1))
        lhf = 1 * (50 * np.log(2*np.pi) + 50 * tf.log(var) + (1/(2*var)) * tf.reduce_sum(tf.pow(hypothesis - Y, 2)))
        op = tf.train.GradientDescentOptimizer(0.01).minimize(lhf)

        # Add variable initializer.
        init = tf.global_variables_initializer()

with tf.Session(graph=graph) as session:
    # We must initialize all variables before we use them.
    init.run()
    print("Initialized")

    train_X = np.random.rand(100, 1) # all values [0-1)
    train_Y = train_X
    feed_dict = {X: train_X, Y: train_Y}
    num_steps = 100001

    for steps in range(num_steps):
        _, loss, v0, v1 = session.run([op, lhf, theta_0, theta_1], feed_dict=feed_dict)
        # since x == y, theta_0 should be 0 and theta_1 should be 1.
        print('Run step %s, loss %s, theta_0 %s, theta_1 %s' % (steps, loss, v0, v1))
```

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/08/maximum-likelihood-estimation-1.png)

more examples:
https://github.com/Samurais/maximum-likelihood-estimation

# references

[Likelihood_function](https://en.wikipedia.org/wiki/Likelihood_function)

[似然函数](https://zh.wikipedia.org/wiki/%E4%BC%BC%E7%84%B6%E5%87%BD%E6%95%B0)
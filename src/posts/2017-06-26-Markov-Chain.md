---
layout: post
title: "马尔可夫链"
excerpt: "马尔可夫链通常用来建模排队理论和统计学中的建模，还可作为信号模型用于熵编码技术，如算法编码。"
category: research
tags: [probability, algorithm]
disqus: true
---

# 定义
[马尔可夫链](http://baike.baidu.com/item/%E9%A9%AC%E5%B0%94%E5%8F%AF%E5%A4%AB%E9%93%BE)是满足马尔可夫性质的随机过程。马尔可夫链描述了一种状态序列，其每个状态值取决于前面有限个状态。一阶马尔可夫过程就是下一个状态的的转移只依赖于当前状态。

# 举例
假设一个集合具有状态S[1-6], 每个状态的表示：
**S1 = {AA, AA}**, 
**S2 = {AA, Aa}**
**S3 = {AA, aa}** 
**S4 = {Aa, Aa}** 
**S5 = {Aa, aa}** 
**S6 = {aa, aa}**.

每个状态是包含两个元素的集合，通过集合内的元素，可以其他状态，比如*S2*可以重组为**{AA, Aa}**, **{AA, AA}**, **{Aa, Aa}**。

规定状态转移矩阵为：

| State | Next(**S1**) | Next(**S2**) | Next(**S3**) | Next(**S4**) | Next(**S5**) | Next(**S6**) |
| --- | --- | --- | --- | --- | --- | --- | 
| Current(**S1**) | 1 | 0 | 0 | 0 | 0 | 0 | 
| Current(**S2**) | 1/4 | 1/2 | 0 | 1/4 | 0 | 0 |
| Current(**S3**) | 0 | 0 | 0 | 1 | 0 | 0 | 
| Current(**S4**) | 1/16 | 1/4 | 1/8 | 1/4 | 1/4 | 1/16 | 
| Current(**S5**) | 0 | 0 | 0 | 1/4 | 1/2 | 1/4 | 
| Current(**S6**) | 0 | 0 | 0 | 0 | 0 | 1 | 

上图中，每一行代表的是当前状态的一下一步转移到不同状态的概率。注意一个含有M个状态的一阶过程有M的平方个状态转移。

基于以上的信息，我们再定义一个当前状态为**S3**，那么如何预测接下来10步的状态情况?


## 应用马尔可夫链

如果当前状态是 *S3*, 那么连续的计算10步。

```python
#!/usr/bin/env python

import numpy as np
from matplotlib import pyplot

# state transition matrix
P = np.matrix([[1., 0., 0., 0., 0., 0.],
               [1./4, 1./2, 0., 1./4, 0., 0.],
               [0., 0., 0., 1., 0., 0.],
               [1./16, 1./4, 1./8, 1./4, 1./4, 1./16],
               [0., 0., 0., 1./4, 1./2, 1./4],
               [0., 0., 0., 0., 0., 1.]])

# Init state
v = np.matrix([[0, 0, 1, 0, 0, 0]]) 

# Get the data
plot_data = []
for step in range(5):
    result = v * P**step
    plot_data.append(np.array(result).flatten())

# Convert the data format
plot_data = np.array(plot_data)

# Create the plot
pyplot.figure(1)
pyplot.xlabel('Steps')
pyplot.ylabel('Probability')
lines = []
for i, shape in zip(range(6), ['x', 'h', 'H', 's', '8', 'r+']):
    line, = pyplot.plot(plot_data[:, i], shape, label="S%i" % (i+1))
    lines.append(line)
pyplot.legend(handles=lines, loc=1)
pyplot.show()
```

* 运行：

```
pip install numpy matplotlib
python markov_chain_example.py
```

* 结果：

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/06/markov_chain_example_5_steps.png)

从上图可以注意到：
第0步**S3**为1， 其他状态为0。
第1步，根据状态转移矩阵，**S4**为1，其他状态为0。
第2步，根据状态转移矩阵，各状态均有可能。
...

## 结论
马尔可夫链可以用来生成预测的序列。此外，我们注意到，有下面两个问题：

### 矩阵运算

在代码中，我们注意到，

```
result = v * P**step
```

其中，**P\**N**是对**状态转移矩阵P**[取**N次方**(numpy.linalg.matrix_power)](https://docs.scipy.org/doc/numpy/reference/generated/numpy.linalg.matrix_power.html)。

### 为什么状态转移矩阵的列求和不为1
首先，当前状态为不同状态时，并不能保证下一状态都转移到**S1**或者某一特定的状态，因此，每列的和应该是**0~状态的数量**。

# Refers
[隐马尔可夫模型（HMM）攻略](http://blog.csdn.net/likelet/article/details/7056068)
[Python Markov Chain Packages](https://martin-thoma.com/python-markov-chain-packages/)

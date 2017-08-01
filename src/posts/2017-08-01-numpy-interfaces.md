---
layout: post
title: "Numpy Get started"
excerpt: "Numpy是Python的一个科学计算的库，提供了矩阵运算的功能，其一般与Scipy、matplotlib一起使用。其实，list已经提供了类似于矩阵的表示形式，不过numpy为我们提供了更多的函数。"
category: development
tags: [deeplearning,utilities]
disqus: true
---


## random

### 正态分布

numpy.random.randn(d0, d1, ..., dn) 这个函数的作用就是从标准正态分布中返回一个或多个样本值。

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/08/numpy-randn.png)

如果想要从非标准正态分布中产生随机样本，咋办？比如下面这个正态分布：

```
2.5 * np.random.randn(2, 4) + 3
```

### range随机
random.random() 用于生成一个0到1的随机符点数: 0 <= n < 1.0

random.uniform(a, b) 用于生成一个指定范围内的随机符点数，两个参数其中一个是上限，一个是下限。如果a > b，则生成的随机数n: a <= n <= b。如果 a <b， 则 b <= n <= a。

random.randint(a, b)，用于生成一个指定范围内的整数。其中参数a是下限，参数b是上限，生成的随机数n: a <= n <= b

```python
print random.randint(12, 20)  #生成的随机数n: 12 <= n <= 20  
print random.randint(20, 20)  #结果永远是20  
```

random.randrange的函数原型为：random.randrange([start], stop[, step])，从指定范围内，按指定基数递增的集合中 获取一个随机数。如：random.randrange(10, 100, 2)，结果相当于从[10, 12, 14, 16, ... 96, 98]序列中获取一个随机数。random.randrange(10, 100, 2)在结果上与 random.choice(range(10, 100, 2) 等效。


### 随机获取
random.choice从序列中获取一个随机元素。其函数原型为：random.choice(sequence)。参数sequence表示一个有序类型。这里要说明 一下：sequence在python不是一种特定的类型，而是泛指一系列的类型。list, tuple, 字符串都属于sequence。有关sequence可以查看python手册数据模型这一章。下面是使用choice的一些例子：

```python
print random.choice("学习Python")   
print random.choice(["JGood", "is", "a", "handsome", "boy"])  
print random.choice(("Tuple", "List", "Dict"))  
print random.choice("学习Python") print random.choice(["JGood", "is", "a", "handsome", "boy"]) print random.choice(("Tuple", "List", "Dict"))
```


### 洗牌
random.shuffle的函数原型为：random.shuffle(x[, random])，用于将一个列表中的元素打乱。如:
```python
p = ["Python", "is", "powerful", "simple", "and so on..."]  
random.shuffle(p)  
print p
```


random.sample的函数原型为：random.sample(sequence, k)，从指定序列中随机获取指定长度的片断。sample函数不会修改原有序列。

```python
list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  
slice = random.sample(list, 5)  #从list中随机获取5个元素，作为一个片断返回  
print slice  
print list #原有序列并没有改变。  
 
随机整数：
>>> import random
>>> random.randint(0,99)
21

随机选取0到100间的偶数：
>>> import random
>>> random.randrange(0, 101, 2)
42

随机浮点数：
>>> import random
>>> random.random() 
0.85415370477785668
>>> random.uniform(1, 10)
5.4221167969800881

随机字符：
>>> import random
>>> random.choice('abcdefg&#%^*f')
'd'

多个字符中选取特定数量的字符：
>>> import random
random.sample('abcdefghij',3) 
['a', 'd', 'b']

多个字符中选取特定数量的字符组成新字符串：
>>> import random
>>> import string
>>> string.join(random.sample(['a','b','c','d','e','f','g','h','i','j'], 3)).r
eplace(" ","")
'fih'

随机选取字符串：
>>> import random
>>> random.choice ( ['apple', 'pear', 'peach', 'orange', 'lemon'] )
'lemon'

洗牌：
>>> import random
>>> items = [1, 2, 3, 4, 5, 6]
>>> random.shuffle(items)
>>> items
[3, 2, 5, 6, 4, 1]
```

## 参考
http://www.cnblogs.com/yd1227/archive/2011/03/18/1988015.html
https://sanwen8.cn/p/2941oU7.html
---
layout: post
title: "Softmax"
excerpt: ""
category: development
tags: [machine-learning]
disqus: true
---


[An Simple Softmax Function in python](https://github.com/Gokuld6012/Softmax-Function/blob/master/softmaxfunc.py)

```python
import numpy as np

def softmax(sc):
    y_x = np.exp(sc - np.max(sc))
    return y_x / y_x.sum()

scores = [3.0, 1.0, 0.2]
print(softmax(scores))
```

# references

[Softmax回归](http://ufldl.stanford.edu/wiki/index.php/Softmax%E5%9B%9E%E5%BD%92)

[Softmax Regression](http://www.cnblogs.com/tornadomeet/archive/2013/03/22/2975978.html)

[Softmax Regression - UFLDL Tutorial](http://ufldl.stanford.edu/tutorial/supervised/SoftmaxRegression/)

[What is Softmax Regression and How is it Related to Logistic Regression](http://www.kdnuggets.com/2016/07/softmax-regression-related-logistic-regression.html)

[Softmax Classifiers Explained](http://www.pyimagesearch.com/2016/09/12/softmax-classifiers-explained/)

[Softmax - Improving the way neural networks learn](http://neuralnetworksanddeeplearning.com/chap3.html#softmax)
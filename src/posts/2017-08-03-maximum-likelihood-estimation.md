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


# minst dataset with log Likelihood_function
Maximum likelihood estimation from https://github.com/bond005/python-logreg

The logreg.py module was created for educational purposes for practical lessons on 
the course "Methods and algorithms of computer linguistics", read to students of 
the Faculty of Humanities at Novosibirsk State University.

In the logreg.py module, a logistic regression algorithm is implemented to solve 
the classification problem. The process of learning logistic regression is considered 
as maximization of the logarithm of the likelihood function by the gradient method.

The logreg.py module is developed in the Python 3.x/2.x programming language using the 
NumPy Python library. The module can be used as a component of any Python-program, 
in which it is necessary to solve the problem of classification using the algorithm 
of logistic regression. In addition, this module can also be launched as a standalone 
program: in this case, the learning process for recognizing handwritten digits from the 
training subsample of the MNIST case will be demonstrated, and then - the process of 
recognizing the handwritten digits from the MNIST test sub-sample. 

To run the logreg.py module as a stand-alone program, you must install the Python-library 
ScikitLearn in the system (the tools of this library allow access to MNIST).

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function
from __future__ import division

import functools
import math # we import a standard python library for mathematics
import numpy # import the NumPy library to work with NumPy arrays of class numpy.ndarray
import scipy.sparse # import the Sparse package for SciPy for sparse matrices

class LogRegError(Exception):
    '''
    The exception class that we generate, if something goes wrong in the logistic regression.
    '''
    def __init__(self, error_msg=None):
        """ 
        A class constructor that is called automatically when creating class objects.
         : Param error_msg - The error message that we want to send, throwing an exception.
        """
        self.msg = error_msg

    def __str__(self):
        """A standard method that is called automatically when printing objects of a class using the print function.
         : Return Returns the string to print: an error message common to logistic regression,
         And an additional message passed as the constructor argument (see comment to the constructor).
         """
        error_msg = 'Logistic regression algorithm is incorrect!'
        if self.msg is not None:
            error_msg += (' ' + self.msg)
        return error_msg


class LogisticRegression:
    '''
    Class for the classifier based on the logistic regression algorithm.
    '''

    def __init__(self):
        '''
        A class constructor that is called automatically when creating class objects.
        In the constructor, we initialize all the class attributes with "empty" values.
        '''
        self.__a = None # attribute of the class that will be a free member of the logistic regression
        self.__b = None  # attribute of the class that will be a numpy.ndarray array of logistic regression coefficients
        self.__th = None  # attribute of the class that will be the probabilistic threshold for classification

    def save(self, file_name):
        '''
        Save all logistic regression parameters (class attributes) to a text file.
        : Param file_name - a string with the name of the text file, in which the saved parameters will be written.
        '''
        # First check if there is anything to save
        if (self.__a is None) or (self.__b is None) or (self.__th is None):
            # If the class attributes are empty, i.e. There is nothing to save, then we throw an exception
            raise LogRegError('Parameters have not been specified!')
        # Open a text file for writing
        with open(file_name, 'w') as fp:
            # Write the size of the input characteristic vector
            fp.write('Input size {0}\n\n'.format(self.__b.shape[0]))
            # Write the coefficients of logistic regression
            for ind in range(self.__b.shape[0]):
                fp.write('{0}\n'.format(self.__b[ind]))
            # Write the free term and the probabilistic threshold
            fp.write('\n{0}\n\n{1}\n'.format(self.__a, self.__th))

    def load(self, file_name):
        '''
        Load all the logistic regression parameters from the text file into the attributes of the class.
        : Param file_name - a string with the name of the text file from which the downloaded parameters will be read.
        '''
        # Open a text file for reading
        with open(file_name, 'r') as fp:
            input_size = -1 # the size of the input characteristic vector (until read, is set to -1)
            cur_line = fp.readline()  # read the first line
            ind = 0  # counter of the number of logistic regression parameters read
            while len(cur_line) > 0:  # until the next line is empty, i.e. The file is not over yet
                prepared_line = cur_line.strip()   # remove extra spaces from the beginning and end of the line
                if len(prepared_line) > 0:  # if after removing spaces the line is not empty, then we try to parse it
                    if input_size <= 0: # if the size of the input characteristic vector has not yet been read, then read it
                        parts_of_line = prepared_line.split()
                        if len(parts_of_line) != 3:
                            raise LogRegError('Parameters cannot be loaded from a file!')
                        if (parts_of_line[0].lower() != 'input') or (parts_of_line[1].lower() != 'size'):
                            raise LogRegError('Parameters cannot be loaded from a file!')
                        input_size = int(parts_of_line[2])
                        if input_size <= 0:
                            raise LogRegError('Parameters cannot be loaded from a file!')
                        self.__b = numpy.zeros(shape=(input_size,), dtype=numpy.float)
                        self.__a = 0.0
                        self.__th = 0.5
                    else:  # if the size of the input characteristic vector has already been read, then we read the regression parameters themselves
                        if ind > (input_size + 1):  # the file contained too much information, this is an error
                            raise LogRegError('Parameters cannot be loaded from a file!')
                        if ind < input_size: # read ind-th logistic regression coefficient from input_size pieces
                            self.__b[ind] = float(prepared_line)
                        elif ind == input_size: # read the free member of the logistic regression
                            self.__a = float(prepared_line)
                        else:  # read the probability threshold (it should not be less than 0 or greater than 1)
                            self.__th = float(prepared_line)
                            if (self.__th < 0.0) or (self.__th > 1.0):
                                raise LogRegError('Parameters cannot be loaded from a file!')
                        ind += 1 # safely read the next parameter, and now we increase the counter
                cur_line = fp.readline() # read the next line from the file
            if ind <= (input_size + 1):
                raise LogRegError('Parameters cannot be loaded from a file!')

    def transform(self, X):
        '''
        Calculate the probabilities of assigning input objects to the first class.
        : Param X - a two-dimensional numpy.ndarray-array that describes the vectors of attributes of input objects
        (One line is one characteristic vector, the number of rows is equal to the number of input objects,
        The number of columns is equal to the number of features of the object).
        : Return one-dimensional numpy.ndarray-array that describes the probabilities of assigning input objects to the first class
        (The number of elements of this array is equal to the number of rows of the matrix X, that is, the number of input objects).
        '''
        # Check that the logistic regression parameters (coefficients and free term) are not "empty"
        if (self.__a is None) or (self.__b is None):
            raise LogRegError('Parameters have not been specified!')
        # Check that the input matrix X
        if (X is None) or ((not isinstance(X, numpy.ndarray)) and (not isinstance(X, scipy.sparse.spmatrix))) or\
                (X.ndim != 2) or (X.shape[1] != self.__b.shape[0]):
            raise LogRegError('Input data are wrong!')
        # Calculate the desired probability array
        # http://alturl.com/8kues
        result = 1.0 / (1.0 + numpy.exp(-X.dot(self.__b) - self.__a))
        print("transform", result)
        return result

    def predict(self, X):
        '''
        Recognize which of the two classes are the input objects.
        : Param X - a two-dimensional numpy.ndarray-array that describes the vectors of attributes of input objects
        (One line is one characteristic vector, the number of rows is equal to the number of input objects,
        The number of columns is equal to the number of features of the object).
        : Return one-dimensional numpy.ndarray-array that describes the results of recognition of each of the input objects in the form
        1 (the object belongs to the first class) or 0 (the object belongs to the second class). The number of elements in this array
        Is equal to the number of rows of X; The number of input objects.
        '''
        return (self.transform(X) >= self.__th).astype(numpy.float)

    def fit(self, X, y, eps=0.001, lr_max=1.0, max_iters = 1000):
        '''
        Teach logistic regression on a given training set by a gradient method.
        : Param X is a two-dimensional numpy.ndarray-array that describes the vectors of the attributes of the input objects of the learning set
        (One line - one characteristic vector, the number of rows is equal to the number of input objects, the number of columns
        Is equal to the number of features of the object).
        : Param y - one-dimensional numpy.ndarray-array that describes the desired results of recognition of each of the input
        Objects of the training set in the form 1 (the object belongs to the first class) or 0 (the object belongs to the second class)
        Class). The number of elements of this array is equal to the number of rows of the matrix X, i.e. The number of input objects.
        : Param eps - the sensitivity of the algorithm to the change in the objective function (in our case, the logarithm of the function
        Likelihood) after the next step of the algorithm. If the new value of the objective function does not exceed the old value
        More than on eps or even less than the old value, then the training stops.
        : Param lr_max is the maximum length of the learning rate coefficient (this coefficient will be adaptive, i.e.
        Automatically selected at each step in the direction of the gradient, and the allowable range of changes is
        [0; Lr_max]).
        : Param max_iters - the maximum number of steps (iterations) of the learning algorithm. If the learning algorithm is executed
        Max_iters steps, but the changes in the objective function are still great, i.e. The stop criterion is not met, then
        The training stops anyway.
        '''
        # Check whether the training set is set correctly (if not, generate an exception)
        if (X is None) or (y is None) or ((not isinstance(X, numpy.ndarray)) and
                                              (not isinstance(X, scipy.sparse.spmatrix))) or\
                (X.ndim != 2) or (not isinstance(y, numpy.ndarray)) or (y.ndim != 1) or (X.shape[0] != y.shape[0]):
            raise LogRegError('Train data are wrong!')
        # Check whether the parameters of the learning algorithm are set correctly (if not, we generate an exception)
        if (eps <= 0.0) or (lr_max <= 0.0) or (max_iters < 1):
            raise LogRegError('Train parameters are wrong!')
        # Initialize the free member and regression coefficients with random values
        # Random values ​​are taken from the uniform distribution [-0.5, 0.5]
        self.__a = numpy.random.rand(1)[0] - 0.5
        self.__b = numpy.random.rand(X.shape[1]) - 0.5
        # Calculate the log of the likelihood function at the starting point, i.e. Immediately after initialization
        f_old = self.__calculate_log_likelihood(X, y, self.__a, self.__b)
        print('{0:>5}\t{1:>17.12f}'.format(0, f_old))
        stop = False  # A flag indicating whether the stop criterion is fulfilled (at first it is not executed, of course)
        iterations_number = 1  # count of the number of steps (iterations) of the algorithm
        while not stop:  # until the break criterion is fulfilled, continue training
            gradient = self.__calculate_gradient(X, y)  # calculate the gradient at the current point
            print('fit gradient', gradient)
            lr = self.__find_best_lr(X, y, gradient, lr_max)  # calculate the optimal step in the gradient direction
            self.__a = self.__a + lr * gradient[0]  # correct the free member of the logistic regression
            self.__b = self.__b + lr * gradient[1]  # correct logistic regression coefficients
            # Logarithm of the likelihood function at a new point (with a new free term and new regression coefficients)
            f_new = self.__calculate_log_likelihood(X, y, self.__a, self.__b)
            print('{0:>5}\t{1:>17.12f}'.format(iterations_number, f_new))
            # If the log of the likelihood function has increased slightly or even decreased, then all is enough to learn
            if (f_new - f_old) < eps:
                stop = True
            # If the log-likelihood of the likelihood function has increased substantially, then we check the number of steps of the algorithm
            else:
                f_old = f_new
                iterations_number += 1  # increase the number of steps count
                if iterations_number >= max_iters:  # if the number of steps in the algorithm is too large, then all
                    stop = True
        # Display the reason why the learning algorithm was completed
        if iterations_number < max_iters:
            print('The algorithm is stopped owing to very small changes of log-likelihood function.')
        else:
            print('The algorithm is stopped after the maximum number of iterations.')
        self.__th = self.__calc_best_th(y, self.transform(X))

    def __calculate_log_likelihood(self, X, y, a, b):
        '''
        Calculate the logarithm of the likelihood function on a given training set for given regression parameters
        (Ie here as regression parameters - free term and coefficients - the corresponding
        Method arguments, not the attributes of the class self .__ a and self .__ b).
        : Param X is a two-dimensional numpy.ndarray-array that describes the vectors of the attributes of the input objects of the learning set
        (One line - one characteristic vector, the number of rows is equal to the number of input objects, the number of columns
        Is equal to the number of features of the object).
        : Param y - one-dimensional numpy.ndarray-array that describes the desired results of recognition of each of the input
        Objects of the training set in the form 1 (the object belongs to the first class) or 0 (the object belongs to the second class)
        Class). The number of elements of this array is equal to the number of rows of the matrix X, i.e. The number of input objects.
        : Param a is the free member of the logistic regression.
        : Param b - one-dimensional numpy.ndarray-array of logistic regression coefficients.
        : Return The logarithm of the likelihood function.
        '''
        eps = 0.000001 # small number that prevents zero under the logarithm
        p = 1.0 / (1.0 + numpy.exp(-X.dot(b) - a))
        print('__calculate_log_likelihood p', p)
        return numpy.sum(y * numpy.log(p + eps) + (1.0 - y) * numpy.log(1.0 - p + eps))

    def __calculate_gradient(self, X, y):
        '''
        Calculate the gradient from the log of the likelihood function on the given training set.
        : Param X is a two-dimensional numpy.ndarray-array that describes the vectors of the attributes of the input objects of the learning set
        (One line - one characteristic vector, the number of rows is equal to the number of input objects, the number of columns
        Is equal to the number of features of the object).
        : Param y - one-dimensional numpy.ndarray-array that describes the desired results of recognition of each of the input
        Objects of the training set in the form 1 (the object belongs to the first class) or 0 (the object belongs to the second class)
        Class). The number of elements of this array is equal to the number of rows of the matrix X, i.e. The number of input objects.
        : Return The gradient from the log of the likelihood function, represented as a two-element tuple, is the first
        The element of which is the partial derivative with respect to the free regression term (real number), and the second
        Element - the vector of partial derivatives with respect to the corresponding regression coefficients (one-dimensional
        Numpy.ndarray-array of real numbers).
        '''
        p = 1.0 / (1.0 + numpy.exp(-X.dot(self.__b) - self.__a))
        da = numpy.sum(y - p)
        db = X.transpose().dot(y - p)
        return (da, db)

    def __find_best_lr(self, X, y, gradient, lr_max):
        '''
        By the method of the golden section, find the optimal step of changing the regression parameters in the direction of the gradient
        (I.e., the optimum learning rate coefficient).
        : Param X is a two-dimensional numpy.ndarray-array that describes the vectors of the attributes of the input objects of the learning set
        (One line - one characteristic vector, the number of rows is equal to the number of input objects, the number of columns
        Is equal to the number of features of the object).
        : Param y - one-dimensional numpy.ndarray-array that describes the desired results of recognition of each of the input
        Objects of the training set in the form 1 (the object belongs to the first class) or 0 (the object belongs to the second class)
        Class). The number of elements of this array is equal to the number of rows of the matrix X, i.e. The number of input objects.
        : Param gradient - the gradient from the logarithm of the likelihood function, represented as a two-element tuple,
        The first element of which is the partial derivative with respect to the free regression term (real number), and
        The second element is the vector of partial derivatives with respect to the corresponding regression coefficients (one-dimensional
        Numpy.ndarray-array of real numbers).
        : Param lr_max is the maximum permissible rate of learning, i.e. Upper limit of search range
        The optimal value of this coefficient (the lower bound is always zero).
        : Return The optimal value of the learning speed coefficient (real number).
        '''
        lr_min = 0.0
        theta = (1.0 + math.sqrt(5.0)) / 2.0
        eps = 0.00001 * (lr_max - lr_min)
        lr1 = lr_max - (lr_max - lr_min) / theta
        lr2 = lr_min + (lr_max - lr_min) / theta
        while abs(lr_min - lr_max) >= eps:
            y1 = self.__calculate_log_likelihood(X, y, self.__a + lr1 * gradient[0], self.__b + lr1 * gradient[1])
            y2 = self.__calculate_log_likelihood(X, y, self.__a + lr2 * gradient[0], self.__b + lr2 * gradient[1])
            if y1 <= y2:
                lr_min = lr1
                lr1 = lr2
                lr2 = lr_min + (lr_max - lr_min) / theta
            else:
                lr_max = lr2
                lr2 = lr1
                lr1 = lr_max - (lr_max - lr_min) / theta
        return (lr_max - lr_min) / 2.0

    def __calc_quality(self, y_target, y_real):
        n = y_target.shape[0]
        quality = {'tp': 0, 'tn': 0, 'fp': 0, 'fn': 0}
        for ind in range(n):
            if y_target[ind] > 0.0:
                if y_real[ind] > 0.0:
                    quality['tp'] += 1
                else:
                    quality['fn'] += 1
            else:
                if y_real[ind] > 0.0:
                    quality['fp'] += 1
                else:
                    quality['tn'] += 1
        return quality

    def __calc_best_th(self, y_target, y_real):
        best_th = 0.0
        min_dist = 1.0
        for th in map(lambda a: float(a) / 100.0, range(101)):
            quality = self.__calc_quality(y_target, (y_real >= th).astype(numpy.float))
            tpr = float(quality['tp']) / float(quality['tp'] + quality['fn'])
            fpr = float(quality['fp']) / float(quality['tn'] + quality['fp'])
            dist = math.sqrt((0.0 - fpr) * (0.0 - fpr) + (1.0 - tpr) * (1.0 - tpr))
            if dist < min_dist:
                min_dist = dist
                best_th = th
        return best_th

def load_mnist_for_demo(sparse=False):
    '''
    Load MNIST data to demonstrate the use of logistic regression for recognition
    Handwritten figures from 0 to 9 (total ten classes, 60 thousand teaching pictures and 10 thousand test pictures).
    : Param sparse - a flag indicating whether to represent a set of feature vectors in the form of a sparse matrix
    Scipy.sparse.csr_matrix or as an ordinary matrix numpy.ndarray.
    : Return A tuple of two elements: a learning set and a test set. Each of the sets - both teaching and
    Test - is also specified as a two-element tuple, the first element of which is a set of vectors
    Attributes of input objects (two-dimensional numpy.ndarray-array, the number of rows in which is equal to the number of input objects, and
    The number of columns is equal to the number of features of the object), and the second element is the set of desired output signals for
    Each of the corresponding input objects (one-dimensional numpt.ndarray-array, the number of elements in which is equal to the number
    Input objects).
    '''
    from sklearn.datasets import fetch_mldata  # import a special module from the library ScikitLearn
    # Load MNIST from the current directory or the Internet, if in the current directory of this data there is no
    mnist = fetch_mldata('MNIST original', data_home='.')
    # We get and normalize the feature vectors for the first 60 thousand pictures from MNIST used for training
    # (Pixel brightness matrix 28x28 -> one-dimensional feature vector 784)
    if sparse:
        X_train = scipy.sparse.csr_matrix(mnist.data[0:60000].astype(numpy.float) / 255.0)
    else:
        X_train = mnist.data[0:60000].astype(numpy.float) / 255.0
    y_train = mnist.target[0:60000]  # get the desired outputs (numbers from 0 to 9) for 60,000 training pictures
    # We get and normalize the feature vectors for the next 10 thousand pictures from MNIST used for testing
    # (Pixel brightness matrix 28x28 -> one-dimensional feature vector 784)
    if sparse:
        X_test = scipy.sparse.csr_matrix(mnist.data[60000:].astype(numpy.float) / 255.0)
    else:
        X_test = mnist.data[60000:].astype(numpy.float) / 255.0
    y_test = mnist.target[60000:]  # get the desired outputs (numbers from 0 to 9) for 10 thousand test images
    return ((X_train, y_train), (X_test, y_test))


if __name__ == '__main__':
    # If we use this module as the main module, and not just as a Python library, then run the demo on MNIST
    import os.path  # we import a standard module for working with files
    train_set, test_set = load_mnist_for_demo(True)  # load learning and test data MNIST
    # For 10-class classification create 10 binary (2-class) classifiers based on logistic regression
    classifiers = list()
    for recognized_class in range(10):
        classifier_name = 'log_reg_for_MNIST_{0}.txt'.format(recognized_class)
        new_classifier = LogisticRegression()
        if os.path.exists(classifier_name):
            new_classifier.load(classifier_name)
        else:
            new_classifier.fit(train_set[0], (train_set[1] == recognized_class).astype(numpy.float))
            new_classifier.save(classifier_name)
        classifiers.append(new_classifier)
    # On the test set, we calculate the results of recognition of figures by a team of 10 trained logistic regressions
    # (The principle of decision making by such a collective: the input vector of attributes is considered to be related to that class whose
    # Logistic regression gave the highest probability).
    n_test_samples = test_set[0].shape[0]
    outputs = numpy.empty((n_test_samples, 10), dtype=numpy.float)
    for recognized_class in range(10):
        outputs[:, recognized_class] = classifiers[recognized_class].transform(test_set[0])
    results = outputs.argmax(1)
    # Compare the results obtained with the reference ones and estimate the percentage of errors of the collective of logistic regressions
    n_errors = numpy.sum(results != test_set[1])
    print('Errors on test set: {0:%}'.format(float(n_errors) / float(n_test_samples)))
```

more examples:
https://github.com/Samurais/maximum-likelihood-estimation

# references

[Likelihood_function](https://en.wikipedia.org/wiki/Likelihood_function)

[似然函数](https://zh.wikipedia.org/wiki/%E4%BC%BC%E7%84%B6%E5%87%BD%E6%95%B0)

[Likelihood & LogLikelihood](https://onlinecourses.science.psu.edu/stat504/node/27)

[Maximum likelihood linear regression tensorflow
](https://stackoverflow.com/questions/41885665/maximum-likelihood-linear-regression-tensorflow)

[What is the difference between “likelihood” and “probability”?](https://stats.stackexchange.com/questions/2641/what-is-the-difference-between-likelihood-and-probability)
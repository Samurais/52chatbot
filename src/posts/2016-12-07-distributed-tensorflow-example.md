---
layout: post
title: "TensorFlow多机分布式部署"
excerpt: "A brief tutorial on how to do asynchronous and data parallel training using three worker machines."
category: development
tags: [tensorflow]
disqus: true
---

> Original Link - http://ischlag.github.io/2016/06/12/async-distributed-tensorflow/

---
### TL;DR;
A brief tutorial on how to do asynchronous and data parallel training using three worker machines with each one using a GTX 960 GPU (2GB) and one parameter server with no GPU. I use a simple sigmoid network with a small learning rate to measure performance differences on MNIST. The goal is not to achieve a high accuracy but to learn about tensorflows distribution capabilities. In this unscientific evaluation, we train the network for 20 epochs using only one worker as the baseline (0.42). **Accuracy increases by 16% (0.58) using two workers and by 23% (0.65) using 3 workers**. This toy example takes ~170s to compute (but more workers need more time to initialize).

### Context
The version of tensorflow used here is 0.8.0 and I recommend to study the official tensorflow [tutorial](https://www.tensorflow.org/versions/r0.8/how_tos/distributed/index.html), as well as, to look at official tensorflow [models](https://github.com/tensorflow/models/) which come with distributed learning capabilities. 

The code used builds on my previous example [here]({% post_url 2016-06-03-simple-neural-network-in-tensorflow %}) and [here]({% post_url 2016-06-04-how-to-use-tensorboard %}). I will only touch on the new parts which are relevant for distributed training.

### Distributed Training

There are different ways to train a network in a distributed fashion. The simplest approach is to **share all the model parameters across all workers while parallelising data and gradient updates**. In a synchronised setting, several batches are processed at the same time. Once all the workers are done, the parameter updates are averaged and the update is performed only once. In an asynchronised setting, every worker will update the model parameters once it has finished and not wait. I had trouble getting a synchronised setting to work and once I managed to run something it was understandably slower but didn't perform better. 

![](http://ischlag.github.io/images/sync_async_tensorflow_diagram.png)
### TensorFlow Jargon and Implementation

If you run a tensorflow script distributed (i.e. in a **cluster**) it is important that every machine knows who is who and who am I. The script below will not start running until all the machines of our cluster are online. The cluster specification is the same for all machines and is usually made up of parameter servers and workers. While parameter servers only maintain the shared parameters, workers are performing some or all computations of our graph.

```python
# cluster specification
parameter_servers = ["pc-01:2222"]
workers = [ "pc-02:2222", 
            "pc-03:2222",
            "pc-04:2222"]
cluster = tf.train.ClusterSpec({"ps":parameter_servers, "worker":workers})
```
_ps_ and _workers_ are called **jobs** which is basically just a container for one or several **tasks**. The task is a unique thing the worker will do. If we wanted, we could add several tasks running on the same machine. This might make sense if you have e.g. multiple GPUs on one machine. In this example, all the tasks will include the complete graph of our model but if you want to parallise the model instead of the data you'd have to change what every task does. Next, we need to initialize the running machine.

```python
# input flags
tf.app.flags.DEFINE_string("job_name", "", "Either 'ps' or 'worker'")
tf.app.flags.DEFINE_integer("task_index", 0, "Index of task within the job")
FLAGS = tf.app.flags.FLAGS

# start a server for a specific task
server = tf.train.Server(cluster, 
                          job_name=FLAGS.job_name,
                          task_index=FLAGS.task_index)
```
Make sure that you run the correct task on the current machine. In our example, pc-02 should be a worker with task_index 0. What follows in our code is the configuration parameters and loading the mnist data as we have seen before. If the current script is run on a parameters server all we have to do is to call server.join() in order for it to join the cluster. 

What follows are some configuration variables. Next, we are going to define the computation for every worker. Since we are going to compute the whole model on all the devices we will add the scope of all workers.

```python
  with tf.device(tf.train.replica_device_setter(
    worker_device="/job:worker/task:%d" % FLAGS.task_index,
    cluster=cluster)):
```
What follows is the implemented model. This is just slightly different to what we have been working with so far. We include a global_step variable which will increment by one with every update to better keep track of them. Furthermore, we also set the random seed to 1 to better compare different cluster configurations. However, because of the threads used by tensorflow internally this doesn't make the script deterministic so don't expect the exact same results after every run. I've also added the global_step variable to the optimizer and the following supervisor. 

After we have done this we need to get a session in order to run our training cycles similar to what we already had. In a distributed setting one machine will be the **chief**. The chief is a worker machine (in our case task 0) which manages the rest of the cluster. The session is handled by the chief i.e. the supervisor object.

```python
  sv = tf.train.Supervisor(is_chief=(FLAGS.task_index == 0),
                            global_step=global_step,
                            init_op=init_op)
```
The supervisor object has several parameters which are supposed to simplify things ([see here](https://www.tensorflow.org/versions/r0.9/api_docs/python/train.html#Supervisor)) but in my case adding e.g. the summary_op to the supervisor as a parameter together with a log path didn't work. Some aspects here felt buggy and there were some open issues on Github as well. We can, however, do our logs as we did before and continue.

We can now in a similar way obtain a session using the following command.

```python
  with sv.prepare_or_wait_for_session(server.target) as sess:
```

That's it! The rest of our code is fairly similar. You can find the complete code [here](https://github.com/ischlag/distributed-tensorflow-example) or below.

```python
'''
Distributed Tensorflow example of using data parallelism and share model parameters.
Trains a simple sigmoid neural network on mnist for 20 epochs on three machines using one parameter server. 

Change the hardcoded host urls below with your own hosts. 
Run like this: 

pc-01$ python example.py --job-name="ps" --task_index=0 
pc-02$ python example.py --job-name="worker" --task_index=0 
pc-03$ python example.py --job-name="worker" --task_index=1 
pc-04$ python example.py --job-name="worker" --task_index=2 

More details here: ischlag.github.io
'''

from __future__ import print_function

import tensorflow as tf
import sys
import time

# cluster specification
parameter_servers = ["pc-01:2222"]
workers = [ "pc-02:2222", 
      "pc-03:2222",
      "pc-04:2222"]
cluster = tf.train.ClusterSpec({"ps":parameter_servers, "worker":workers})

# input flags
tf.app.flags.DEFINE_string("job_name", "", "Either 'ps' or 'worker'")
tf.app.flags.DEFINE_integer("task_index", 0, "Index of task within the job")
FLAGS = tf.app.flags.FLAGS

# start a server for a specific task
server = tf.train.Server(cluster, 
                          job_name=FLAGS.job_name,
                          task_index=FLAGS.task_index)

# config
batch_size = 100
learning_rate = 0.001
training_epochs = 20
logs_path = "/tmp/mnist/1"

# load mnist data set
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets('MNIST_data', one_hot=True)

if FLAGS.job_name == "ps":
  server.join()
elif FLAGS.job_name == "worker":

  # Between-graph replication
  with tf.device(tf.train.replica_device_setter(
    worker_device="/job:worker/task:%d" % FLAGS.task_index,
    cluster=cluster)):

    # count the number of updates
    global_step = tf.get_variable('global_step', [], 
                                initializer = tf.constant_initializer(0), 
                                trainable = False)

    # input images
    with tf.name_scope('input'):
      # None -> batch size can be any size, 784 -> flattened mnist image
      x = tf.placeholder(tf.float32, shape=[None, 784], name="x-input")
      # target 10 output classes
      y_ = tf.placeholder(tf.float32, shape=[None, 10], name="y-input")

    # model parameters will change during training so we use tf.Variable
    tf.set_random_seed(1)
    with tf.name_scope("weights"):
      W1 = tf.Variable(tf.random_normal([784, 100]))
      W2 = tf.Variable(tf.random_normal([100, 10]))

    # bias
    with tf.name_scope("biases"):
      b1 = tf.Variable(tf.zeros([100]))
      b2 = tf.Variable(tf.zeros([10]))

    # implement model
    with tf.name_scope("softmax"):
      # y is our prediction
      z2 = tf.add(tf.matmul(x,W1),b1)
      a2 = tf.nn.sigmoid(z2)
      z3 = tf.add(tf.matmul(a2,W2),b2)
      y  = tf.nn.softmax(z3)

    # specify cost function
    with tf.name_scope('cross_entropy'):
      # this is our cost
      cross_entropy = tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(y), reduction_indices=[1]))

    # specify optimizer
    with tf.name_scope('train'):
      # optimizer is an "operation" which we can execute in a session
      grad_op = tf.train.GradientDescentOptimizer(learning_rate)
      '''
      rep_op = tf.train.SyncReplicasOptimizer(grad_op, 
                                          replicas_to_aggregate=len(workers),
                                          replica_id=FLAGS.task_index, 
                                          total_num_replicas=len(workers),
                                          use_locking=True
                                          )
      train_op = rep_op.minimize(cross_entropy, global_step=global_step)
      '''
      train_op = grad_op.minimize(cross_entropy, global_step=global_step)
      
    '''
    init_token_op = rep_op.get_init_tokens_op()
    chief_queue_runner = rep_op.get_chief_queue_runner()
    '''

    with tf.name_scope('Accuracy'):
      # accuracy
      correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
      accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

    # create a summary for our cost and accuracy
    tf.scalar_summary("cost", cross_entropy)
    tf.scalar_summary("accuracy", accuracy)

    # merge all summaries into a single "operation" which we can execute in a session 
    summary_op = tf.merge_all_summaries()
    init_op = tf.initialize_all_variables()
    print("Variables initialized ...")

  sv = tf.train.Supervisor(is_chief=(FLAGS.task_index == 0),
                            global_step=global_step,
                            init_op=init_op)

  begin_time = time.time()
  frequency = 100
  with sv.prepare_or_wait_for_session(server.target) as sess:
    '''
    # is chief
    if FLAGS.task_index == 0:
      sv.start_queue_runners(sess, [chief_queue_runner])
      sess.run(init_token_op)
    '''
    # create log writer object (this will log on every machine)
    writer = tf.train.SummaryWriter(logs_path, graph=tf.get_default_graph())
        
    # perform training cycles
    start_time = time.time()
    for epoch in range(training_epochs):

      # number of batches in one epoch
      batch_count = int(mnist.train.num_examples/batch_size)

      count = 0
      for i in range(batch_count):
        batch_x, batch_y = mnist.train.next_batch(batch_size)
        
        # perform the operations we defined earlier on batch
        _, cost, summary, step = sess.run(
                        [train_op, cross_entropy, summary_op, global_step], 
                        feed_dict={x: batch_x, y_: batch_y})
        writer.add_summary(summary, step)

        count += 1
        if count % frequency == 0 or i+1 == batch_count:
          elapsed_time = time.time() - start_time
          start_time = time.time()
          print("Step: %d," % (step+1), 
                " Epoch: %2d," % (epoch+1), 
                " Batch: %3d of %3d," % (i+1, batch_count), 
                " Cost: %.4f," % cost, 
                " AvgTime: %3.2fms" % float(elapsed_time*1000/frequency))
          count = 0

    print("Test-Accuracy: %2.2f" % sess.run(accuracy, feed_dict={x: mnist.test.images, y_: mnist.test.labels}))
    print("Total Time: %3.2fs" % float(time.time() - begin_time))
    print("Final Cost: %.4f" % cost)

  sv.stop()
  print("done")
```
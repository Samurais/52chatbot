---
layout: post
title: "Items and Model Understanding in Tensorflow"
excerpt: "介绍tensor, tf.placeholder, tf.flag, tf.name_scope, tf.session等概念。"
category: research
tags: [tensorflow]
disqus: true
---

**tensor**: Tensors are like geometric vectors, scalars, multidimensional array and other tensors. We can do dot product, the cross product, and linear maps between tensors. The first-order tensor is scalar; second-order is a vector， and third-tensor is three-dimension array. The order (also degree or rank) of a tensor is the dimensionality of the array.

**tf.placeholder(dtype, shape=None, name=None)**: tensorflow offer placeholder, and it need data to pass when it is executed. For example, we can provide a placeholder for a tensor, ```x = tf.placeholder(tf.float32, shape=(1024, 1024))```.

**tf.flag**: tf.app.flags is somehow used to configure a network, and is similar to python-gflags.

**tf.name_scope**: Typical TensorFlow graphs can have many thousands of nodes--far too many to see easily all at once, or even to lay out using standard graph tools. To simplify, variable names can be scoped and the visualization uses this information to define a hierarchy on the nodes in the graph. We use tf.name_scope to structure nodes.

**tf.session**: Once all of the build preparation has been completed and all of the necessary ops generated, a tf.Session is created for running the graph```sess = tf.Session()```.
 
Alternately, a Session may be generated into a with block for scoping:```with tf.Session() as sess:```
The empty parameter to session indicates that this code will attach to (or create if not yet created) the default local session.

Immediately after creating the session, all of the tf.Variable instances are initialized by calling sess.run() on their initialization op.
```
init = tf.initialize_all_variables()
sess.run(init)
```
**tf.reshape(tensor, shape, name=None)**: change the tensor's shape. For example:
```
# tensor ‘t’ is [1, 2, 3, 4, 5, 6, 7, 8, 9]
# tensor ‘t’ has shape [9]
reshape(t, [3, 3]) ==>
[[1, 2, 3],
[4, 5, 6],
[7, 8, 9]]
#if shape has [-1],it means to make the dimension to be 9.
reshape(t, [2, -1]) ==>
[[1, 1, 1, 2, 2, 2, 3, 3, 3],
[4, 4, 4, 5, 5, 5, 6, 6, 6]]
```
**tf.cast(x, dtype, name=None)**: change x or x.values to dtype.
```
# tensor a is [1.8, 2.2], dtype=tf.float
tf.cast(a, tf.int32) ==> [1, 2] # dtype=tf.int32
```
**tf.nn.rnn_cell.BasicLSTMCell**:

First,we should know what is an RNN cell.

  The definition of cell in this package differs from the definition used in the literature. In the literature, cell refers to an object with a single scalar output. The definition in this package refers to a horizontal array of such units. **An RNN cell**, in the most abstract setting, **is anything that has a state and performs some operation that takes a matrix of inputs.**This operation results in an output matrix with `self.output_size` columns. If `self.state_size` is an integer, this operation also results in a new state matrix with `self.state_size` columns.  If `self.state_size` is a
  tuple of integers, then it results in a tuple of `len(state_size)` state
  matrices, each with a column size corresponding to values in `state_size`.

  This module provides a number of basic commonly used RNN cells, such as LSTM (Long Short Term Memory) or GRU (Gated Recurrent Unit), and a number of operators that allow add dropouts, projections, or embeddings for inputs. Constructing multi-layer cells is supported by the class `MultiRNNCell`, or by calling the `rnn` ops several times.

 state: if `self.state_size` is an integer, this should be a `2-D Tensor`with shape `[batch_size x self.state_size]`.  Otherwise, if `self.state_size` is a tuple of integers, this should be a tuple with shapes `[batch_size x s] for s in self.state_size`.

For BasicLSTMCell in tensorflow official websites, it explain in code like this:
```
class BasicRNNCell(RNNCell):
  """The most basic RNN cell."""

  def __init__(self, num_units, input_size=None, activation=tanh):
    if input_size is not None:
      logging.warn("%s: The input_size parameter is deprecated.", self)
    self._num_units = num_units
    self._activation = activation

  @property
  def state_size(self): 
    return self._num_units

  @property
  def output_size(self):
    return self._num_units

  def __call__(self, inputs, state, scope=None):
    """Most basic RNN: output = new_state = act(W * input + U * state + B)."""
    with vs.variable_scope(scope or "basic_rnn_cell"):
      output = self._activation(
          _linear([inputs, state], self._num_units, True, scope=scope))
    return output, output
```

We can know the core function of of BasicRNNCell is to get new_state value use `output = new_state = act(W * input + U * state + B)`.
**BasicLSTMCell**: The LSTM does have the ability to remove or add information to the cell state, carefully regulated by structures called gates. Gates are a way to optionally let information through. They are composed out of a sigmoid neural net layer and a pointwise multiplication operation.
The sigmoid layer outputs numbers between zero and one, describing how much of each component should be let through. A value of zero means “let nothing through,” while a value of one means “let everything through!”

An LSTM has three of these gates, to protect and control the cell state, including **forget gate**,**input gate** and **output gate**. The **BasicLSTMCell** is used to excute the operations as follows to get new_state:
```
class BasicLSTMCell(RNNCell):
  """Basic LSTM recurrent network cell.

  The implementation is based on: http://arxiv.org/abs/1409.2329.

  We add forget_bias (default: 1) to the biases of the forget gate in order to
  reduce the scale of forgetting in the beginning of the training.

  It does not allow cell clipping, a projection layer, and does not
  use peep-hole connections: it is the basic baseline.

  For advanced models, please use the full LSTMCell that follows.
  """

  def __init__(self, num_units, forget_bias=1.0, input_size=None,
               state_is_tuple=True, activation=tanh):
    """Initialize the basic LSTM cell.

    Args:
      num_units: int, The number of units in the LSTM cell.
      forget_bias: float, The bias added to forget gates (see above).
      input_size: Deprecated and unused.
      state_is_tuple: If True, accepted and returned states are 2-tuples of
        the `c_state` and `m_state`.  If False, they are concatenated
        along the column axis.  The latter behavior will soon be deprecated.
      activation: Activation function of the inner states.
    """
    if not state_is_tuple:
      logging.warn("%s: Using a concatenated state is slower and will soon be "
                   "deprecated.  Use state_is_tuple=True.", self)
    if input_size is not None:
      logging.warn("%s: The input_size parameter is deprecated.", self)
    self._num_units = num_units
    self._forget_bias = forget_bias
    self._state_is_tuple = state_is_tuple
    self._activation = activation

  @property
  def state_size(self):
    return (LSTMStateTuple(self._num_units, self._num_units)
            if self._state_is_tuple else 2 * self._num_units)

  @property
  def output_size(self):
    return self._num_units

  def __call__(self, inputs, state, scope=None):
    """Long short-term memory cell (LSTM)."""
    with vs.variable_scope(scope or "basic_lstm_cell"):
      # Parameters of gates are concatenated into one multiply for efficiency.
      if self._state_is_tuple:
        c, h = state
      else:
        c, h = array_ops.split(1, 2, state)
      concat = _linear([inputs, h], 4 * self._num_units, True, scope=scope)

      # i = input_gate, j = new_input, f = forget_gate, o = output_gate
      i, j, f, o = array_ops.split(1, 4, concat)

      new_c = (c * sigmoid(f + self._forget_bias) + sigmoid(i) *
               self._activation(j))
      new_h = self._activation(new_c) * sigmoid(o)

      if self._state_is_tuple:
        new_state = LSTMStateTuple(new_c, new_h)
      else:
        new_state = array_ops.concat_v2([new_c, new_h], 1)
      return new_h, new_state
```
**tf.nn.rnn_cell.MultiRNNCell**: Create a RNN cell composed sequentially of a number of RNNCells.

(All codes about RNNcell in tensorflow/python/ops/rnn _ cell _ impl.py)

**seq2seq model**: for sequence_loss function, the weighted cross-entropy loss is a sequence of logits, batch-collapsed.

  Args:

    logits: List of 2D Tensors of shape [batch_size x num_decoder_symbols].

    targets: List of 1D batch-sized int32 Tensors of the same length as logits.

    weights: List of 1D batch-sized float-Tensors of the same length as logits.

    average_across_timesteps: If set, divide the returned cost by the total label weight.

    average_across_batch: If set, divide the returned cost by the batch size.

    softmax_loss_function: Function (inputs-batch, labels-batch) -> loss-batch  to be used instead of the standard softmax (the default if this is None).

    name: Optional name for this operation, defaults to "sequence _ loss".

  Returns:

    A scalar float Tensor: The average log-perplexity per symbol (weighted).
  Raises:

    ValueError: If len(logits) is different from len(targets) or len(weights).
```
def sequence_loss(logits,
                  targets,
                  weights,
                  average_across_timesteps=True,
                  average_across_batch=True,
                  softmax_loss_function=None,
                  name=None):
 
  with ops.name_scope(name, "sequence_loss", logits + targets + weights):
    cost = math_ops.reduce_sum(
        sequence_loss_by_example(
            logits,
            targets,
            weights,
            average_across_timesteps=average_across_timesteps,
            softmax_loss_function=softmax_loss_function))
    if average_across_batch:
      batch_size = array_ops.shape(targets[0])[0]
      return cost / math_ops.cast(batch_size, cost.dtype)
    else:
      return cost
(tensorflow/python/ops/seq2seq.py)
```


#### Reference s
* [name_scope](https://www.tensorflow.org/versions/r0.11/how_tos/graph_viz/index.html#name-scoping-and-nodes)
* [tf.session](https://www.tensorflow.org/versions/r0.11/tutorials/mnist/tf/index.html#the-session)
* [some items in tensorflow ](http://blog.csdn.net/lenbow/article/details/52152766)
* [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)

 
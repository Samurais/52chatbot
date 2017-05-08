webpackJsonp([17,26],{276:function(e,t){e.exports={rawContent:'\n**tensor**: Tensors are like geometric vectors, scalars, multidimensional array and other tensors. We can do dot product, the cross product, and linear maps between tensors. The first-order tensor is scalar; second-order is a vector， and third-tensor is three-dimension array. The order (also degree or rank) of a tensor is the dimensionality of the array.\n\n**tf.placeholder(dtype, shape=None, name=None)**: tensorflow offer placeholder, and it need data to pass when it is executed. For example, we can provide a placeholder for a tensor, ```x = tf.placeholder(tf.float32, shape=(1024, 1024))```.\n\n**tf.flag**: tf.app.flags is somehow used to configure a network, and is similar to python-gflags.\n\n**tf.name_scope**: Typical TensorFlow graphs can have many thousands of nodes--far too many to see easily all at once, or even to lay out using standard graph tools. To simplify, variable names can be scoped and the visualization uses this information to define a hierarchy on the nodes in the graph. We use tf.name_scope to structure nodes.\n\n**tf.session**: Once all of the build preparation has been completed and all of the necessary ops generated, a tf.Session is created for running the graph```sess = tf.Session()```.\n \nAlternately, a Session may be generated into a with block for scoping:```with tf.Session() as sess:```\nThe empty parameter to session indicates that this code will attach to (or create if not yet created) the default local session.\n\nImmediately after creating the session, all of the tf.Variable instances are initialized by calling sess.run() on their initialization op.\n```\ninit = tf.initialize_all_variables()\nsess.run(init)\n```\n**tf.reshape(tensor, shape, name=None)**: change the tensor\'s shape. For example:\n```\n# tensor ‘t’ is [1, 2, 3, 4, 5, 6, 7, 8, 9]\n# tensor ‘t’ has shape [9]\nreshape(t, [3, 3]) ==>\n[[1, 2, 3],\n[4, 5, 6],\n[7, 8, 9]]\n#if shape has [-1],it means to make the dimension to be 9.\nreshape(t, [2, -1]) ==>\n[[1, 1, 1, 2, 2, 2, 3, 3, 3],\n[4, 4, 4, 5, 5, 5, 6, 6, 6]]\n```\n**tf.cast(x, dtype, name=None)**: change x or x.values to dtype.\n```\n# tensor a is [1.8, 2.2], dtype=tf.float\ntf.cast(a, tf.int32) ==> [1, 2] # dtype=tf.int32\n```\n**tf.nn.rnn_cell.BasicLSTMCell**:\n\nFirst,we should know what is an RNN cell.\n\n  The definition of cell in this package differs from the definition used in the literature. In the literature, cell refers to an object with a single scalar output. The definition in this package refers to a horizontal array of such units. **An RNN cell**, in the most abstract setting, **is anything that has a state and performs some operation that takes a matrix of inputs.**This operation results in an output matrix with `self.output_size` columns. If `self.state_size` is an integer, this operation also results in a new state matrix with `self.state_size` columns.  If `self.state_size` is a\n  tuple of integers, then it results in a tuple of `len(state_size)` state\n  matrices, each with a column size corresponding to values in `state_size`.\n\n  This module provides a number of basic commonly used RNN cells, such as LSTM (Long Short Term Memory) or GRU (Gated Recurrent Unit), and a number of operators that allow add dropouts, projections, or embeddings for inputs. Constructing multi-layer cells is supported by the class `MultiRNNCell`, or by calling the `rnn` ops several times.\n\n state: if `self.state_size` is an integer, this should be a `2-D Tensor`with shape `[batch_size x self.state_size]`.  Otherwise, if `self.state_size` is a tuple of integers, this should be a tuple with shapes `[batch_size x s] for s in self.state_size`.\n\nFor BasicLSTMCell in tensorflow official websites, it explain in code like this:\n```\nclass BasicRNNCell(RNNCell):\n  """The most basic RNN cell."""\n\n  def __init__(self, num_units, input_size=None, activation=tanh):\n    if input_size is not None:\n      logging.warn("%s: The input_size parameter is deprecated.", self)\n    self._num_units = num_units\n    self._activation = activation\n\n  @property\n  def state_size(self): \n    return self._num_units\n\n  @property\n  def output_size(self):\n    return self._num_units\n\n  def __call__(self, inputs, state, scope=None):\n    """Most basic RNN: output = new_state = act(W * input + U * state + B)."""\n    with vs.variable_scope(scope or "basic_rnn_cell"):\n      output = self._activation(\n          _linear([inputs, state], self._num_units, True, scope=scope))\n    return output, output\n```\n\nWe can know the core function of of BasicRNNCell is to get new_state value use `output = new_state = act(W * input + U * state + B)`.\n**BasicLSTMCell**: The LSTM does have the ability to remove or add information to the cell state, carefully regulated by structures called gates. Gates are a way to optionally let information through. They are composed out of a sigmoid neural net layer and a pointwise multiplication operation.\nThe sigmoid layer outputs numbers between zero and one, describing how much of each component should be let through. A value of zero means “let nothing through,” while a value of one means “let everything through!”\n\nAn LSTM has three of these gates, to protect and control the cell state, including **forget gate**,**input gate** and **output gate**. The **BasicLSTMCell** is used to excute the operations as follows to get new_state:\n```\nclass BasicLSTMCell(RNNCell):\n  """Basic LSTM recurrent network cell.\n\n  The implementation is based on: http://arxiv.org/abs/1409.2329.\n\n  We add forget_bias (default: 1) to the biases of the forget gate in order to\n  reduce the scale of forgetting in the beginning of the training.\n\n  It does not allow cell clipping, a projection layer, and does not\n  use peep-hole connections: it is the basic baseline.\n\n  For advanced models, please use the full LSTMCell that follows.\n  """\n\n  def __init__(self, num_units, forget_bias=1.0, input_size=None,\n               state_is_tuple=True, activation=tanh):\n    """Initialize the basic LSTM cell.\n\n    Args:\n      num_units: int, The number of units in the LSTM cell.\n      forget_bias: float, The bias added to forget gates (see above).\n      input_size: Deprecated and unused.\n      state_is_tuple: If True, accepted and returned states are 2-tuples of\n        the `c_state` and `m_state`.  If False, they are concatenated\n        along the column axis.  The latter behavior will soon be deprecated.\n      activation: Activation function of the inner states.\n    """\n    if not state_is_tuple:\n      logging.warn("%s: Using a concatenated state is slower and will soon be "\n                   "deprecated.  Use state_is_tuple=True.", self)\n    if input_size is not None:\n      logging.warn("%s: The input_size parameter is deprecated.", self)\n    self._num_units = num_units\n    self._forget_bias = forget_bias\n    self._state_is_tuple = state_is_tuple\n    self._activation = activation\n\n  @property\n  def state_size(self):\n    return (LSTMStateTuple(self._num_units, self._num_units)\n            if self._state_is_tuple else 2 * self._num_units)\n\n  @property\n  def output_size(self):\n    return self._num_units\n\n  def __call__(self, inputs, state, scope=None):\n    """Long short-term memory cell (LSTM)."""\n    with vs.variable_scope(scope or "basic_lstm_cell"):\n      # Parameters of gates are concatenated into one multiply for efficiency.\n      if self._state_is_tuple:\n        c, h = state\n      else:\n        c, h = array_ops.split(1, 2, state)\n      concat = _linear([inputs, h], 4 * self._num_units, True, scope=scope)\n\n      # i = input_gate, j = new_input, f = forget_gate, o = output_gate\n      i, j, f, o = array_ops.split(1, 4, concat)\n\n      new_c = (c * sigmoid(f + self._forget_bias) + sigmoid(i) *\n               self._activation(j))\n      new_h = self._activation(new_c) * sigmoid(o)\n\n      if self._state_is_tuple:\n        new_state = LSTMStateTuple(new_c, new_h)\n      else:\n        new_state = array_ops.concat_v2([new_c, new_h], 1)\n      return new_h, new_state\n```\n**tf.nn.rnn_cell.MultiRNNCell**: Create a RNN cell composed sequentially of a number of RNNCells.\n\n(All codes about RNNcell in tensorflow/python/ops/rnn _ cell _ impl.py)\n\n**seq2seq model**: for sequence_loss function, the weighted cross-entropy loss is a sequence of logits, batch-collapsed.\n\n  Args:\n\n    logits: List of 2D Tensors of shape [batch_size x num_decoder_symbols].\n\n    targets: List of 1D batch-sized int32 Tensors of the same length as logits.\n\n    weights: List of 1D batch-sized float-Tensors of the same length as logits.\n\n    average_across_timesteps: If set, divide the returned cost by the total label weight.\n\n    average_across_batch: If set, divide the returned cost by the batch size.\n\n    softmax_loss_function: Function (inputs-batch, labels-batch) -> loss-batch  to be used instead of the standard softmax (the default if this is None).\n\n    name: Optional name for this operation, defaults to "sequence _ loss".\n\n  Returns:\n\n    A scalar float Tensor: The average log-perplexity per symbol (weighted).\n  Raises:\n\n    ValueError: If len(logits) is different from len(targets) or len(weights).\n```\ndef sequence_loss(logits,\n                  targets,\n                  weights,\n                  average_across_timesteps=True,\n                  average_across_batch=True,\n                  softmax_loss_function=None,\n                  name=None):\n \n  with ops.name_scope(name, "sequence_loss", logits + targets + weights):\n    cost = math_ops.reduce_sum(\n        sequence_loss_by_example(\n            logits,\n            targets,\n            weights,\n            average_across_timesteps=average_across_timesteps,\n            softmax_loss_function=softmax_loss_function))\n    if average_across_batch:\n      batch_size = array_ops.shape(targets[0])[0]\n      return cost / math_ops.cast(batch_size, cost.dtype)\n    else:\n      return cost\n(tensorflow/python/ops/seq2seq.py)\n```\n\n\n#### Reference s\n* [name_scope](https://www.tensorflow.org/versions/r0.11/how_tos/graph_viz/index.html#name-scoping-and-nodes)\n* [tf.session](https://www.tensorflow.org/versions/r0.11/tutorials/mnist/tf/index.html#the-session)\n* [some items in tensorflow ](http://blog.csdn.net/lenbow/article/details/52152766)\n* [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)\n\n ',metaData:{layout:"post",title:"Items and Model Understanding in Tensorflow",excerpt:"介绍tensor, tf.placeholder, tf.flag, tf.name_scope, tf.session等概念。",category:"research",tags:["tensorflow"],disqus:!0}}}});
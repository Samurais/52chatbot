---
layout: post
title: "Tensorflow tf.app.run的工作方式"
excerpt: "To run a tensorflow app, you define the input, lost fn, model and EvaluationMonitor in a main function in your module like this."
category: development
tags: [tensorflow]
disqus: true
---

To run a tensorflow app, you define the input, lost fn, model and EvaluationMonitor in a main function in your module.

Like this.

```python
import tensorflow as tf
def main(unused_argv):
  hparams = ...
  model_fn = ...
  estimator = ...
  input_fn_train = ...
  input_fn_eval = ...
  eval_metrics = ...
  eval_monitor = ...
  # Start to train
  estimator.fit

if __name__ == "__main__":
  tf.app.run()
```

Note, the last line, you need to fire **tf.app.run**. All the job are done in main. How does the main function is invoked?

## tf.app.run lays out the thing
It's just a very quick wrapper that handles flag parsing and then dispatches to your own main.
```python
https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/platform/app.py
```

[Explanation code snippets](http://stackoverflow.com/questions/33703624/how-does-tf-app-run-work)


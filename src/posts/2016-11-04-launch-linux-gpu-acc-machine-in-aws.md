---
layout: post
title: "Launch Linux( ubuntu14.04) GPU Acc machine in AWS"
excerpt: "In order to deploy network to train Deep Learning Network, a GPU Enabled machine is required. Fortunately, AWS provides GPU Accelerated Machine."
category: development
tags: [gpu, cuda, ubuntu]
disqus: true
---

# TL; DR
In order to deploy network to train Deep Learning Network, a GPU Enabled machine is required. Fortunately, AWS provides GPU Accelerated Machine.

https://aws.amazon.com/blogs/aws/new-g2-instance-type-with-4x-more-gpu-power/

Installation scripts:
[Install Nvidia Drivers, CUDNn, Python, TensorFlow on Ubuntu 16.04](https://gist.github.com/Samurais/e20a8283708d37f1d7c9a709e9332429)

# Provision Machine

* AMI
Ubuntu Server 14.04 LTS (HVM), SSD Volume Type

* Select Instance Type
![](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screen-Shot-2016-11-04-at-15.31.11.png)

http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using_cluster_computing.html

* Deploy it
![](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screen-Shot-2016-11-04-at-15.37.14.png)

# About CUDA Cores （2560）
[Nvidia GPU Product Matrix](http://wccftech.com/rumor-nvidia-pascal-gtx-1080-gddr5x-gtx-1070-f-gddr5/)
# Install TensorFlow with pip

[manual](https://www.tensorflow.org/versions/r0.11/get_started/os_setup.html#using-pip)

### 使用python3
```
# ubuntu @ dagama in ~ [2:54:27] C:1
$ cd /usr/local/bin
# ubuntu @ dagama in /usr/local/bin [2:54:46]
$ ls -l|grep pip
-rwxr-xr-x 1 root root 204 Nov  7 11:08 pip
-rwxr-xr-x 1 root root 204 Nov  7 11:08 pip2
-rwxr-xr-x 1 root root 204 Nov  7 11:08 pip2.7
$ sudo mv pip2 ~/bakup1
$ sudo mv pip2.7 ~/bakup1
# ubuntu @ dagama in /usr/local/bin [2:57:46]
$ ls -l|grep pip
-rwxr-xr-x 1 root root 204 Nov  7 11:08 pip
###尝试用pip安装模块,以查看pip是否安装成功###
$ pip install wheel
Traceback (most recent call last):
  File "/usr/local/bin/pip", line 7, in <module>
    from pip import main
ImportError: No module named 'pip
###应该是安装python3的pip? 并更新pip###
$ sudo apt-get install python3-pip
$sudo pip install --upgrade pip
$ pip --version
pip 9.0.1 from /usr/local/lib/python3.4/dist-packages (python 3.4)
```

### Install required packages
```
sudo apt-get install python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose
# 直接利用"pip install -U scikit-learn "安装scikit-learn,会提示"UnicodeDecodeError: 'ascii' codec can't decode byte 0xe2 in position 52: ordinal not in range(128)"的错误,可以先升级一下setuptools,如下
sudo pip install --upgrade setuptools
sudo pip install -U scikit-learn  # 安装成功
```
### Install tensorflow0.9.0(python3.4)
```
# Ubuntu/Linux 64-bit, GPU enabled, Python 3.4
# Requires CUDA toolkit 7.5 and CuDNN v4. For other versions, see "Install from sources" below.
$ export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow-0.9.0-cp34-cp34m-linux_x86_64.whl
# Python3
$ sudo pip3 install --upgrade $TF_BINARY_UR
```
But there is no 'configure'script at the root of the tree (in the tensorflow), so I clone the tensorflow repository, as follows:
#### Clone the TensorFlow repository
```
$ git clone https://github.com/tensorflow/tensorflow

```

# Install Drivers

https://aws.amazon.com/blogs/aws/new-g2-instance-type-with-4x-more-gpu-power/

## Install utilities

```
 sudo apt-get install wget zsh git curl ack-grep -yy
```
## Installing  NVIDIA Driver
[manual](http://www.binarytides.com/install-nvidia-drivers-ubuntu-14-04/)

![](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screenshot-from-2016-11-08-14-42-55.png)
## CUDA Driver

[manual](https://www.tensorflow.org/versions/r0.11/get_started/os_setup.html#optional-install-cuda-gpus-on-linux)

![](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screen-Shot-2016-11-04-at-16.36.17.png)

```
sudo dpkg -i cuda-repo-ubuntu1404_8.0.44-1_amd64.deb
sudo apt-get update
sudo apt-get install cuda
```

### Setup CUDA_HOME in PATH
edit /etc/profile
```
export CUDA_HOME=/usr/local/cuda
export PATH=$PATH:$CUDA_HOME/bin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CUDA_HOME/lib64
```

## CUDNN

[Install cuDNN v5.](https://developer.nvidia.com/accelerated-computing-developer)

Uncompress and copy the cuDNN files into the toolkit directory. Assuming the toolkit is installed in /usr/local/cuda, run the following commands (edited to reflect the cuDNN version you downloaded):
```
tar xvzf cudnn-8.0-linux-x64-v5.1.tgz
sudo cp cuda/include/cudnn.h /usr/local/cuda/include
sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/include/cudnn.h /usr/local/cuda/lib64/libcudnn*
cd /usr/local/cuda/lib64/
sudo rm -rf libcudnn.so libcudnn.so.5
sudo ln -s libcudnn.so.5.0.5 libcudnn.so.5
sudo ln -s libcudnn.so.5 libcudnn.so
```


## Install bazel
[manual](https://bazel.build/versions/master/docs/install.html#ubuntu)

For Ubuntu Trusty (14.04 LTS) users, since OpenJDK 8 is not available on Trusty, please install Oracle JDK 8:
```
$ sudo add-apt-repository ppa:webupd8team/java
$ sudo apt-get update
$ sudo apt-get install oracle-java8-installer
```
Note: You might need to sudo apt-get install software-properties-common if you don't have the add-apt-repository command. See [here](http://manpages.ubuntu.com/manpages/wily/man1/add-apt-repository.1.html).
```
$ sudo apt-get update && sudo apt-get install bazel
#Once installed, you can upgrade to newer version of Bazel with:
$ sudo apt-get upgrade bazel
```

## Launch tensorflow
![](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screenshot-from-2016-11-08-11-26-08.png)
## Summary



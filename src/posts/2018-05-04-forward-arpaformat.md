---
layout: post
title: "安装dynet"
excerpt: "在Mac OSX上安装dynet过程遇到的问题和解决办法"
category: development
tags: [nlp]
disqus: true
---

很多项目依赖于dynet: https://github.com/clab/dynet


## 安装依赖
```
brew install cmake hg
brew install --HEAD eigen
```

这时，eigen3被安装在 /usr/local/include/eigen3

## 安装c++版本
```
git clone https://github.com/clab/dynet.git
cd dynet
mkdir build
cd build
cmake .. -DEIGEN3_INCLUDE_DIR=/usr/local/include/eigen3 -DENABLE_CPP_EXAMPLES=ON
```

## 安装python版本
```
pip install git+https://github.com/clab/dynet#egg=dynet
```

运行python程序时遇到问题，dynet的库文件找不到。

* 进入python module 的安装路径
```
cd ~/venv-py2/lib/python2.7/site-packages
ls _dynet.so
```

链接错误的就是这个文件，修改方法

```
install_name_tool -change \
  /private/var/folders/m8/qbdvflrd3312_r3sxyc19k9r0000gn/T/pip-build-4cqyj4/dynet/build/py2.7-64bit/dynet/libdynet.dylib \
  /Users/hain/venv-py2/lib/python2.7/site-packages/libdynet.dylib _dynet.so
```

检查
```
otool -L _dynet.so
```


## 测试
```
cd dynet
python examples/xor/xor.py
```

正确结果

```
1.0
('TF', 1.0)
('FF', -1.0)
('TT', -1.0)
('FT', 1.0)
```

也可以使用docker
```
https://hub.docker.com/r/yujioshima/dynet/
```

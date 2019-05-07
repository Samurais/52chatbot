---
layout: post
title: "CMake进阶教程（一）"
excerpt: "快速开始使用CMake构建大规模项目"
category: development
tags: [cpp]
disqus: true
---

本文转载自：[【使用 CMake 组织 C++工程】2：CMake 常用命令和变量](https://elloop.github.io/tools/2016-04-10/learning-cmake-2-commands)

# 前言

前面的文章介绍了一个最简单的 CMake 工程，这篇文章将介绍一个稍微复杂一些的 CMake 工程，结合这个工程总结一下在组织一个 C/C++工程时最为常用的一些 CMake 命令和变量。对于涉及到的命令和变量，介绍的原则是点到即止，先仅需掌握基本用法即可，让工程跑起来。

上一篇文章中那个最简单的 CMake Hello World 工程，在其 CMake 脚本文件 CMakeLists.txt 中，仅有一句话：

```
add_executable(hello hello.cpp)
```

这里面的`add_executable`就是一个 CMake 命令，它的作用是添加一个可执行文件构建目标。

下面从一个 C++应用程序的编译过程为脉络对涉及到的命令和变量进行说明。

<!--more-->

为了让下面的说明举例更加容易理解，先给出本文的示例工程目录结构：

```
➜ /Users/sunyongjian1/codes/local_codes/cmake_test tree
.
├── CMakeLists.txt
├── include
│ └── util.h
├── lib
│ └── libutil.a
└── src
└── main.cpp
```

三个文件夹: include, lib, src 分别存放包含文件，库文件，源文件；一个 CMakeLists.txt 脚本。下面我的任务是编写这个脚本，使得工程包含 util.h 头文件，编译 main.cpp, 链接 libutil.a, 最终生成一个可执行文件 hello.

# 给工程起个名字

加上这句：`project(hello)`

<font color="red">解释</font>

命令：`project(<PROJECT-NAME> [LANGUAGES] [<language-name>...])`

作用：定义工程名称, 设置几个变量的名字: `PROJECT_NAME, PROJECT_SOURCE_DIR, <PROJECT-NAME>_SOURCE_DIR, PROJECT_BINARY_DIR, <PROJECT-NAME>_BINARY_DIR`, 高级用法请见参考链接 2：CMake 命令

# 让 CMake 找到我的头文件

加上这句：`include_directories(./include)`

作用：把当前目录(CMakeLists.txt 所在目录)下的 include 文件夹加入到包含路径

我习惯这样写：`include_directories(${CMAKE_CURRENT_LIST_DIR}/include)`

<font color="red">解释</font>

命令: `include_directories([AFTER|BEFORE] [SYSTEM] dir1 [dir2 ...])`

作用：

- 把 dir1, [dir2 ...]这（些）个路径添加到当前 CMakeLists 及其子 CMakeLists 的头文件包含路径中;

- AFTER 或者 BEFORE 指定了要添加的路径是添加到原有包含列表之前或之后

- 若指定 SYSTEM 参数，则把被包含的路径当做系统包含路径来处理

第二种写法里用到了`CMAKE_CURRENT_LIST_DIR`这个变量，它表示当前 CMakeLists 所在的路径.

# 让 CMake 找到我的源文件

加上： `aux_source_directory(./src ${hello_src})`

作用: 把当前路径下 src 目录下的所有源文件路径放到变量`hello_src`中

<font color="red">解释</font>

命令：`aux_source_directory(<dir> <variable>)`

作用：查找 dir 路径下的所有源文件，保存到 variable 变量中.

上面的例子中，`hello_src`是一个自定义变量，在执行了`aux_source_directory(./src ${hello_src})`之后，我就可以像这样来添加一个可执行文件：`add_executable(hello ${hello_src})`, 意思是用`hello_src`里面的所有源文件来构建 hello 可执行程序, 不用手动列出 src 目录下的所有源文件了。

<font color="red">注意：</font>

- aux_source_directory 不会递归包含子目录，仅包含指定的 dir 目录

- CMake 官方不推荐使用 aux_source_directory 及其类似命令(file(GLOB_RECURSE ...))来搜索源文件，原因是这样包含的话，如果我再在被搜索的路径下添加源文件，我不需要修改 CMakeLists 脚本，也就是说，源文件多了，而 CMakeLists 并不需要(没有)变化，也就使得构建系统不能察觉到新加的文件，除非手动重新运行 cmake，否则新添加的文件就不会被编译到项目结果中。

- 类似`include_directories()`中`CMAKE_CURRENT_LIST_DIR`的用法，也可以写成：`aux_source_directory(${CMAKE_CURRENT_LIST_DIR}/src ${hello_src})`

# 让 CMake 找到我的库文件

加上：`link_directories(${CMAKE_CURRENT_LIST_DIR}/lib)`

<font color="red">解释</font>

命令：`link_directories(directory1 directory2 ...)`

作用：不必细说，与`include_directories()`类似，这个命令添加了库包含路径。

# 告诉 CMake 我的构建目标

加上：`add_executable(${PROJECT_NAME} ${hello_src})`

<font color="red">解释</font>

命令：`add_executable(<name> [WIN32] [MACOSX_BUNDLE] [EXCLUDE_FROM_ALL] source1 [source2 ...])`

作用：目前仅需知道，其作用是使用`${hello_src}`里面的源文件来生成一个可执行文件，起名叫`${PROJECT_NAME}`, 即 hello. 在一开始定义的那个 project(hello)中的 hello。

# 告诉 CMake 我要链接哪个库文件

加上：`target_link_libraries(${PROJECT_NAME} util)`

<font color="red">解释</font>

命令：`target_link_libraries(<target> [item1 [item2 [...]]] [[debug|optimized|general] <item>] ...)`

作用：仅需知道，名字叫`${PROJECT_NAME}`这个 target 需要链接 util 这个库，会优先搜索 libutil.a(windows 上就是 util.lib), 如果没有就搜索 libutil.so(util.dll, util.dylib)'

上面的例子意思是，让 hello 去链接 util 这个库。

# 传递 FLAGS 给 C++编译器

如果我的 main.cpp 里面用到了 C++11，那么我需要告诉 CMake 在生成的 Makefile 里告诉编译器启用 C++11。与此类似，我可能也要传递其他 FLAGS 给编译器，怎么办？

答案是：设置`CMAKE_CXX_FLAGS`变量

加上：

```
set(CMAKE_CXX_COMPILER "clang++" ) # 显示指定使用的 C++编译器

set(CMAKE_CXX_FLAGS "-std=c++11") # c++11
set(CMAKE_CXX_FLAGS "-g") # 调试信息
set(CMAKE_CXX_FLAGS "-Wall") # 开启所有警告

set(CMAKE_CXX_FLAGS_DEBUG "-O0" ) # 调试包不优化
set(CMAKE_CXX_FLAGS_RELEASE "-O2 -DNDEBUG " ) # release 包优化
```

<font color="red">解释</font>

- `CMAKE_CXX_FLAGS` 是 CMake 传给 C++编译器的编译选项，通过设置这个值就好比 `g++ -std=c++11 -g -Wall`

- `CMAKE_CXX_FLAGS_DEBUG` 是除了`CMAKE_CXX_FLAGS`外，在 Debug 配置下，额外的参数

- `CMAKE_CXX_FLAGS_RELEASE` 同理，是除了`CMAKE_CXX_FLAGS`外，在 Release 配置下，额外的参数

# 开始构建

通过以上步骤， 最后，在文件头部添加 CMake 版本检查，以我的电脑上的环境为例，我的 CMake 版本是 3.0，那么我在脚本最开始加上:

`cmake_minimum_required ( VERSION 3.0)`

完整的 CMakeLists.txt 如下所示：

```
cmake_minimum_required ( VERSION 3.0)

project(hello)

include_directories(${CMAKE_CURRENT_LIST_DIR}/include)

link_directories(${CMAKE_CURRENT_LIST_DIR}/lib)

aux_source_directory(${CMAKE_CURRENT_LIST_DIR}/src ${hello_src})

add_executable(${PROJECT_NAME} ${hello_src})

target_link_libraries(${PROJECT_NAME} util)

set(CMAKE_CXX_COMPILER "clang++" ) # 显示指定使用的 C++编译器

set(CMAKE_CXX_FLAGS "-std=c++11") # c++11
set(CMAKE_CXX_FLAGS "-g") # 调试信息
set(CMAKE_CXX_FLAGS "-Wall") # 开启所有警告

set(CMAKE_CXX_FLAGS_DEBUG "-O0" ) # 调试包不优化
set(CMAKE_CXX_FLAGS_RELEASE "-O2 -DNDEBUG " ) # release 包优化
```

在 CMakeLists.txt 所在目录，新建 build 目录，并切换进 build 进行构建即可. 具体构建方法参见上一篇 CMake Hello World 的构建。

注意：生成的可执行文件路径会在 build/src 目录下，如需修改生成位置，请参考 CMake 变量`EXECUTABLE_OUTPUT_PATH`。

# 总结

本文通过一个 C++工程实例，介绍了构建过程中用到的一些 CMake 命令和变量.

后面的文章将会讲解如何构建更加复杂的 C++工程，会用到 CMake 里的 function 和其他命令和变量。

# 参考链接

- [CMake Documentation(V3.0 为例)](https://cmake.org/cmake/help/v3.0/)

- [CMake 变量](https://cmake.org/cmake/help/v3.0/manual/cmake-commands.7.html)

- [CMake 快速开始](https://github.com/chatopera/cmake-get-started)

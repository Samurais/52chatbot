---
layout: post
title: "Hadoop快速开始"
excerpt: "Hadoop实现了一个分布式文件系统（Hadoop Distributed File System），简称HDFS。Hadoop的框架最核心的设计就是：HDFS和MapReduce。HDFS为海量的数据提供了存储，则MapReduce为海量的数据提供了计算。"
category: development
tags: [bigdata]
disqus: true
---


## Version

2.8.1

## Download

```
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/core/hadoop-2.8.1/hadoop-2.8.1.tar.gz
```


## Env

```
export HADOOP_HOME=/opt/apache/hadoop
export PATH=$PATH:$HADOOP_HOME/bin
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
```


## Config

### Standalone
hadoop/etc/hadoop/hadoop-env.sh
```
export JAVA_HOME=/usr/lib/jvm/java-8-oracle
```

hadoop/etc/hadoop/mapred-site.xml
```
<configuration>
</configuration>
```

hadoop/etc/hadoop/core-site.xml
```
<configuration>
        <property>
                <name>fs.default.name</name>
                <value>hdfs://127.0.0.1:9000</value>
        </property>
</configuration>

```

hadoop/etc/hadoop/hdfs-site.xml
```
<configuration>
</configuration>
```

## Start

```
$HADOOP_HOME/bin/hdfs namenode -format
$HADOOP_HOME/bin/hdfs getconf -namenodes
$HADOOP_HOME/sbin/start-all.sh
```

Check status
```
jps
```

## Example

```
# ~/opt/apache/hadoop
## Usage
bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.1.jar wordcount

## Put file for processing
hadoop fs -put LICENSE.txt

## schedule job
bin/hadoop jar ./share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.1.jar  wordcount LICENSE.txt LICENSE.wc
hadoop fs -get LICENSE.wc
cat LICENSE.wc/part-r-00000
```

## Web Client
```
# Web UI
http://desert:8088/cluster/cluster

# Datanode
http://desert:50070/dfshealth.html#tab-overview

# Job history server
# http://www.cnblogs.com/luogankun/p/4019303.html
$HADOOP_HOME/sbin/mr-jobhistory-daemon.sh --config $HADOOP_CONF_DIR start historyserver
```

## Workflow

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/07/hadoop2.png)

![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2017/07/hadoop3.png)

## Streaming 

Hadoop Stream允许我们使用任何可执行的脚本处理按行组织的数据流，数据取自Unix的标准输入STDIN，并输出到标准输出到STDOUT。

### Example
http://www.cnblogs.com/dandingyy/archive/2013/03/01/2938442.html

Download data
```
wget http://www.nber.org/patents/Cite75_99.zip -O data/Cite75_99.zip
```

Python Streaming, RandomSample.py

```python
#!/usr/bin/env python
import sys, random

for line in sys.stdin:
    if random.randint(1, 100) <= int(sys.argv[1]):
        print line.strip()
```

Submit Job

```
bin/hadoop jar share/hadoop/tools/lib/hadoop-streaming-2.8.1.jar \
        -input data/cite75_99.txt \
        -output cite75_99_sample \
        -mapper 'RandomSample.py 10' \
        -file RandomSample.py \
        -D mapred.reduce.tasks=1
```

By default, using IdentityReducer, after job is finished, use ```getmerge``` to get final result.

## Breaking changes

### TaskTracker and JobTracker are replaced.

```
In Hadoop 2.0, the JobTracker and TaskTracker no longer exist and have been replaced by three components:

ResourceManager: a scheduler that allocates available resources in the cluster amongst the competing applications.

NodeManager: runs on each node in the cluster and takes direction from the ResourceManager. It is responsible for managing resources available on a single node.

ApplicationMaster: an instance of a framework-specific library, an ApplicationMaster runs a specific YARN job and is responsible for negotiating resources from the ResourceManager and also working with the NodeManager to execute and monitor Containers.

So as far as you are seeing ResourceManager(on NN) & NodeManager(on DN) processes you are good to go.
```
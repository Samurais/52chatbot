---
layout: post
title: "Resolve segmenter to process Chinese Dialogues"
excerpt: "During generating a word2vec model with Chinese data, it is very important to segment the Chinese sentences."
category: development
tags: [corpus, nlp, 分词]
disqus: true
---

During generating a word2vec model with Chinese data, it is very important to segment the Chinese sentences.

Fortunately, there are some awesome utilities which are introduced online.


# Java
Built by Stanford NLP Software.

[General Pipelines for Chinese NLP Engineering with Stanford NLP Software](http://acepor.github.io/2015/12/17/General-Pipelines/).

http://nlp.stanford.edu/software/segmenter.shtml

```bash
#! /bin/bash
###########################################
# Process segmenting using stanford-segmenter
###########################################

# constants
baseDir=$(cd `dirname "$0"`;pwd)
SEGMENT_CMD=nlp.stanford.edu/stanford-segmenter-2015-12-09/segment.sh
workDir=$baseDir/dialogues-segmented

# functions
function process_file(){
    echo "process file" $1
    sed 's/	/@_tab_@/g' $1 > $1-tmp
    bash -x $SEGMENT_CMD -k ctb $1-tmp UTF-8 0  > $1-segmented-tmp
    sed 's/@_tab_@/	/g'  $1-segmented-tmp > $1-segmented
    rm $1-tmp $1-segmented-tmp
}

function loop_file(){
    cd $workDir
    for x in `find . -name "*.tsv"`; do
        process_file $x
    done
}

# main
[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return

if [ -f $SEGMENT_CMD ];
then
   echo "Segmenter $SEGMENT_CMD exists."
   loop_file
else
   echo "Error: Segmenter $SEGMENT_CMD does not exist."
   exit 1
fi
```

![](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screen-Shot-2016-11-28-at-19.58.54.png)


# Python
[jieba](https://github.com/fxsjy/jieba)

```bash
sudo pip install jieba
```

![img](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screen-Shot-2016-11-28-at-22.36.35.png)

Also, with Python, [langid](https://github.com/saffsd/langid.py) can be used to check the language.

```bash
sudo pip install langid
```

![img](https://static-public.chatopera.com/backlog/chatbot/images/2016/11/Screen-Shot-2016-11-28-at-22.35.13.png)

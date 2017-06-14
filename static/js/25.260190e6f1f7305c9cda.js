webpackJsonp([25,29],{276:function(n,e){n.exports={rawContent:'\nDuring generating a word2vec model with Chinese data, it is very important to segment the Chinese sentences.\n\nFortunately, there are some awesome utilities which are introduced online.\n\n \n# Java\nBuilt by Stanford NLP Software.\n\n[General Pipelines for Chinese NLP Engineering with Stanford NLP Software](http://acepor.github.io/2015/12/17/General-Pipelines/).\n\nhttp://nlp.stanford.edu/software/segmenter.shtml\n\n```bash\n#! /bin/bash \n###########################################\n# Process segmenting using stanford-segmenter\n###########################################\n\n# constants\nbaseDir=$(cd `dirname "$0"`;pwd)\nSEGMENT_CMD=nlp.stanford.edu/stanford-segmenter-2015-12-09/segment.sh\nworkDir=$baseDir/dialogues-segmented\n\n# functions\nfunction process_file(){\n    echo "process file" $1\n    sed \'s/\t/@_tab_@/g\' $1 > $1-tmp\n    bash -x $SEGMENT_CMD -k ctb $1-tmp UTF-8 0  > $1-segmented-tmp\n    sed \'s/@_tab_@/\t/g\'  $1-segmented-tmp > $1-segmented\n    rm $1-tmp $1-segmented-tmp\n}\n\nfunction loop_file(){\n    cd $workDir\n    for x in `find . -name "*.tsv"`; do \n        process_file $x\n    done\n}\n\n# main \n[ -z "${BASH_SOURCE[0]}" -o "${BASH_SOURCE[0]}" = "$0" ] || return\n\nif [ -f $SEGMENT_CMD ];\nthen\n   echo "Segmenter $SEGMENT_CMD exists."\n   loop_file\nelse\n   echo "Error: Segmenter $SEGMENT_CMD does not exist."\n   exit 1\nfi\n```\n\n![](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2016/11/Screen-Shot-2016-11-28-at-19.58.54.png)\n\n\n# Python\n[jieba](https://github.com/fxsjy/jieba)\n\n```bash\nsudo pip install jieba\n```\n\n![img](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2016/11/Screen-Shot-2016-11-28-at-22.36.35.png)\n\nAlso, with Python, [langid](https://github.com/saffsd/langid.py) can be used to check the language.\n\n```bash\nsudo pip install langid\n```\n\n![img](http://7xkeqi.com1.z0.glb.clouddn.com/chatbot/images/2016/11/Screen-Shot-2016-11-28-at-22.35.13.png)',metaData:{layout:"post",title:"Resolve segmenter to process Chinese Dialogues",excerpt:"During generating a word2vec model with Chinese data, it is very important to segment the Chinese sentences.",category:"development",tags:["corpus","nlp","分词"],disqus:!0}}}});
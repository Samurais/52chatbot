---
layout: post
title: "Freebase简介"
excerpt: "Freebase是一个巨大的，免费的事实数据库，组织成三元组的形式。Freebase的实体和关系都有类别，并且类别和关系的词典类似。每个实体有一个内部的id和一些可选的名字集来在文本中引用该实体。"
category: research
tags: [probability]
disqus: true
---

[网址:https://developers.google.com/freebase/][1]

## 简介
__FreeBase:__ Freebase(Bollacker et al.,2008)是一个巨大的，免费的事实数据库，组织成三元组的形式（subject Entity,Relationship,object Entity）。Freebase的实体和关系都有类别，并且类别和关系的词典类似。每个实体有一个内部的id和一些可选的名字集（别名）来在文本中引用该实体。
Freebase有超过46million的主题和2.6billion的事实。在Freebase的设计中，有一个特殊的实体类别叫做合成值类型（CVT）,它不现实世界的实体，但是可以用来存放事件的多个域或一个特殊的关系。
Freebase中的每个实体都有一个唯一的"id"和一个唯一的"mid". "mid"是实体的机器码，其形式为：/m/012rkqx,在RDF里为 m.012rkqx。"id"是人类可读的ID,形式为：award.award_winner。 

## 基本概念
1. [namespace][2]: namespace是唯一的命名对象的一个路径。在namespace里的所有的对象都有一个名字，并且每个名字是唯一的。常见的namespace的例子是计算机文件系统的目录，internet的域名等。namesapce通常都是分层的，多个层可以通过用(/)分割的字符串表示。Freebase使用namespace来管理keys和ids。Freebase的namespace例子如下：
  * /guid - synthetic namespace which holds all GUID based IDs 
  * /en - 所有的人类可读id的顶级namespace
  * /type - 包含所有的原始类型定义的namespace (/type/object,/type/dated_integer)
  * /lang - 多有的人类语言的ID(/lang/en,/lang/fr)
  * /wikipedia - 维基百科的顶级namespace
  * /user - 所有的用户账号id
  * /base - 所有的用户bases
  * /freebase - 用于Freebase的内部操作things
  * /commons - 所有的普通domains的顶级域名(/common, /people,/business,/books,/film, etc)
2. [domain][3]: 有相同的namespace的types的集合,形式为/type/domain,可以出现在namespace的任何地方，比如：
    * /film
    * /base/tallships
    * /user/skud/default_domain
    * /freebase/apps
3. [type][4]: type表示关于一个Topic的`IS A`的关系。
4. [Topic][5]: Freebase中的Topic表示一个概念或一个现实世界的事物。每个topic在freebase.com都有它自己的web页面。一个topic也叫做一个entity, resource或element或thing, 它是freebase的基本的单元。每个topic都有类型`/common/topic`。`/common/topic` 是一种type,描述了事物在freebase中被如何使用，它的属性包括：
    * aliases
    * weblinks
    * subjects
    * article
    * images
5. [CVT][6]: Compound Value Type，复合值类型，在freebase里用来表示一条记录由多个域组成，用来表示复杂的数据。
6. [aliases][7]
7. [notable_types][9]: Freebase的topic可以有很多不同的types。比如，Barack Obama是Person,Pllician,Author,Award Winner等。通常，我们需要知道一个topic最显著的type,最有区分性的type，来区分同名topic。在Freebase Search API中可以通过`filter=(all notable:Politician)`来根据类型过滤。
8. 

## [Types]（类别）
1. 地点：/location/location
2. 人：/people/person
  * name:人的名字或别名。
  * place_of_birth: 出生地(down to the city level)
  * date_of_birth: 出生时间
  * date_of_death: 死亡时间
  * places_lived: 居住地
  * education: 教育程度
  * profession: 专业
  * achievements: 成就
3. 电影：/film/film
4. 导演：/film/director
5. 书籍：  /book/book  
6. 电视演员：/tv/tv_actor
7. 电影演员: /film/actor

## 常用的关系

* name: <http://rdf.freebase.com/ns/type.object.name>
* alias: <http://rdf.freebase.com/ns/common.topic.alias>
* 类别： /common/topic/notable_types

## 下载

[下载freebase-rdf-latest.gz]()http://commondatastorage.googleapis.com/freebase-public/rdf/freebase-rdf-latest.gz?

## 中文条数（包含繁体）

```
zgrep "@zh" freebase-rdf-latest.gz | wc -l
660,181
```

## 抽取中文数据

```
zcat freebase-rdf-latest.gz | tr -d '\000' | grep "@zh" | gzip > freebase-rdf-latest.zh.gz
```

> tr -d '\000' 的目的是防止因为遇到错误 "Binary file (standard input) matches"而中断。

解压
```
gunzip --keep data/freebase-rdf-latest.zh.gz
```

文档数
```
zgrep "@zh" freebase-rdf-latest.zh.gz | wc -l
```

44,283,145 / (肆仟肆佰贰拾捌万叁仟壹佰肆拾伍) 条

## 三元组 

### N-Triples
https://www.w3.org/TR/2004/REC-rdf-testcases-20040210/#ntriples

### Freebase中，数据都是按照三元组存储
```
 zmore freebase-rdf-latest.gz

<http://rdf.freebase.com/ns/american_football.football_player.footballdb_id>    <http://rdf.freebase.com/ns/type.object.type>   <http://rdf.freebase.com/ns/type.property>      .
<http://rdf.freebase.com/ns/american_football.football_player.footballdb_id>    <http://rdf.freebase.com/ns/type.object.name>   "footballdb ID"@en      .
```

它的结构如下：

<subject>TAB<predict>TAB<object>TAB .\n

因为解压出来文件体积大，使用[脚本:zmore, zgrep, zcat, etc.](https://github.com/nchah/freebase-triples#scripts)访问更方便。

e.g.
```
zgrep "people" data/freebase-rdf-latest.zh.gz
```

### 数据网盘地址
链接: https://pan.baidu.com/s/1hs45j9M 密码: sgdh
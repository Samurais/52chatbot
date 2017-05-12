---
layout: post
title: "语音识别服务"
excerpt: "支持格式：wav, silk，最低采样率(16,000)；支持语言：简体中文，繁体中文，英语；支持口音：普通话，粤语；Powered by 讯飞开放平台"
category: development
tags: [stt]
disqus: true
---

# TL;DR

* 支持格式：wav, silk，最低采样率(16,000)

* 支持语言：简体中文，繁体中文，英语

* 支持口音：普通话，粤语

* Powered by [讯飞开放平台](http://www.xfyun.cn/)


# API
Endpoint [http://stt.chatbot.io/](http://stt.chatbot.io/)


* 识别 wav文件

```
curl -X POST  \
    -F "audiofile=@foo.wav" \
    -F data="{\"lang\":\"zh_cn\", \"accent\": \"mandarin\", \"sample_rate\":16000}" \
    http://stt.chatbot.io/api/v1/stt/wav
```

| 字段 | 介绍 | 可选项 |
| --- | --- | --- |
| lang | 语音文件的语言 | zh\_cn(简体中文), zh\_tw(繁体中文), en_us(英语) | 
| accent | 口音 | mandarin(普通话), cantonese(粤语) | 
| sample_rate | 采样率 | 推荐采样率16,000 | 
| audio_file | 文件所在位置 | 以 .wav结尾，单声道文件 |

* 识别 silk文件

```
curl -X POST  \
    -F "audiofile=@foo.wav" \
    -F data="{\"lang\":\"zh_cn\", \"accent\": \"mandarin\", \"sample_rate\":16000}" \
    http://stt.chatbot.io/api/v1/stt/silk
```

| 字段 | 介绍 | 可选项 |
| --- | --- | --- |
| lang | 语音文件的语言 | zh\_cn(简体中文), zh\_tw(繁体中文), en_us(英语) | 
| accent | 口音 | mandarin(普通话), cantonese(粤语) | 
| sample_rate | 采样率 | 推荐采样率16,000 | 
| audio_file | 文件所在位置 | 以 .silk结尾，单声道文件 |

## 格式转化工具推荐

* mp3 转 wav

```
sox -t mp3 -r $sampleRate -c 1 $filePath  -r 16000 -t wav $filePath.wav
```

* 查看声音文件属性

```
sox info $filePath.wav
```

### XFYUN API服务 感谢：

[fundon](https://github.com/fundon) 提供服务域名。

[silk-v3-decoder](https://github.com/kn007/silk-v3-decoder) 提供silk解码和转码SDK。

## FAQ
1. 目前本站服务支持时间？
从2017年5.1至未来9个月没有问题，长期看捐助情况。

2. 如何搭建自己的服务？

参考[这里](https://hub.docker.com/r/samurais/xfyun-api/)。

3. 想加入聊天机器人开发者社区？
联系我: hain_wang#foxmail.com, "# --> @"

## 其他

1. 自然语言理解服务

[http://nlp.chatbot.io](http://nlp.chatbot.io)

2. 学习资料

[解析深度学习：语音识别实践](https://item.jd.com/11933855.html)

3. 工作:

[http://nlpjob.com/](http://nlpjob.com/)

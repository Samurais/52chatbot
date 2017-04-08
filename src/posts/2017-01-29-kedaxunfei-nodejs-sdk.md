---
layout: post
title: "科大讯飞 Node.js SDK"
excerpt: "这两年，深度学习使得ASR服务的准确度大大提升。针对汉语，或者是中式英语，科大讯飞的服务做的不错【注意:这里是安利】。"
category: development
tags: [sdk, stt, asr]
disqus: true
---

在做聊天机器人的过程中，人最有好的输入还是通过语音，这两年，深度学习使得ASR服务的准确度大大提升。针对汉语，或者是中式英语，科大讯飞的服务做的不错【注意:这里是安利】。

## 但是 ...

[科大讯飞](http://www.xfyun.cn/)没有提供Node.js SDK， 我就造了这个轮子。

* 目前仅支持 linux64，目前仅支持科大讯飞听写接口。
```bash
# download xfyun sdks from official portal, a zip file like here.
sudo unzip Linux_voice_1135_5864ae2d.zip -d /opt/xfy-sdk
cd PROJECT_ROOT
```

* Install
```bash
npm install xfy-node --save
```

## Usage
```javascript
    const xfyclient = require('xfy-node');
    let params = {
        username: null, // 账号名称
        password: null, // 账号密码 
        appid: '5864ae2d', // AppID
        // 语言
        // zh_cn:简体中文
        // zh_tw:繁体中文
        // en_us:英语
        // 默认为zh_cn
        lang: 'zh_cn', 
        // 口音
        // mandarin:普通话
        // cantonese:粤语
        // 默认为mandarin
        accent: 'mandarin',
        // 音频格式
        // 8000, 16000, 默认为16000
        sample_rate: 16000,
        // 音频文件位置，绝对路径
        audio_file: 'wav/iflytek01.wav'
    }

    xfyclient.iat(params)
        .then(function (result) {
            console.log('result', result);
        }, function(err){
            console.log('err', err);
        });
```

## Tutorial
https://github.com/Samurais/xfy-node-getstarted

## Contribution
```bash
npm install
node-gyp rebuild
ava # test
```

## 讯飞提供的原始SDK
```bash
git clone https://github.com/Samurais/xfyun-get-started
```

## 资源链接
[语音识别科普](http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=6911)

[服务介绍](http://www.xfyun.cn/doccenter/asr)

[开发者论坛](http://bbs.xfyun.cn/portal.php)

[识别英语](http://bbs.xfyun.cn/forum.php?mod=viewthread&tid=22602&extra=page%3D1)

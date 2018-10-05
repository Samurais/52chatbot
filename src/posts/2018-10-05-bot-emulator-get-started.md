---
layout: post
title: "Bot Emulator快速开始"
excerpt: "微软Botframework中快速开发聊天机器人的桌面工具。"
category: development
tags: [bot, microsoft]
disqus: true
---

# Bot Emulator快速开始

## setup project

```
npm install -g yo
npm install -g generator-botbuilder
yo botbuilder
```

## create luis.ai service

* Learn [bot file](https://github.com/Microsoft/botbuilder-tools/blob/master/packages/MSBot/docs/bot-file.md)

* Learn [bot adapter](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0&tabs=cs)


* Install azure [cli](https://github.com/Azure/azure-cli)
```
source ~/venv-py3/bin/activate
pip install --pre azure-cli --extra-index-url https://azurecliprod.blob.core.windows.net/edge
```

* Login Azure Cli
```
az login
```

* Install cli tools

```
npm i -g msbot luis-apis ludown
```

* Get Luis Authoring Key

```
Login : https://www.luis.ai/home
Navigate to : https://www.luis.ai/user/settings

```

* Get AZURE SUBSCRIPTION ID

![](https://user-images.githubusercontent.com/3538629/46511308-6e7f3680-c880-11e8-9d0d-0adc6bee0bea.png)

* Parse LUIS.ai Model

```
cd $baseDir/../myJsBots
ludown parse toluis \
    --in dialogs/greeting/resources/main.lu \
    -o cognitiveModels/ \
    --out basicBot.luis \
    -n 'myJsBots_myChatBot-LUIS' \
    -d 'Bot Builder V4 Basic Bot.' --verbose
```

* Deploy LUIS.ai Service

```
luis import application \
    --in cognitiveModels/basicBot.luis \
    --authoringKey $LUIS_KEY \
    --msbot --endpointRegion | msbot --secret $MSBOT_SECRET connect luis --stdin
```


* Train LUIS.ai Service

```
msbot get myJsBots_myChatBot-LUIS --secret $MSBOT_SECRET | luis train version --wait --stdin
```

* Publish LUIS.ai Service

```
msbot get myJsBots_myChatBot-LUIS --secret $MSBOT_SECRET | luis publish version --wait --stdin
```

## Start project

```
cd myJsBots
npm start
```

## Connect with Botframework Emulator

![image](https://user-images.githubusercontent.com/3538629/46524922-d5badc00-c8bc-11e8-9a90-7e84e19e038c.png)


# references
[Create a bot with the Bot Builder SDK for JavaScript](https://docs.microsoft.com/en-us/azure/bot-service/javascript/bot-builder-javascript-quickstart?view=azure-bot-service-4.0)

# troubles

1. [msbot] can not clone service [#632](https://github.com/Microsoft/botbuilder-tools/issues/632)
```
~/.nvm/versions/node/v8.10.0/lib/node_modules/msbot/bin/msbot-clone-services.js
```

2. [azure-cli] does not work with bot service

```
Install edge build from https://github.com/Azure/azure-cli
```



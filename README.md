# Floating Live GUI

Floating Live 弹幕接收工具的可视化界面版本，在 ```floating-live``` 模块的基础上添加了一些操作功能。

后端使用NodeJS开发，可视化程序界面使用Electron实现，前端界面使用React + Typescript开发，UI框架为Ant Design。

目前正处于开发阶段，请谨慎用于正式的使用场景。若使用时出现报错等情况，可在github页面上提issue。

## 619 Edition
针对监视[b站某不知名虚拟主播](https://live.bilibili.com/2064239)直播间弹幕的拓展版本，实现了[zuluyuanye弹幕姬](https://livechat.zhuluyuanye.com/room/2064239?mlt=1000&mlg=1000&mls=1000&ht=60&hg=20&hs=20&fr=1)的表情包功能，弹幕中若含有形如```{{##}}```的文本(```##```为表情包id)，会替换显示为对应的表情包图片。

该功能仅对平台为```bilibili```，房间号为```2064239```的文字弹幕生效

在文字中添加表情包的方法：根据[zhuluyuanye官网的表情包定义](https://livechat.zhuluyuanye.com/emoticon_map)获取表情包id，在要发送的弹幕中加入```{{id}}```即可

使用例：```这就是主播吗{{10}}，爱了爱了{{25}}```



## 使用方法

### 安装
目前暂未发布可执行程序版本，也暂时没有设置项目的打包方法。想要编译后的版本可以自己摸索怎样打包=w=

目前可以通过运行源代码的方式打开程序。

确认电脑上已安装 nodeJS (建议安装最新的稳定版)和 npm，并在项目文件夹下输入下列指令以安装依赖。

```
npm install
```

### 运行
输入下列指令打开程序
```
npm run start
```
出现一个程序窗口，代表程序成功运行。

## 功能

### 添加房间
进入【添加房间】选项卡，选择平台并输入直播间id，即可搜索房间。

点击添加按钮可将直播间添加到列表中，点击打开按钮可直接打开房间。

可以在【开始】选项卡中对房间进行操作。

目前支持bilibili直播间及AcFun直播间，后续会添加对更多平台的支持。

### 弹幕保存
进入【弹幕保存】选项卡，打开【记录弹幕到本地】即可记录弹幕。

可以更改弹幕文件保存位置。目前仅支持计算机上已存在的文件夹，若文件夹路径不存在则会报错。

### 网页版本操作
程序也可以使用网页版进行操作。确保主程序窗口中【本地服务 > 启用websocket服务】处于打开状态。

打开浏览器，在地址栏中输入```localhost:1212```即可进入网页界面。

此时需要与后端连接才能对程序进行操作。在浏览器页面中进入【连接服务】，点击连接按钮即可连接主程序，设置项将实时同步。

## TODO
当前版本 DEV **0.4.0**

⬜计划中 · 🟨开发中 · ✅已实现
* ✅ 网页端操作
* ✅ Typescript 后端
* ✅ 指令工具
* ✅ 聊天图片保存及显示
* ✅ AcFun 弹幕支持
* 🟨 房间收藏及配置保存
* 🟨 插件系统

## Q&A
### 现在已经有很多直播弹幕工具了，为什么还要自己再开发一个
虽然现在有不少直播弹幕接收程序，但是这些程序大部分都只支持一种平台。一些支持多平台的直播弹幕工具也并不开源，甚至要收费，难以实现高度自由的程序拓展。

这个弹幕接收程序的目标是接收来自不同平台的弹幕，将接收到的弹幕处理转化为统一的、易读的弹幕数据，并尽可能多地保存有效信息，提高程序及相关插件的易开发性和可拓展性。

### 为什么要用NodeJS而不是其他语言作为后端
很简单，为了保证前后端代码语言及数据结构的统一。前后端语言统一可以省去很多麻烦，比如可以使用同一套类型声明而无需在前后端同时修改。例如在这个项目的前端代码中就使用了在 floating-live 模块中定义的类型及接口。而且前后端使用一种语言可以降低项目开发者的语言门槛——只要你会写js前端，就一定会看懂nodejs代码。

还有一个原因，我个人基本只会用javascript，对其他语言不是很熟悉QwQ


## 相关链接
* 项目仓库：[github:Minteea/floating-live-gui](https://github.com/Minteea/floating-live-gui) 
* 核心模块：[github:Minteea/floating-live](https://github.com/Minteea/floating-live)
* 开发模板：[github:electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
### 弹幕获取
* bilibili弹幕库[MIT]: [github:simon300000/bilibili-live-ws](https://github.com/simon300000/bilibili-live-ws)
* AcFun弹幕库[GPLv3]: [github:ACFUN-FOSS/ac-danmu.js](https://github.com/ACFUN-FOSS/ac-danmu.js)
# jr-fullstack-ai-exercise

Step by step exercises

Ex01
在Azure Portal上面体验文字转语音和语音转文字
 - 登陆Azure Portal
 - 进入Speech Studio
 - 动手操作文字转语音
 - 动手操作上传语音转文字
 - 动手操作用麦克风录入语音转文字

Ex02

跟随练习说明，用React写一个最简单的文字转语音（TTS - Text To Speech）Web应用

阅读练习说明，写一个form，包括 input，和 submit，输入文字，用window.speechSynthesis控件播放语音

Solution: **https://github.com/dorjear/speech-demo-tts-simple


Ex03

跟随练习说明，用React写一个最简单的语音转文字（STT - Speech To Text）Web应用
 - 写一个form，包括三个按钮：开始录音，暂停录音，停止录音
 - 用microsoft-cognitiveservices-speech-sdk实现实时语音转文字
 - 写一个文本显示框，显示转换之后的文字

Solution: https://github.com/dorjear/speech-demo-stt-fe-direct

Ex04

引入后端，跟随练习说明，用.net/JS写一个获取token的后端 - 30 分钟
- 初始化一个Web API
- 配置好Web API
- 写一个controller，提供一个API /api/VoiceController/get-speech-token
- 在这个controller里面调用Azure cognitive 服务获取token并作为Response返回

Solutions
- https://github.com/dorjear/speech-demo-be-dotnet
- https://github.com/dorjear/speech-demo-be-nodejs

跟随练习说明，写一个React App，调用后端获取token， 并进行Stream实现STT - 30分钟
调用上面的后端获取token
从麦克风录音转换成文字

Solution: https://github.com/dorjear/speech-demo-stt-token

Ex05
跟随练习说明更新上一节的后端应用，提供一个API，接受一个音频文件，调用Azure AI转化成文字，并作为Reponse 返回 - 20分钟
- 增加一个API endpoint /api/VoiceController/upload 接受一个webm文件
- 保存文件并转换成wav
- 调用SpeechRecognizer 把文件传至Azure识别出文字
- 返回文字到Response

Solutions
- https://github.com/dorjear/speech-demo-be-dotnet
- https://github.com/dorjear/speech-demo-be-nodejs

更新上一节的 React 前端，把录到的语音传给上面的API，获取文字 - 30分钟
 - 用react-mic录音
 - 上传文件

Solution: https://github.com/dorjear/speech-demo-stt-fe-indirect

Ex06: 在 Azure Portal上体验翻译功能

Ex07:

基于练习5的后端， 增加一个API，实现普通话语音翻译成英语文字的功能

基于练习5的前端，增加一个按钮，调用新增的翻译API，实现语音翻译成文字功能

Solutions
  - https://github.com/dorjear/speech-demo-be-dotnet
  - https://github.com/dorjear/speech-demo-be-nodejs
  - https://github.com/dorjear/speech-demo-stt-fe-indirect

Branch: feature/add-translate

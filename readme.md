# Youtube-Subtitle
Chromeの拡張機能のサンプルです。Youtube上に字幕を表示します。

## ファイル
- manufest.json  
V3に対応しています
- sub/*.srt  
字幕ファイルのサンプル
- sub-table.json  
YoutubeのVideoIDと字幕ファイルを関連づけるテーブル 
```
例：
"4DFBOuQQi1s": "Aline Barros - Autor da Vida.srt",
```
VideoIDはYoutube動画のURLがhttps://www.youtube.com/watch?v=4DFBOuQQi1sの場合、4DFBOuQQi1sです。

## 使い方
- chromeの拡張機能→「パッケージ化されていない拡張機能を読み込む」で読み込みます。
- sub-table.jsonにあるVideoIDのYoutube動画を開いて、拡張機能のアイコンをクリックすると、VideoIDに対応する字幕を表示します。

## メモ
このサンプルでは字幕ファイル、sub-table.jsonを拡張機能に含めています。これらを別サーバーに置くには、サーバーからのレスポンスヘッダーにAccess-Control-Allow-Originを設定する必要があります。  
これらのファイルを拡張機能と別のローカルフォルダに置くことはできません。拡張機能のセキュリティ制限です。

// 字幕データ
let Subtitle = function (startSec, endSec, texts) {
    this.startSec = startSec;
    this.endSec = endSec;
    this.texts = texts;
};

let SubManager = function () {
    this.subtitles = [];
};

SubManager.prototype.readSub = async function (url) {
    /*
      字幕ファイルのテキストを配列に読み込む
      引数：
      url 字幕ファイルのurl
      */
    const response = await fetch(url);
    const text = await response.text();

    const lines = text.split("\r\n"); // 空行で分割

    const re = new RegExp(
        /(\d{2}):(\d{2}):(\d{2})[\.,]000 --> (\d{2}):(\d{2}):(\d{2})[\.,]000/
    );
    let subtitle = null;
    for (const line of lines) {
        const m = line.match(re);
        if (m != null) {
            // 時間指定行
            startSec =
                parseInt(m[1]) * 60 * 60 + parseInt(m[2]) * 60 + parseInt(m[3]);
            endSec = parseInt(m[4]) * 60 * 60 + parseInt(m[5]) * 60 + parseInt(m[6]);

            subtitle = new Subtitle(startSec, endSec, []);
            continue;
        }

        if (line.length == 0) {
            // 空行
            if (subtitle != null) {
                this.subtitles.push(subtitle);
                subtitle = null;
                continue;
            }
        }

        //字幕テキスト
        if (subtitle != null) {
            subtitle.texts.push(line);
        }
    }
};

SubManager.prototype.getSub = function (sec) {
    // 指定された秒数の字幕テキストの配列を返す

    for (const subtitle of this.subtitles) {
        if (subtitle.startSec <= sec && sec < subtitle.endSec)
            return subtitle.texts;
    }
    return [];
};

const createDivSub = function () {
    // 字幕表示エリア作成
    const divSub = document.createElement('div');
    divSub.id = 'subtitle'
    divSub.style.display = 'flex';
    divSub.style.justifyContent = 'center'
    divSub.style.position = 'fixed';
    //divSub.style.position = 'absolute';
    divSub.style.bottom = '10%';
    divSub.style.left = '50%'; // 横方向中央に配置
    divSub.style.transform = 'translateX(-50%)'; // 中心からずらす
    divSub.style.width = 'auto'
    divSub.style.height = 'auto'
    divSub.style.background = 'rgba(0, 0, 0, 0.7)';
    divSub.style.padding = '10px';
    divSub.style.zIndex = '9999';
    divSub.style.color = 'white';
    divSub.style.textAlign = 'center';
    divSub.style.fontFamily = 'Arial, Helvetica, sans-serif';
    divSub.style.fontSize = 'xx-large';
    divSub.style.pointerEvents = 'none';

    const video = document.querySelector("video");
    const container = video.parentElement;
    container.style.position = "relative"; // 親に相対位置を指定
    //container.appendChild(divSub);
    document.body.appendChild(divSub);

    return divSub;
}

let SetupSub = async function () {

    // url引数取得
    let uri = new URL(window.location.href);
    const param = uri.search;
    if (param.length == 0) {
        console.log("urlに引数がありません");
        return;
    }

    // url引数：v=videoId
    let videoId = "";
    if (uri.searchParams.has("v")) {
        videoId = uri.searchParams.get("v");
    } else {
        console.log("videoIdが指定されていません");
        return;
    }

    // 字幕テーブル読み込み
    //const jsonFileUrl = chrome.runtime.getURL("sub-table.json");
    const jsonFileUrl = 'https://cf862826.cloudfree.jp/youtube-player-iframe/sub-table.json'
    const response = await fetch(jsonFileUrl);
    const subTable = await response.json();

    if (!(videoId in subTable)) {
        console.log(`videoId:${videoId}がテーブルにありません`);
        return;
    }
    let subFile = subTable[videoId];
    document.title = subFile.split(".").slice(0, -1).join("."); // タイトル設定
    //let subFileUrl = chrome.runtime.getURL("sub/" + subFile);
    let subFileUrl= encodeURI(`https://cf862826.cloudfree.jp/youtube-player-iframe/sub/${subFile}`)

    // 字幕ファイル読み込み
    let sm = new SubManager();
    sm.readSub(subFileUrl);

    const video = document.querySelector('video');
    if (!video) {
        console.log("videoがありません");
        return;
    }

    const divSub =createDivSub(); //字幕表示用DIV作成

    setInterval(() => {
        // 字幕表示
        const sec = Math.trunc(video.currentTime);
        texts = sm.getSub(sec);
        if (texts.length > 0) {
            divSub.style.visibility = "visible";
            text = texts.join("<br/>");
            divSub.innerHTML = text;
        } else {
            divSub.style.visibility = "hidden";
            divSub.innerHTML = "";
        }
    }, 500);
};

SetupSub();

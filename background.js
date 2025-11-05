let hasRun = false;

chrome.action.onClicked.addListener((tab) => {
    if (hasRun) return; // 一度だけ実行
    hasRun = true;

    console.log("Extension icon clicked on tab:", tab);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});

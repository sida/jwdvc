'use strict';

JWDC.dom = (() => {

    let _setCurrentUrl = (url) => {
        let elem = document.getElementById('current-path');
        elem.innerText = url;
    }

    let _cleanFileInfo = () => {
        let elem = document.getElementById('file-list');
        elem.innerHTML = '';
        _addLine(JWDC.template.firstfileline());
    }

    let _addFileInfo = (info) => {
        let fileInfoHtml = JWDC.template.fileLine(info);
        _addLine(fileInfoHtml);
    }

    let _addLine = (htmlString) => {
        let elem = document.getElementById('file-list');
        elem.innerHTML = elem.innerHTML + htmlString;
    }

    let _update = () => {
        const url = JWDC.core.getUrl();
        JWDC.dom.setCurrentUrl(url);

        JWDC.dom.cleanFileInfo();
        const currentPath = JWDC.core.getCurrentPath();
        for (const info of JWDC.file_info) {
            if (currentPath === info.name) {
                // 現在位置の表示はスキップ
                continue;
            }
            JWDC.dom.addFileInfo(info);
        }
    }

    return {
        setCurrentUrl: _setCurrentUrl,
        cleanFileInfo: _cleanFileInfo,
        addFileInfo: _addFileInfo,
        update: _update,
    }
})();
'use strict';

JWDC.dom = (() => {

    let _setCurrentUrl = (url) => {
        let elem = document.getElementById('current-path');
        elem.innerText = url;
    }

    const upDirFileInfo = {
        "name": '..',
        "ext": '',
        "href": '',
        "length": '',
        "lastmodified": '',
        "date": 0,
        "isFile": false
    }

    let _cleanFileInfo = () => {
        let elem = document.getElementById('file-list');
        elem.innerHTML = '';
        _addFileInfo(upDirFileInfo);
    }

    let _addFileInfo = (info) => {
        let fileInfoHtml = JWDC.template.fileLine(info);
        let elem = document.getElementById('file-list');
        elem.innerHTML = elem.innerHTML + fileInfoHtml;
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

    let _onChangeSelectAll = (checked) => {
        const checkBoxList = document.getElementsByClassName('file-check');
        for (const cb of checkBoxList) {
            cb.checked = checked;
        }
    }

    return {
        setCurrentUrl: _setCurrentUrl,
        cleanFileInfo: _cleanFileInfo,
        addFileInfo: _addFileInfo,
        update: _update,
        onChangeSelectAll: _onChangeSelectAll,
    }
})();
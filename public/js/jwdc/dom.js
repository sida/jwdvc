'use strict';

JWDC.dom = (() => {

    let _setCurrentUrl = (url) => {
        let elem = document.getElementById('current-path');
        elem.innerText = url;
    }

    let _cleanFileInfo = () => {
        let elem = document.getElementById('file-list');
        elem.innerHTML = '';
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
        for (const info of JWDC.file_info) {
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
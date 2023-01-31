'use strict';

var JWDC = {
    config: {
        host: '',
        path: '',
        port: '',
        userName: '',
        passwd: '',
    },
    pathStack: [],
    file_info: [],
};

JWDC.core = (() => {
    let _init = (config) => {
        JWDC.config = config;
        JWDC.pathStack.push(config.path);
    }

    let _loadfilelist = () => {
        const url = _getUrl();
        return JWDC.webdav.propfind(url, 1)
            .then(
                (response) => {
                    let json = JWDC.webdav.parsePropfind(response.data);
                    JWDC.file_info = json;
                }
            );
    }

    let _load = () => {
        _asyncloadFileList();
    }

    async function _asyncloadFileList() {
        try {
            await JWDC.core.loadfilelist();
        } catch (e) {
            alert(e);
            return;
        }
        JWDC.dom.update();
    }

    let _upload = (fileIF) => {
        const reader = new FileReader();
        reader.onload = () => {
            let bin = reader.result;
            let currentURL = JWDC.core.getUrl();
            let url = JWDC.util.joinPath(currentURL, fileIF.name);

            JWDC.webdav.put(url, bin);
        };
        reader.readAsArrayBuffer(fileIF);
    }

    async function asyncUpload(fileIF) {
        const res = await JWDC.util.readFile(fileIF);
        let currentURL = JWDC.core.getUrl();
        let url = JWDC.util.joinPath(currentURL, fileIF.name);
        await JWDC.webdav.put(url, res);
        // ディレクトのファイルリストを再取得
        _load();
    }

    let _changeDirectory = (path) => {
        if (path==='..') {
            if (JWDC.pathStack.length <= 1) {
                return;
            }
            JWDC.pathStack.pop();
            return;
        }
        JWDC.pathStack.push(path);
    }

    let _getUrl = () => {
        const url = JWDC.util.joinPath(
            JWDC.config.host,
            ...JWDC.pathStack,
            '/');
        return url;
    }

    let _clickFilename = (filename) => {
        console.log("click!!:" + filename);
        if (filename==='..') {
            _changeDirectory(filename);
            _asyncloadFileList();
            return;
        }
        const info = JWDC.util.searchFileInfo(filename);
        if (!info) {
            return;
        }
        if (info.isFile) {
            let currentURL = JWDC.core.getUrl();
            const filePath = JWDC.util.joinPath(currentURL, info.name);
            window.location.href = filePath;
            return;
        }
        _changeDirectory(info.name);
        _asyncloadFileList();
    }

    let _onDelete= ()=>{
        const elemList = document.getElementsByClassName('file-check');
        for (const elem of elemList) {
            console.log("checked:" + elem.checked +"   value:" + elem.value);
        }
    }

    return {
        init: _init,
        loadfilelist: _loadfilelist,
        load: _load,
        getUrl: _getUrl,
        changeDirectory: _changeDirectory,
        upload: asyncUpload,
        clickFilename: _clickFilename,
        onDelete:_onDelete,
    }
})();
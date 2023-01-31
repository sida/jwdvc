'use strict';

var JWDC = {
    config: {
        host: '',
        path: '',
        port: '',
        userName: '',
        passwd: '',
    },
    current_path: '.',
    file_info: [],
};

JWDC.core = (() => {
    let _init = (config) => {
        JWDC.config = config;
        JWDC.current_path = config.path;
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
        JWDC.current_path = path;
    }

    let _getUrl = () => {
        const url = JWDC.util.joinPath(
            JWDC.config.host,
            JWDC.current_path,
            '/');
        return url;
    }

    let _clickFilename = (filename) => {
        console.log("click!!:" + filename);
    }

    return {
        init: _init,
        loadfilelist: _loadfilelist,
        load: _load,
        getUrl: _getUrl,
        changeDirectory: _changeDirectory,
        upload: asyncUpload,
        clickFilename: _clickFilename,
    }
})();
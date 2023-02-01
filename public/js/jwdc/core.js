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

        // ファイルアップロードの設定
        const fileInput = document.getElementById('upload-file');
        const handleFileSelect = () => {
            const files = fileInput.files;
            JWDC.core.upload(files[0]);
        }
        fileInput.addEventListener('change', handleFileSelect);
        // 表示更新
        _reload();
    }

    let _reload = async () => {
        console.log('reload!!');
        const url = _getUrl();
        try {
            const responsePropfind = await JWDC.webdav.propfind(url, 1)
            let json = JWDC.webdav.parsePropfind(responsePropfind.data);
            JWDC.file_info = json;
            JWDC.dom.update();   
        } catch(err) {
            alert(err);
        }
    }

    let _upload = (fileIF) => {
        const reader = new FileReader();
        reader.onload = () => {
            let bin = reader.result;
            const url = JWDC.util.makeFullPath(fileIF.name);
            JWDC.webdav.put(url, bin);
        };
        reader.readAsArrayBuffer(fileIF);
    }

    async function asyncUpload(fileIF) {
        const res = await JWDC.util.readFile(fileIF);
        const url = JWDC.util.makeFullPath(fileIF.name);
        await JWDC.webdav.put(url, res);
        // ディレクトのファイルリストを再取得
        _reload();
    }

    let _changeDirectory = (path) => {
        // TODO check exist dir
        if (path === '..') {
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

    let _getCurrentPath = () => {
        return JWDC.pathStack.slice(-1)[0];
    }

    let _onClickFilename = (filename) => {
        if (filename === '..') {
            _changeDirectory(filename);
            _reload();
            return;
        }
        const info = JWDC.util.searchFileInfo(filename);
        if (!info) {
            return;
        }
        if (info.isFile) {
            const filePath = JWDC.util.makeFullPath(info.name);
            window.location.href = filePath;
            return;
        }
        _changeDirectory(info.name);
        _reload();
    }

    let _onClickDelete = () => {
        const elemList = document.getElementsByClassName('file-check');
        for (const elem of elemList) {
            console.log("checked:" + elem.checked + "   value:" + elem.value);
            if (elem.checked) {
                if (!elem.value) {
                    continue;
                }
                const deletePath = JWDC.util.makeFullPath(elem.value);
                // JWDC.webdav.delete(deletePath);
                JWDC.webdav.delete(deletePath)
                    .then(
                        (response) => {
                            console.log(response);
                        }
                    ).catch(
                        (response) => {
                            console.log(response);
                        }
                    );

                console.log(`delete: ${deletePath}`);
            }
        }
        _reload();
    }

    let _onClickMkDir = () => {
        const inputname = prompt('ディレクトリ名を入力');
        if (!inputname) {
            return;
        }
        const name = String(inputname).trim().replace(/\/$/, '').replace(/^\//, '');
        if (!name) {
            return;
        }
        const dirPath = JWDC.util.makeDirPath(name);
        JWDC.webdav.mkcol(dirPath);
        console.log('mkdir!!:' + dirPath);
        _reload();
    }

    let _onClickReload = () => {
        _reload();
    }

    let _onClickRename = () => {
        const elemList = document.getElementsByClassName('file-check');
        for (const elem of elemList) {
            console.log("checked:" + elem.checked + "   value:" + elem.value);
            if (elem.checked) {
                _rename(elem.value);
            }
        }
        _reload();
    }

    function _rename(fromName) {
        console.log(`rename ${fromName}`);

        const inputname = prompt('新しい名前を入力');
        if (!inputname) {
            return;
        }
        const name = String(inputname).trim().replace(/\/$/, '').replace(/^\//, '');
        if (!name) {
            console.log('empty');
            return;
        }

        const info = JWDC.util.searchFileInfo(fromName);
        if (!info) {
            console.log('no src');
            return;
        }

        let toPath = '';
        let fromPath = '';
        if (info.isFile) {
            toPath = JWDC.util.makeFullPath(name);
            fromPath = JWDC.util.makeFullPath(info.name);
        } else {
            toPath = JWDC.util.makeDirPath(name);
            fromPath = JWDC.util.makeDirPath(info.name);
        }

        console.log(`from:${fromPath} ==> to:${toPath}`);
        JWDC.webdav.move(fromPath,toPath);
    }

    let _onChangeSelectAll = (checked) => {
        const checkBoxList = document.getElementsByClassName('file-check');
        for (const cb of checkBoxList) {
            cb.checked = checked;
        }
    }

    return {
        init: _init,
        getUrl: _getUrl,
        changeDirectory: _changeDirectory,
        upload: asyncUpload,
        onClickFilename: _onClickFilename,
        onClickDelete: _onClickDelete,
        getCurrentPath: _getCurrentPath,
        onClickMkDir: _onClickMkDir,
        onClickReload: _onClickReload,
        onClickRename: _onClickRename,
        onChangeSelectAll: _onChangeSelectAll,
    }
})();
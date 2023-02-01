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
        _load();
    }

    let _changeDirectory = (path) => {
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

    let _clickFilename = (filename) => {
        console.log("click!!:" + filename);
        if (filename === '..') {
            _changeDirectory(filename);
            _asyncloadFileList();
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
        _asyncloadFileList();
    }

    let _onDelete = () => {
        const elemList = document.getElementsByClassName('file-check');
        for (const elem of elemList) {
            console.log("checked:" + elem.checked + "   value:" + elem.value);
            if (elem.checked) {
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
        _asyncloadFileList();
    }

    let _onMkDir = () => {
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
        _asyncloadFileList();
    }

    let _onReload = () => {
        _asyncloadFileList();
    }

    let _onRename = () => {
        const elemList = document.getElementsByClassName('file-check');
        for (const elem of elemList) {
            console.log("checked:" + elem.checked + "   value:" + elem.value);
            if (elem.checked) {
                _rename(elem.value);
            }
        }
        _asyncloadFileList();
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

    return {
        init: _init,
        loadfilelist: _loadfilelist,
        load: _load,
        getUrl: _getUrl,
        changeDirectory: _changeDirectory,
        upload: asyncUpload,
        clickFilename: _clickFilename,
        onDelete: _onDelete,
        getCurrentPath: _getCurrentPath,
        onMkDir: _onMkDir,
        onReload: _onReload,
        onRename: _onRename,
    }
})();
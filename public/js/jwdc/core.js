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
};

JWDC.core = (() => {
    let _init = (config) => {
        JWDC.config = config;
        JWDC.current_path = config.path;
    }

    let _load = (path, fileList) => {
        JWDC.current_path = path;
        const url = _getUrl();
        console.log(url);

        JWDC.dom.setCurrentUrl(url);

        JWDC.dom.cleanFileInfo();
        for (const info of fileList) {
            JWDC.dom.addFileInfo(info);
        }
    }

    let _getUrl = () => {
        const url = JWDC.util.joinPath(
            JWDC.config.host,
            JWDC.current_path,
            '/');
        return url;
    }

    return {
        init: _init,
        load: _load,
        getUrl: _getUrl,

    }
})();

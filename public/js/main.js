'use strict';

window.onload = () => {
    console.log('start!!');
    const HOST = 'http://192.168.10.10/';
    const base = 'dav';
    JWDC.core.init({ host: HOST, path: base });

    console.log(JWDC);

    const url = JWDC.core.getUrl();

    console.log("url=" + url);
    JWDC.webdav.propfind(url, 1)
        .then(
            (response) => {
                let json = JWDC.webdav.parsePropfind(response.data);
                console.log(json);
                JWDC.core.load(JWDC.current_path, json);
            }
        );
}
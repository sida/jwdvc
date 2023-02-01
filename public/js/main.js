'use strict';

window.onload = () => {
    console.log('start!!');
    const HOST = 'http://192.168.10.10/';
    const base = 'dav';

    JWDC.core.init({
        host: HOST,
        path: base
    });

    // for debug
    console.log(JWDC);
    const url = JWDC.core.getUrl();
    console.log("url=" + url);
}

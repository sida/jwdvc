'use strict';

window.onload = () => {
    console.log('start!!');
    const HOST = 'http://192.168.10.10/';
    const base = 'dav';

    JWDC.core.init({
        host: HOST,
        path: base
    });

    console.log(JWDC);

    const url = JWDC.core.getUrl();
    console.log("url=" + url);

    JWDC.core.load();


    // JWDC.webdav.options(url)
    //     .then(
    //         (response) => {
    //             console.log(response);
    //         }
    //     );

    //    JWDC.webdav.put(url + 'test.txt', 'abc');

    const fileInput = document.getElementById('upload-file');
    const handleFileSelect = () => {
        const files = fileInput.files;
        JWDC.core.upload(files[0]);
        // JWDC.core.load();
    }
    fileInput.addEventListener('change', handleFileSelect);



}
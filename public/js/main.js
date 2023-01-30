'use strict';


var JWDC = {};

window.onload = () => {
    console.log('start!!');
    const URL = 'http://192.168.10.10/dav/';

    // axios({
    //         method: 'PROPFIND',
    //         url: URL,
    //         headers:{'Depth':1},
    //         // responseType: 'stream'
    //     })
    //     .then(function (response) {
    //         console.log(response);
    //     });


    JWDC = (() => {
        let _propfind = (url, depth) => {
            return axios({
                method: 'PROPFIND',
                url: url,
                headers: {
                    'Depth': depth
                },
            });
        }

        return {
            propfind: _propfind,
        }

    })();


    JWDC.propfind(URL, 1)
        .then(
            function (response) {
                let dataXML = response.data;

                const parser = new DOMParser();
                const xml = parser.parseFromString(dataXML, "application/xml");
                // ルート要素の名前またはエラーメッセージを出力します
                console.log(xml.documentElement.nodeName == "parsererror" ? "パース中にエラー発生" : xml);

                if (xml.documentElement.nodeName == "parsererror") {
                    return {};
                }

                // console.log('xml.documentElement');
                // console.log(xml.documentElement.childNodes);
                // console.log('---');
                // // console.log(xml.documentElement.querySelector(''));

                // console.log(xml.documentElement.querySelectorAll('response'));

                let ret = [];

                let responseList = xml.documentElement.querySelectorAll('response');

                for (const r of responseList) {
                    console.log(r);
                    // console.log(r.querySelector('displayname').textContent)

                    // console.log(r.querySelector('href').textContent)
                    // let lenElem = r.querySelector('getcontentlength');
                    // let len = lenElem==null?null:lenElem.textContent;
                    // console.log(len)
                    // console.log(r.querySelector('getlastmodified').textContent)

                    // console.log(r.querySelector('collection')==null?'file':'directory');


                    let lenElem = r.querySelector('getcontentlength');
                    let len = lenElem==null?null:lenElem.textContent;


                    let prop = {
                        name: r.querySelector('displayname').textContent,
                        href: r.querySelector('href').textContent,
                        length: len,
                        lastmodified: r.querySelector('getlastmodified').textContent,
                        isFile: r.querySelector('collection')==null,
                    };

                    // console.log(prop);
                    ret.push(prop);

                }
                console.log(ret);
                return ret;
            });



}
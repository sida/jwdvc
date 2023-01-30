'use strict';

JWDC.webdav = (() => {
    let _propfind = (url, depth) => {
        return axios({
            method: 'PROPFIND',
            url: url,
            headers: {
                'Depth': depth
            },
        });
    }

    let _parsePropfind = (dataXMLstring) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(dataXMLstring, "application/xml");

        console.log(xml.documentElement.nodeName == "parsererror" ? "パース中にエラー発生" : xml);

        if (xml.documentElement.nodeName == "parsererror") {
            return [];
        }

        let ret = [];

        let responseList = xml.documentElement.querySelectorAll('response');

        for (const r of responseList) {
            let lenElem = r.querySelector('getcontentlength');
            let len = lenElem == null ? null : lenElem.textContent;

            let _name = r.querySelector('displayname').textContent;
            let tmpSplitName = _name.split('.');
            let _ext = '';
            if (tmpSplitName.length >= 2) {
                _ext = tmpSplitName.pop();
            }

            let lastModify = r.querySelector('getlastmodified').textContent
            let date = Date.parse(lastModify);

            let prop = {
                name: _name,
                ext: _ext,
                href: r.querySelector('href').textContent,
                length: len,
                lastmodified: lastModify,
                date: date,
                isFile: r.querySelector('collection') == null,
            };
            ret.push(prop);
        }
        return ret;
    }

    return {
        propfind: _propfind,
        parsePropfind: _parsePropfind,
    };

})();
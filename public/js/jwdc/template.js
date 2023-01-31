'use strict';

JWDC.template = (() => {
    let _fileline = (file) => {

        let dt = fdate(file.date);
        let type = ftype(file);
        let len = flen(file);

        let htmlstring = `<tr><td><input type="checkbox" class="file-check" value="${file.name}"></td>
        <td class="file-name"> <a href="javascript:void(0)" onClick="JWDC.core.clickFilename('${file.name}')" >${file.name}</a></td>
        <td>${type}</td>
        <td>${len}</td>
        <td>${dt}</td></tr>`;

        return htmlstring;
    };

    function fdate(_date) {
        const date = new Date(_date);
        const formatted = date
            .toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
            })
            .split("/")
            .join("-");
        return formatted;
    }

    function ftype(file) {
        if (!file.isFile) {
            return '[DIR]';
        }
        return file.ext;
    }

    function flen(file) {
        if (file.length == null) {
            return '--';
        }
        return file.length;
    }

    return {
        fileLine: _fileline,
    }

})();
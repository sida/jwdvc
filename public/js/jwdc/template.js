'use strict';

JWDC.template = (() => {
    let _firstfileline = () => {
        let htmlstring = `<tr><td></td>
        <td class="file-name"> <a href="javascript:void(0)" onClick="JWDC.core.onClickFilename('..')" >..</a></td>
        <td>[DIR]</td>
        <td></td>
        <td></td></tr>`;

        return htmlstring;
    };

    let _fileline = (file) => {
        let dt = fdate(file.date);
        let type = ftype(file);
        let len = flen(file);
        let htmlstring = `<tr><td><input type="checkbox" class="file-check" value="${file.name}"></td>
        <td class="file-name"> <a href="javascript:void(0)" onClick="JWDC.core.onClickFilename('${file.name}')" >${file.name}</a></td>
        <td>${type}</td>
        <td>${len}</td>
        <td>${dt}</td></tr>`;

        return htmlstring;
    };

    function fdate(_date) {
        if (!_date) {
            return '';
        }
        return JWDC.util.formatDate(_date);
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
        firstfileline: _firstfileline,
    }

})();
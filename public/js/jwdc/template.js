'use strict';

JWDC.template = (() => {
    let _fileline = (file) => {

        // let d = f(new Date(file.date));
        let d = f(file.date);

        let htmlstring = `<div><span class="file-check"><input type="checkbox" name="" id=""></span> 
        <span class="file-name">${file.name}</span>
        <span class="file-type">${file.ext}</span>
        <span class="file-size">${file.length}</span>
        <span class="file-date">${d}</span></div>`;

        return htmlstring;
    };

    function f(_date) {
        const date = new Date(_date);
        const formatted = date
            .toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .split("/")
            .join("-");
        return formatted;
    }

    return {
        fileLine: _fileline,
    }

})();
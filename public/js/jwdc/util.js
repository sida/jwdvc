JWDC.util = (() => {
    let _joinpath = (base, ...args) => {
        let retPath = String(base).trim();
        for (const arg of args) {
            let p = String(arg).trim();

            if (p.startsWith('/')) {
                p = p.substring(1);
            }
            if (!retPath.endsWith('/')) {
                retPath = retPath + '/';
            }
            retPath = retPath.concat(p);
        }
        return retPath;
    }

    let _readFile = (fileIF) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = () => {
                reject(reader.error);
            }
            reader.readAsArrayBuffer(fileIF);
        });
    }

    let _searchFileInfo = (searchText) => {
        for (const info of JWDC.file_info) {
            if (info.name===searchText) {
                return info;
            }
        }
        return undefined;
    }

    return {
        joinPath: _joinpath,
        readFile: _readFile,
        searchFileInfo:_searchFileInfo,
    }
})();
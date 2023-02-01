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
            if (info.name === searchText) {
                return info;
            }
        }
        return undefined;
    }

    let _makeFullPath = (filename) => {
        return JWDC.util.joinPath(JWDC.core.getUrl(), filename);
    }

    let _makeDirPath = (dirname) => {
        return JWDC.util.joinPath(JWDC.core.getUrl(), dirname, '/');
    }

    let _formatDate = (_date) => {
        const date = new Date(_date);
        const formatted = date
            .toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                fractionalSecondDigits: 3,
                hour12: false,
            })
            .split("/")
            .join("-");
        return formatted;
    }

    let _checkStatus = (status) => {
        return Math.trunc(Number(status) / 100) * 100; 
    }

    return {
        joinPath: _joinpath,
        readFile: _readFile,
        searchFileInfo: _searchFileInfo,
        makeFullPath: _makeFullPath,
        makeDirPath: _makeDirPath,
        formatDate: _formatDate,
    }
})();
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

    return {
        joinPath: _joinpath,
    }
})();
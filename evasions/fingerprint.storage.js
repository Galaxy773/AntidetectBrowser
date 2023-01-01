//todo: думаю можно немного фейк байтов сделать в usage или заранее прогрузить некоторые файлы ютуба
(browserType, fakeGrantedBytes) => {
    if ('undefined' != typeof StorageManager) {
        //todo: проверить
        if (browserType === 'SAFARI') {
            let _Object = utils.cache.Object;
            delete _Object.getPrototypeOf(StorageManager).estimate
        } else if (browserType === 'FIREFOX') {
            let _Object = utils.cache.Object;
            delete _Object.getPrototypeOf(StorageManager).getDirectory
        }
        const _Reflect = utils.cache.Reflect;
        utils.replaceWithProxy(StorageManager.prototype, 'estimate', {
            apply(target, thisArg, args) {
                const old = _Reflect.apply(target, thisArg, args);
                //todo: pending
                return firefox || safari ? Promise.resolve({
                    quota: fakeGrantedBytes,
                    usage: old.usage
                }) : Promise.resolve({
                    quota: fakeGrantedBytes,
                    usage: old.usage,
                    usageDetails: old.usageDetails
                });
            },
        });
    }
    if (navigator.webkitPersistentStorage) {
        try {
            const persistentQuery = navigator.webkitPersistentStorage.queryUsageAndQuota
            const pStorage = navigator.webkitPersistentStorage
            pStorage.queryUsageAndQuota = function queryUsageAndQuota(callback, err) {
                const modifiedCallback = function (usedBytes, grantedBytes) {
                    callback(usedBytes, fakeGrantedBytes)
                }
                persistentQuery.call(navigator.webkitPersistentStorage, modifiedCallback, err)
            }.bind(null)
            Object.defineProperty(Navigator.prototype, 'webkitPersistentStorage', {get: (() => pStorage).bind(null)})
        } catch (ignored) {}
    }
    if (navigator.webkitTemporaryStorage) {
        try {
            const temporaryQuery = navigator.webkitTemporaryStorage.queryUsageAndQuota
            const tStorage = navigator.webkitTemporaryStorage
            tStorage.queryUsageAndQuota = function queryUsageAndQuota(callback, err) {
                const modifiedCallback = function (usedBytes, grantedBytes) {
                    callback(usedBytes, fakeGrantedBytes)
                }
                temporaryQuery.call(navigator.webkitTemporaryStorage, modifiedCallback, err)
            }.bind(null)
            Object.defineProperty(Navigator.prototype, 'webkitTemporaryStorage', {get: (() => tStorage).bind(null)})
        } catch (ignored) {}
    }
}

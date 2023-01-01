(realOffset) => {
    const _Reflect = utils.cache.Reflect;

    const offset = -realOffset - new Date().getTimezoneOffset();

    utils.replaceWithProxy(Date.prototype, 'getTime', {
        apply(target, thisArg, args) {
            let realTime = _Reflect.apply(target, thisArg, args);
            return realTime + offset * 60 * 1000;
        }
    });

    utils.replaceWithProxy(Date, 'now', {
        apply() {
            return new Date().getTime();
        }
    })
}

(browserType, fakeKeyboard) => {
    if (browserType === 'FIREFOX' || browserType === 'SAFARI') {
        delete window.KeyboardLayoutMap;
        delete window.Keyboard;
        return;
    }

    const _Reflect = utils.cache.Reflect;

    if (fakeKeyboard && 'undefined' !== typeof KeyboardLayoutMap) {
        utils.replaceWithProxy(KeyboardLayoutMap.prototype, 'get', {
            apply(target, thisArg, args) {
                if (args && args.length && fakeKeyboard[args[0]]) {
                    return fakeKeyboard[args[0]];
                }

                return _Reflect.apply(target, thisArg, args);
            },
        });
    }
}

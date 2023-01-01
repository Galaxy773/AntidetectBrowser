(fakeMatchMedia) => {
    const _Reflect = utils.cache.Reflect;

    //хуй знает, так или нет. Похуй, пусть будет так
    utils.replaceWithProxy(window, 'matchMedia', {
        apply(target, thisArg, args) {
            let result = _Reflect.apply(target, thisArg, args);
            let keys = args[0].split("(")[1].split(")")[0].split(": ");
            if (keys.length >= 2) {
                if (fakeMatchMedia[keys[0]] === 'none' || fakeMatchMedia[keys[0]] === keys[1]) {
                    utils.replaceGetterWithProxy(result, 'matches', {
                        apply() {
                            return true;
                        }
                    })
                }
            }
            return result;
        },
    });
}

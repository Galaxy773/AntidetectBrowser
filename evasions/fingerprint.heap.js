(browserType, fakeHeap) => {
    if (typeof Performance !== 'undefined') {
        //todo: проверить
        let _Object = utils.cache.Object;
        const _Reflect = utils.cache.Reflect;
        let proto = _Object.getPrototypeOf(Performance);

        if (browserType === 'FIREFOX' || browserType === 'SAFARI') {
            delete proto.memory;
            delete proto.measureUserAgentSpecificMemory;
            if (browserType === 'SAFARI') {
                delete proto.eventCounts;
            }
            return;
        }

        if (browserType === 'OPERA') {
            delete proto.getEntriesByName;
            delete proto.getEntries;
            delete proto.toJSON;
        } else {
            //todo: toJSON
        }

        utils.replaceGetterWithProxy(proto, 'memory', {
            apply(target, thisArg, args) {
                let memoryObj = _Reflect.apply(target, thisArg, args);
                let newMemoryObj = {
                    jsHeapSizeLimit: fakeHeap,
                    totalJSHeapSize: memoryObj.totalJSHeapSize,
                    usedJSHeapSize: memoryObj.usedJSHeapSize
                }
                Object.setPrototypeOf(newMemoryObj, memoryObj);
                return newMemoryObj;
            }
        });
    }
}

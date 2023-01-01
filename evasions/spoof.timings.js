(realOffset) => {
    if (typeof Performance !== 'undefined') {
        const _Reflect = utils.cache.Reflect;

        const offset = -realOffset - new Date().getTimezoneOffset();

        const spoofTime = function(target, thisArg, args) {
            let realTime = _Reflect.apply(target, thisArg, args);
            if (realTime <= 0) {
                return realTime;
            }
            return realTime + offset * 60 * 1000;
        };

        const timingsProperties = [
            'connectEnd',
            'connectStart',
            'domComplete',
            'domContentLoadedEventEnd',
            'domContentLoadedEventStart',
            'domInteractive',
            'domLoading',
            'domainLookupEnd',
            'domainLookupStart',
            'fetchStart',
            'loadEventEnd',
            'loadEventStart',
            'navigationStart',
            'redirectEnd',
            'redirectStart',
            'requestStart',
            'responseEnd',
            'responseStart',
            'secureConnectionStart',
            'unloadEventEnd',
            'unloadEventStart'
        ];

        for (var key in timingsProperties) {
            const timingName = timingsProperties[key];
            utils.replaceGetterWithProxy(PerformanceTiming.prototype, timingName, {
                apply(target, thisArg, args) {
                    return spoofTime(target, thisArg, args);
                }
            })
        }

        utils.replaceGetterWithProxy(Performance.prototype, 'timeOrigin', {
            apply(target, thisArg, args) {
                return spoofTime(target, thisArg, args);
            }
        })


        utils.replaceWithProxy(Performance.prototype, 'toJSON', {
            apply(target, thisArg, args) {
                let realJson = _Reflect.apply(target, thisArg, args);
                realJson.timeOrigin = window.performance.timeOrigin;
                return realJson;
            }
        })
    }
}

() => {
    utils = {};

    utils._preloadCache = () => {
        if (utils.cache) {
            return;
        }

        utils.cache = OffscreenCanvas.prototype.constructor.__$cache;
        if (utils.cache) {
            return;
        }

        class ɵɵɵɵPromise extends Promise {
        }

        OffscreenCanvas.prototype.constructor.__$cache = utils.cache = {
            // Used in `makeNativeString`
            nativeToStringStr: Function.toString + '', // => `function toString() { [native code] }`
            // Used in our proxies
            Reflect: {
                get: Reflect.get.bind(Reflect),
                set: Reflect.set.bind(Reflect),
                apply: Reflect.apply.bind(Reflect),
                ownKeys: Reflect.ownKeys.bind(Reflect),
                getOwnPropertyDescriptor: Reflect.getOwnPropertyDescriptor.bind(Reflect),
                setPrototypeOf: Reflect.setPrototypeOf.bind(Reflect),
            },
            Promise: ɵɵɵɵPromise,
            Object: {
                setPrototypeOf: Object.setPrototypeOf.bind(Object),
                getPrototypeOf: Object.getPrototypeOf.bind(Object),
                getOwnPropertyDescriptors: Object.getOwnPropertyDescriptors.bind(Object),
                getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor.bind(Object),
                entries: Object.entries.bind(Object),
                fromEntries: Object.fromEntries.bind(Object),
                defineProperty: Object.defineProperty.bind(Object),
                defineProperties: Object.defineProperties.bind(Object),
                getOwnPropertyNames: Object.getOwnPropertyNames.bind(Object),
                create: Object.create.bind(Object),
                keys: Object.keys.bind(Object),
                values: Object.values.bind(Object),
            },
            Function: {
                prototype: {
                    toString: Function.prototype.toString,
                },
            },
            global: 'undefined' !== typeof window ? window : globalThis,
            window: {
                getComputedStyle: ('undefined' !== typeof window) && window.getComputedStyle.bind(window),
                eval: ('undefined' !== typeof window) ? window.eval.bind(window) : (globalThis ? globalThis.eval.bind(globalThis) : undefined),
                navigator: ('undefined' !== typeof window) ? window.navigator : (globalThis ? globalThis.navigator : undefined),
            },
            OffscreenCanvas: {
                prototype: {
                    getContext: ('undefined' !== typeof OffscreenCanvas) && OffscreenCanvas.prototype.getContext,
                },
            },
            HTMLCanvasElement: {
                prototype: {
                    getContext: ('undefined' !== typeof HTMLCanvasElement) && HTMLCanvasElement.prototype.getContext,
                },
            },
            Descriptor: {},
        };

        const cacheDescriptors = (objPath, propertyKeys) => {
            // get obj from path
            const objPaths = objPath.split('.');
            let _global = utils.cache.global;
            let descObj = utils.cache.Descriptor;

            for (const part of objPaths) {
                if (_global) {
                    // noinspection JSUnresolvedFunction
                    if (!Object.hasOwn(_global, part)) {
                        _global = undefined;
                    } else {
                        _global = _global[part];
                    }
                }

                const subCacheObj = descObj[part] || {};
                descObj[part] = subCacheObj;
                descObj = subCacheObj;
            }

            for (const key of propertyKeys) {
                descObj[key] = _global ? Object.getOwnPropertyDescriptor(_global, key) : undefined;
            }
        };

        cacheDescriptors('window', ['alert']);
        cacheDescriptors('Navigator.prototype', ['webdriver']);
        cacheDescriptors('WorkerNavigator.prototype', ['webdriver']);
        cacheDescriptors('HTMLElement.prototype', ['style']);
        cacheDescriptors('CSSStyleDeclaration.prototype', ['setProperty']);
        cacheDescriptors('FontFace.prototype', ['load']);
        cacheDescriptors('WebGLShaderPrecisionFormat.prototype', ['rangeMin', 'rangeMax', 'precision']);
    };

    utils._preloadGlobalVariables = () => {
        if (utils.variables) {
            return;
        }

        utils.variables = OffscreenCanvas.prototype.constructor.__$variables;
        if (utils.variables) {
            return;
        }

        OffscreenCanvas.prototype.constructor.__$variables = utils.variables = {
            proxies: [],
            toStringPatchObjs: [],
            toStringRedirectObjs: [],
            renderingContextWithOperators: [],
            taskData: {},
        };
    };

    utils._preloadEnv = () => {
        if (utils.env) {
            return;
        }

        utils.env = OffscreenCanvas.prototype.constructor.__$env;
        if (utils.env) {
            return;
        }

        OffscreenCanvas.prototype.constructor.__$env = utils.env = {
            isWorker: !globalThis.document && !!globalThis.WorkerGlobalScope,
            isSharedWorker: !!globalThis.SharedWorkerGlobalScope,
            isServiceWorker: !!globalThis.ServiceWorkerGlobalScope,
        };
    };

    utils._hookObjectPrototype = () => {
        if (utils.objHooked) {
            return;
        }

        utils.objHooked = OffscreenCanvas.prototype.constructor.__$objHooked;
        if (utils.objHooked) {
            return;
        }

        utils.objHooked = OffscreenCanvas.prototype.constructor.__$objHooked = true;
        const _Object = utils.cache.Object;
        const _Reflect = utils.cache.Reflect;

        // setPrototypeOf
        utils.replaceWithProxy(Object, 'setPrototypeOf', {
            apply(target, thisArg, args) {
                args[0] = utils.getProxyTarget(args[0]);
                args[1] = utils.getProxyTarget(args[1]);

                return _Reflect.apply(target, thisArg, args);
            },
        });

        // Function.prototype toString
        const toStringProxy = utils.newProxyInstance(
            Function.prototype.toString,
            utils.stripProxyFromErrors({
                apply: function (target, thisArg, args) {
                    // This fixes e.g. `HTMLMediaElement.prototype.canPlayType.toString + ""`
                    if (thisArg === Function.prototype.toString) {
                        return utils.makeNativeString('toString');
                    }

                    // toStringPatch
                    const toStringPatchObj = utils.variables.toStringPatchObjs.find(
                        e => e.obj === thisArg,
                    );

                    if (toStringPatchObj) {
                        // `toString` targeted at our proxied Object detected
                        // We either return the optional string verbatim or derive the most desired result automatically
                        return toStringPatchObj.str || utils.makeNativeString(toStringPatchObj.obj.name);
                    }

                    // toStringRedirect
                    const toStringRedirectObj = utils.variables.toStringRedirectObjs.find(
                        e => e.proxyObj === thisArg,
                    );

                    if (toStringRedirectObj) {
                        const {proxyObj, originalObj} = toStringRedirectObj;
                        const fallback = () =>
                            originalObj && originalObj.name
                                ? utils.makeNativeString(originalObj.name)
                                : utils.makeNativeString(proxyObj.name);

                        // Return the toString representation of our original object if possible
                        return originalObj + '' || fallback();
                    }

                    if (typeof thisArg === 'undefined' || thisArg === null) {
                        return _Reflect.apply(target, thisArg, args);
                    }

                    // Check if the toString protype of the context is the same as the global prototype,
                    // if not indicates that we are doing a check across different windows., e.g. the iframeWithdirect` test case
                    const hasSameProto = _Object.getPrototypeOf(
                        Function.prototype.toString,
                    ).isPrototypeOf(thisArg.toString); // eslint-disable-line no-prototype-builtins

                    if (!hasSameProto) {
                        // Pass the call on to the local Function.prototype.toString instead
                        return thisArg.toString();
                    }

                    return _Reflect.apply(target, thisArg, args);
                },
            }),
        );

        utils.replaceProperty(Function.prototype, 'toString', {
            value: toStringProxy,
        });

        // Object create
        utils.replaceWithProxy(Object, 'create', {
            apply(target, thisArg, args) {
                if (args[0] === toStringProxy) {
                    args[0] = utils.cache.Function.prototype.toString;
                }

                return _Reflect.apply(target, thisArg, args);
            },
        });
    };

    utils.removeTempVariables = () => {
        const tmpVarNames =
            Object.getOwnPropertyNames(
                OffscreenCanvas.prototype.constructor,
            ).filter(e => e.startsWith('__$'));

        tmpVarNames.forEach(e => {
            delete OffscreenCanvas.prototype.constructor[e];
        });
    };

    utils.newProxyInstance = (target, handler) => {
        // const newTarget = utils.getProxyTarget(target);
        const result = new Proxy(target, handler);
        utils.variables.proxies.push({proxy: result, target});
        return result;
    };

    utils.getProxyTarget = (proxy) => {
        const cache = utils.variables.proxies.find(e => e.proxy === proxy);
        if (!cache) {
            return proxy;
        }

        return cache.target;
    };

    utils.patchError = (err, trap) => {

        if (!err || !err.stack || !err.stack.includes(`at `)) {
            return err;
        }

        // Special cases due to our nested toString proxies
        err.stack = err.stack.replace(
            'at Object.toString (',
            'at Function.toString (',
        );

        // 1
        let realTrap = '';
        let stackLines = err.stack.split('\n');

        let lineIndex = stackLines.findIndex(e => {
            const matches = e.match(/Object\.ɵɵɵɵnewHandler\.<computed> \[as (.*)]/);
            if (matches && matches[1]) {
                // 2
                realTrap = matches[1];
                return true;
            }

            return false;
        });

        if (lineIndex < 0 || !realTrap) {
            return err;
        }

        // let's start
        const fbCodeStackLineNumbers = [];

        const dumpLineNumbers = (line, add) => {
            const result = line.match(/:[0-9]+:[0-9]+/g) || [];
            if (add) {
                fbCodeStackLineNumbers.push(...result);
            }

            return result;
        };

        // 1.2
        dumpLineNumbers(stackLines[lineIndex], true);
        stackLines.splice(lineIndex, 1);

        // 3
        --lineIndex;
        if (stackLines[lineIndex].includes(`at Object.${realTrap} (`)) {
            // 3.1
            dumpLineNumbers(stackLines[lineIndex], true);
            stackLines.splice(lineIndex, 1);
        }

        for (let n = lineIndex - 1; n >= 0; --n) {
            const line = stackLines[n];

            // 4
            if (line.includes(`at new ɵɵɵɵPromise (eval at <anonymous>`)) {
                stackLines.splice(n, 1);

                // 4.1
                if (stackLines[n - 1] && stackLines[n - 1].includes(`at new Promise (<anonymous>)`)) {
                    --n;
                    stackLines.splice(n, 1);
                }

                continue;
            }

            // 5
            const lineNums = dumpLineNumbers(line, false);
            if (utils.intersectionSet(lineNums, fbCodeStackLineNumbers).size > 0) {
                fbCodeStackLineNumbers.push(...lineNums);
                stackLines.splice(n, 1);
            }
        }

        // 6
        err.stack = stackLines.join('\n');

        return err;
    };

    utils.stripProxyFromErrors = (handler = {}) => {
        const _Object = utils.cache.Object;
        const _Reflect = utils.cache.Reflect;

        const ɵɵɵɵnewHandler = {
            setPrototypeOf: function (target, proto) {
                if (proto === null)
                    throw new TypeError('Cannot convert object to primitive value');
                if (_Object.getPrototypeOf(target) === _Object.getPrototypeOf(proto)) {
                    throw new TypeError('Cyclic __proto__ value');
                }

                return _Reflect.setPrototypeOf(target, proto);
            },
        };

        // We wrap each trap in the handler in a try/catch and modify the error stack if they throw
        const traps = _Object.getOwnPropertyNames(handler);
        traps.forEach(trap => {
            ɵɵɵɵnewHandler[trap] = function () {
                try {
                    // Forward the call to the defined proxy handler
                    return handler[trap].apply(this, arguments || []);
                } catch (err) {
                    err = utils.patchError(err, trap);
                    throw err;
                }
            };
        });

        return ɵɵɵɵnewHandler;
    };

    utils.stripErrorWithAnchor = (err, anchor) => {
        const stackArr = err.stack.split('\n');
        const anchorIndex = stackArr.findIndex(line => line.trim().startsWith(anchor));

        if (anchorIndex === -1) {
            return err; // 404, anchor not found
        }

        // Strip everything from the top until we reach the anchor line (remove anchor line as well)
        // Note: We're keeping the 1st line (zero index) as it's unrelated (e.g. `TypeError`)
        stackArr.splice(1, anchorIndex);
        err.stack = stackArr.join('\n');

        return err;
    };

    utils.replaceProperty = (obj, propName, descriptorOverrides = {}) => {
        const _Object = utils.cache.Object;
        const descriptors = _Object.getOwnPropertyDescriptor(obj, propName) || {};

        // if (propName !== 'toString' && propName !== Symbol.toStringTag) {
        //     // noinspection JSUnusedLocalSymbols
        //     for (const [key, value] of _Object.entries(descriptorOverrides)) {
        //         if (descriptors[key]) {
        //             utils.redirectToString(descriptorOverrides[key], descriptors[key]);
        //         }
        //     }
        // }

        return _Object.defineProperty(obj, propName, {
            // Copy over the existing descriptors (writable, enumerable, configurable, etc)
            ...descriptors,
            // Add our overrides (e.g. value, get())
            ...descriptorOverrides,
        });
    };

    utils.makeNativeString = (name = '') => {
        return utils.cache.nativeToStringStr.replace('toString', name || '');
    };

    utils.patchToString = (obj, str = '') => {
        utils.variables.toStringPatchObjs.push({obj, str});
    };

    utils.patchToStringNested = (obj = {}) => {
        return utils.execRecursively(obj, ['function'], utils.patchToString);
    };

    utils.redirectToString = (proxyObj, originalObj) => {
        utils.variables.toStringRedirectObjs.push({proxyObj, originalObj});
    };

    utils.replaceWithProxy = (obj, propName, handler) => {
        const originalObj = obj[propName];
        const _Reflect = utils.cache.Reflect;

        if (!originalObj) {
            return false;
        }

        const proxyObj = utils.newProxyInstance(originalObj, utils.stripProxyFromErrors(handler));

        utils.replaceProperty(obj, propName, {value: proxyObj});
        utils.redirectToString(proxyObj, originalObj);

        return true;
    };

    utils.replaceGetterWithProxy = (obj, propName, handler) => {
        const desc = utils.cache.Object.getOwnPropertyDescriptor(obj, propName)
        if (desc) {
            const fn = utils.cache.Object.getOwnPropertyDescriptor(obj, propName).get;
            const fnStr = fn.toString(); // special getter function string
            const proxyObj = utils.newProxyInstance(fn, utils.stripProxyFromErrors(handler));

            utils.replaceProperty(obj, propName, {get: proxyObj});
            utils.patchToString(proxyObj, fnStr);

            return true;
        } else {
            return false;
        }
    };

    utils.replaceSetterWithProxy = (obj, propName, handler) => {
        const desc = utils.cache.Object.getOwnPropertyDescriptor(obj, propName)

        if (desc) {
            const fn = utils.cache.Object.getOwnPropertyDescriptor(obj, propName).set;
            const fnStr = fn.toString(); // special setter function string
            const proxyObj = utils.newProxyInstance(fn, utils.stripProxyFromErrors(handler));

            utils.replaceProperty(obj, propName, {set: proxyObj});
            utils.patchToString(proxyObj, fnStr);

            return true;
        } else {
            return false;
        }
    };

    utils.mockWithProxy = (obj, propName, pseudoTarget, descriptorOverrides, handler) => {
        const _Reflect = utils.cache.Reflect;

        if (!handler.get) {
            handler.get = function ɵɵɵɵget(target, property, receiver) {
                if (property === 'name') {
                    return propName;
                }

                return _Reflect.get(target, property, receiver);
            };
        }

        const proxyObj = pseudoTarget
            ? utils.newProxyInstance(pseudoTarget, utils.stripProxyFromErrors(handler))
            : utils.stripProxyFromErrors(handler);

        utils.replaceProperty(obj, propName, {
            ...descriptorOverrides,
            value: proxyObj,
        });

        utils.patchToString(proxyObj);

        return true;
    };

    utils.mockGetterWithProxy = (obj, propName, pseudoTarget, descriptorOverrides, handler) => {
        const _Reflect = utils.cache.Reflect;

        if (!handler.get) {
            handler.get = function ɵɵɵɵget(target, property, receiver) {
                if (property === 'name') {
                    return `get ${propName}`;
                }

                if (property === 'length') {
                    return 0;
                }

                return _Reflect.get(target, property, receiver);
            };
        }

        const proxyObj = pseudoTarget
            ? utils.newProxyInstance(pseudoTarget, utils.stripProxyFromErrors(handler))
            : utils.stripProxyFromErrors(handler);

        utils.replaceProperty(obj, propName, {
            ...descriptorOverrides,
            get: proxyObj,
        });

        utils.patchToString(proxyObj, `function get ${propName}() { [native code] }`);

        return true;
    };

    utils.mockSetterWithProxy = (obj, propName, pseudoTarget, descriptorOverrides, handler) => {
        const _Reflect = utils.cache.Reflect;

        if (!handler.get) {
            handler.get = function ɵɵɵɵget(target, property, receiver) {
                if (property === 'name') {
                    return `set ${propName}`;
                }

                if (property === 'length') {
                    return 1;
                }

                return _Reflect.get(target, property, receiver);
            };
        }

        const proxyObj = pseudoTarget
            ? utils.newProxyInstance(pseudoTarget, utils.stripProxyFromErrors(handler))
            : utils.stripProxyFromErrors(handler);

        utils.replaceProperty(obj, propName, {
            ...descriptorOverrides,
            set: proxyObj,
        });

        utils.patchToString(proxyObj, `function set ${propName}() { [native code] }`);

        return true;
    };

    utils.createProxy = (pseudoTarget, handler) => {
        const proxyObj = utils.newProxyInstance(
            pseudoTarget,
            utils.stripProxyFromErrors(handler),
        );

        utils.patchToString(proxyObj);

        return proxyObj;
    };

    utils.splitObjPath = objPath => ({
        // Remove last dot entry (property) ==> `HTMLMediaElement.prototype`
        objName: objPath.split('.').slice(0, -1).join('.'),
        // Extract last dot entry ==> `canPlayType`
        propName: objPath.split('.').slice(-1)[0],
    });

    utils.replaceObjPathWithProxy = (objPath, handler) => {
        const {objName, propName} = utils.splitObjPath(objPath);
        const obj = eval(objName); // eslint-disable-line no-eval
        return utils.replaceWithProxy(obj, propName, handler);
    };

    utils.execRecursively = (obj = {}, typeFilter = [], fn) => {
        function recurse(obj) {
            for (const key in obj) {
                if (obj[key] === undefined) {
                    continue;
                }
                if (obj[key] && typeof obj[key] === 'object') {
                    recurse(obj[key]);
                } else {
                    if (obj[key] && typeFilter.includes(typeof obj[key])) {
                        fn.call(this, obj[key]);
                    }
                }
            }
        }

        recurse(obj);
        return obj;
    };

    utils.stringifyFns = (fnObj = {hello: () => 'world'}) => {
        // Object.fromEntries() ponyfill (in 6 lines) - supported only in Node v12+, modern browsers are fine
        // https://github.com/feross/fromentries
        function fromEntries(iterable) {
            return [...iterable].reduce((obj, [key, val]) => {
                obj[key] = val;
                return obj;
            }, {});
        }

        // noinspection JSUnusedLocalSymbols
        return (Object.fromEntries || fromEntries)(
            Object.entries(fnObj)
                .filter(
                    ([key, value]) => typeof value === 'function',
                )
                .map(([key, value]) => [
                    key,
                    value.toString(),
                ]),
        );
    };

    utils.materializeFns = (fnStrObj = {hello: '() => \'world\''}) => {
        return Object.fromEntries(
            Object.entries(fnStrObj).map(([key, value]) => {
                if (value.startsWith('function')) {
                    // some trickery is needed to make oldschool functions work :-)
                    return [key, eval(`() => ${value}`)()]; // eslint-disable-line no-eval
                } else {
                    // arrow functions just work
                    return [key, eval(value)]; // eslint-disable-line no-eval
                }
            }),
        );
    };

    utils.makeHandler = () => ({
        getterValue: value => ({
            apply(target, thisArg, args) {
                const _Reflect = utils.cache.Reflect;

                _Reflect.apply(...arguments);
                return value;
            },
        }),
    });

    utils.sleep = (ms) => {
        return new utils.cache.Promise(resolve => setTimeout(resolve, ms));
    };

    utils.random = (a, b) => {
        const c = b - a + 1;
        return Math.floor(Math.random() * c + a);
    };

    utils.isHex = (str) => {
        try {
            if (str && 'string' === typeof str) {
                if (str.startsWith('0x')) {
                    str = str.substr(2);
                }

                return /^[A-F0-9]+$/i.test(str);
            }
        } catch (_) {
        }

        return false;
    };

    utils.isInt = (str) => {
        try {
            const isHex = utils.isHex(str);
            if (isHex) {
                return true;
            }

            return ('' + parseInt(str)) === ('' + str);
        } catch (_) {
        }

        return false;
    };

    utils.isUUID = (str) => {
        try {
            if ('string' === typeof str) {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
            }
        } catch (_) {
        }

        return false;
    };

    utils.isSequence = (obj) => {
        const _Object = utils.cache.Object;
        let desc = null;

        for (;
            obj && !!(desc = _Object.getOwnPropertyDescriptors(obj));
        ) {
            if (desc.forEach) {
                return true;
            }

            obj = _Object.getPrototypeOf(obj);
        }

        return false;
    };

    utils.intersectionSet = (a, b) => {
        if (b instanceof Array) {
            b = new Set(b);
        }

        return new Set([...a].filter(x => b.has(x)));
    };

    utils.unionSet = (a, b) => {
        return new Set([...a, ...b]);
    };

    utils.differenceABSet = (a, b) => {
        if (b instanceof Array) {
            b = new Set(b);
        }

        return new Set([...a].filter(x => !b.has(x)));
    };

    utils.makeFuncName = (len) => {
        if (!len) {
            len = 4;
        }

        let result = '';
        for (let n = 0; n < len; ++n) {
            result += String.fromCharCode(utils.random(65, 90));
        }

        return result;
    };

    utils.getCurrentScriptPath = () => {
        let a = {}, stack;
        try {
            a.b();
        } catch (e) {
            // noinspection JSUnresolvedVariable
            stack = e.stack || e.sourceURL || e.stacktrace;
        }

        let rExtractUri = /(?:http|https|file):\/\/.*?\/.+?\.js/,
            absPath = rExtractUri.exec(stack);

        if (!absPath) {
            absPath = /(?:http|https|file):\/\/.*?\/.+?:?/.exec(stack);
            if (absPath) {
                absPath[0] = absPath[0].substr(0, absPath[0].length - 1);
            }
        }

        return (absPath && absPath[0]) || '';
    };

    utils.makePseudoClass = (
        root,
        name,
        pseudoTarget,
        parentClass,
    ) => {
        const _Object = utils.cache.Object;

        const result = new Proxy(
            pseudoTarget || function () {
                throw utils.patchError(new TypeError(`Illegal constructor`), 'construct');
            },
            {
                // noinspection JSUnusedLocalSymbols
                construct(target, args) {
                    throw utils.patchError(new TypeError(`Illegal constructor`), 'construct');
                },
            },
        );

        root[name] = result;

        _Object.defineProperty(result, 'name', {
            configurable: true,
            enumerable: false,
            writable: false,
            value: name,
        });

        _Object.defineProperty(result, 'prototype', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: result.prototype,
        });

        utils.patchToString(result, `function ${name}() { [native code] }`);
        utils.patchToString(result.prototype.constructor, `function ${name}() { [native code] }`);

        _Object.defineProperty(result.prototype, Symbol.toStringTag, {
            configurable: true,
            enumerable: false,
            writable: false,
            value: name,
        });

        if (parentClass && parentClass.prototype) {
            _Object.setPrototypeOf(result.prototype, parentClass.prototype);
        }

        return result;
    };

    utils.markRenderingContextOperator = (context, operatorName) => {
        const result = utils.variables.renderingContextWithOperators.findIndex(e => e.context === context);

        if (result >= 0) {
            const operators = utils.variables.renderingContextWithOperators[result];
            if (operators) {
                operators.operators[operatorName] = true;
            }
        }

        return result;
    };

    utils.findRenderingContextIndex = (canvas) => {
        const contextIds = [
            '2d',
            'webgl', 'experimental-webgl',
            'webgl2', 'experimental-webgl2',
            'bitmaprenderer',
        ];

        for (let contextId of contextIds) {
            let context = null;

            if (utils.cache.Object.getPrototypeOf(canvas) === OffscreenCanvas.prototype) {
                context = utils.cache.OffscreenCanvas.prototype.getContext.call(canvas, contextId);
            } else {
                context = utils.cache.HTMLCanvasElement.prototype.getContext.call(canvas, contextId);
            }

            const contextIndex = utils.variables.renderingContextWithOperators.findIndex(e => e.context === context);

            if (contextIndex >= 0) {
                return {context, contextIndex};
            }
        }

        return {context: null, contextIndex: -1};
    };

    utils._preloadCache();
    utils._preloadEnv();
    utils._preloadGlobalVariables();
    utils._hookObjectPrototype();
}

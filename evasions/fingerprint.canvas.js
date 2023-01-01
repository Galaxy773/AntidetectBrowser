(browserType, canvasSalt) => {
    const _Object = utils.cache.Object;
    const _Reflect = utils.cache.Reflect;

    const kNoiseOpers = [
        'createLinearGradient',
        'fillText',
        'scale',
        'strokeText',
        'transform',
        'arc',
        'arcTo',
        'bezierCurveTo',
        'ellipse',
        'lineTo',
        'quadraticCurveTo',
        'rotate',
    ];

    let _OffscreenCanvas_prototype_getContext = null;
    let _HTMLCanvasElement_prototype_getContext = null;

    let _WebGLRenderingContext_prototype_readPixels = null;
    let _WebGL2RenderingContext_prototype_readPixels = null;
    let _OffscreenCanvasRenderingContext2D_prototype_getImageData = null;
    let _CanvasRenderingContext2D_prototype_getImageData = null;

    const classes = [];
    if ('undefined' !== typeof OffscreenCanvas) {
        if (browserType === 'SAFARI') {
            delete window.OffscreenCanvas;
            delete window.OffscreenCanvasRenderingContext2D;
        } else {
            classes.push({
                _Canvas: OffscreenCanvas,
                _CanvasRenderingContext2D: OffscreenCanvasRenderingContext2D,
                _Canvas_prototype_getContext: OffscreenCanvas.prototype.getContext,
                _Canvas_prototype_toDataURL: OffscreenCanvas.prototype.toDataURL,
            });

            _OffscreenCanvas_prototype_getContext = OffscreenCanvas.prototype.getContext;
            _OffscreenCanvasRenderingContext2D_prototype_getImageData = OffscreenCanvasRenderingContext2D.prototype.getImageData;
        }
    }

    if ('undefined' !== typeof HTMLCanvasElement) {
        classes.push({
            _Canvas: HTMLCanvasElement,
            _CanvasRenderingContext2D: CanvasRenderingContext2D,
            _Canvas_prototype_getContext: HTMLCanvasElement.prototype.getContext,
            _Canvas_prototype_toDataURL: HTMLCanvasElement.prototype.toDataURL,
        });

        _HTMLCanvasElement_prototype_getContext = HTMLCanvasElement.prototype.getContext;
        _CanvasRenderingContext2D_prototype_getImageData = CanvasRenderingContext2D.prototype.getImageData;
    }

    if ('undefined' !== typeof WebGLRenderingContext) {
        _WebGLRenderingContext_prototype_readPixels = WebGLRenderingContext.prototype.readPixels;
    }

    if ('undefined' !== typeof WebGL2RenderingContext) {
        _WebGL2RenderingContext_prototype_readPixels = WebGL2RenderingContext.prototype.readPixels;
    }

    const getContextImageUint8Data = (context) => {
        let result = null;
        const contextPrototype = _Object.getPrototypeOf(context);

        if (
            'undefined' !== typeof CanvasRenderingContext2D
            && contextPrototype === CanvasRenderingContext2D.prototype
        ) {
            result = _CanvasRenderingContext2D_prototype_getImageData.call(
                context,
                0, 0,
                context.canvas.width, context.canvas.height,
            ).data;
        } else if (
            'undefined' !== typeof OffscreenCanvasRenderingContext2D
            && contextPrototype === OffscreenCanvasRenderingContext2D.prototype
        ) {
            result = _OffscreenCanvasRenderingContext2D_prototype_getImageData.call(
                context,
                0, 0,
                context.canvas.width, context.canvas.height,
            ).data;
        } else if (
            'undefined' !== typeof WebGLRenderingContext
            && contextPrototype === WebGLRenderingContext.prototype
        ) {
            result = new Uint8ClampedArray(context.drawingBufferWidth * context.drawingBufferHeight * 4);

            _WebGLRenderingContext_prototype_readPixels.call(
                context,
                0,
                0,
                context.drawingBufferWidth,
                context.drawingBufferHeight,
                context.RGBA,
                context.UNSIGNED_BYTE,
                result);
        } else if (
            'undefined' !== typeof WebGL2RenderingContext
            && contextPrototype === WebGL2RenderingContext.prototype
        ) {
            result = new Uint8ClampedArray(context.drawingBufferWidth * context.drawingBufferHeight * 4);

            _WebGL2RenderingContext_prototype_readPixels.call(
                context,
                0,
                0,
                context.drawingBufferWidth,
                context.drawingBufferHeight,
                context.RGBA,
                context.UNSIGNED_BYTE,
                result);
        }

        return result;
    };

    for (const {
        _Canvas,
        _CanvasRenderingContext2D,
        _Canvas_prototype_getContext,
        _Canvas_prototype_toDataURL,
    } of classes) {
        utils.replaceWithProxy(_Canvas.prototype, 'getContext', {
            apply(target, thisArg, args) {
                const [contextId, options] = args;
                const context = _Reflect.apply(target, thisArg, args);

                utils.variables.renderingContextWithOperators.push({
                    canvas: thisArg,
                    context,
                    contextId,
                    operators: {},
                });

                return context;
            },
        });

        for (const noiseOper of kNoiseOpers) {
            utils.replaceWithProxy(_CanvasRenderingContext2D.prototype, noiseOper, {
                apply(target, thisArg, args) {
                    utils.markRenderingContextOperator(thisArg, noiseOper);
                    return _Reflect.apply(target, thisArg, args);
                },
            });
        }

        const getNoisifyCanvas = (canvas) => {
            const {
                context: originalContext,
                contextIndex,
            } = utils.findRenderingContextIndex(canvas);

            if (contextIndex < 0) {
                return canvas;
            }

            const context = utils.variables.renderingContextWithOperators[contextIndex];

            if (!(
                (context.contextId === 'webgl' || context.contextId === 'experimental-webgl')
                || (context.contextId === 'webgl2' || context.contextId === 'experimental-webgl2')
                || Object.keys(context.operators).length !== 0
            )) {
                return canvas;
            }

            let canvasWithNoise =
                _Object.getPrototypeOf(canvas) === (('undefined' !== typeof OffscreenCanvas) && OffscreenCanvas.prototype)
                    ? new OffscreenCanvas(canvas.width, canvas.height)
                    : document.createElement('canvas');

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            canvasWithNoise.width = canvasWidth;
            canvasWithNoise.height = canvasHeight;

            let newContext =
                _Object.getPrototypeOf(canvas) === (('undefined' !== typeof OffscreenCanvas) && OffscreenCanvas.prototype)
                    ? _OffscreenCanvas_prototype_getContext.call(canvasWithNoise, '2d')
                    : _HTMLCanvasElement_prototype_getContext.call(canvasWithNoise, '2d');

            const imageUint8DataOriginal = getContextImageUint8Data(originalContext);
            const imageUint8Data = Uint8ClampedArray.from(imageUint8DataOriginal);

            let saltIndex = 0;
            for (let y = 0; y < canvasHeight - 1; y += 2) {
                for (let x = 0; x < canvasWidth - 1; x += 2) {
                    const pos = y * canvasWidth + x;

                    const
                        p00 = imageUint8DataOriginal[pos],
                        p01 = imageUint8DataOriginal[pos + 1];
                    const
                        p10 = imageUint8DataOriginal[pos + canvasWidth],
                        p11 = imageUint8DataOriginal[pos + canvasWidth + 1];

                    if (p00 !== p01 || p00 !== p10 || p00 !== p11) {
                        const salt = canvasSalt[saltIndex];
                        imageUint8Data[pos] += salt;

                        ++saltIndex;
                        if (saltIndex >= canvasSalt.length) {
                            saltIndex = 0;
                        }
                    }
                }
            }

            newContext.putImageData(new ImageData(imageUint8Data, canvasWidth, canvasHeight), 0, 0);

            return canvasWithNoise;
        };

        utils.replaceWithProxy(_Canvas.prototype, 'toDataURL', {
            apply(target, thisArg, args) {
                let canvas = thisArg;

                const {context, contextIndex} = utils.findRenderingContextIndex(canvas);

                if (contextIndex >= 0) {
                    canvas = getNoisifyCanvas(thisArg);
                }

                return _Reflect.apply(target, canvas, args);
            },
        });

        utils.replaceWithProxy(_Canvas.prototype, 'toBlob', {
            apply(target, thisArg, args) {
                let canvas = thisArg;
                const {contextIndex} = utils.findRenderingContextIndex(canvas);

                if (contextIndex >= 0) {
                    canvas = getNoisifyCanvas(thisArg);
                }

                return _Reflect.apply(target, canvas, args);
            },
        });

        utils.replaceWithProxy(_Canvas.prototype, 'convertToBlob', {
            apply(target, thisArg, args) {
                let canvas = thisArg;
                const {contextIndex} = utils.findRenderingContextIndex(canvas);

                if (contextIndex >= 0) {
                    canvas = getNoisifyCanvas(thisArg);
                }

                return _Reflect.apply(target, canvas, args);
            },
        });

        utils.replaceWithProxy(_CanvasRenderingContext2D.prototype, 'getImageData', {
            apply(target, thisArg, args) {
                let context = thisArg;
                const contextIndex = utils.variables.renderingContextWithOperators.findIndex(e => e.context === context);

                if (contextIndex >= 0) {
                    const newCanvas = getNoisifyCanvas(thisArg.canvas);
                    context = _Canvas_prototype_getContext.call(newCanvas, '2d');
                }

                return _Reflect.apply(target, context, args);
            },
        });
    }
}

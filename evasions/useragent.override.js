(override) => {
    if ('undefined' !== typeof NavigatorUAData) {
        utils.replaceGetterWithProxy(NavigatorUAData.prototype, 'brands', {
            apply() {
                return JSON.parse(JSON.stringify(override.userAgentMetadata.brands));
            },
        });

        utils.replaceGetterWithProxy(NavigatorUAData.prototype, 'platform', {
            apply() {
                return override.userAgentMetadata.platform;
            },
        });

        utils.replaceWithProxy(NavigatorUAData.prototype, 'getHighEntropyValues', {
            apply(target, thisArg, args) {
                const result = {
                    brands: override.userAgentMetadata.brands,
                    mobile: override.userAgentMetadata.mobile,
                };

                if (args && args[0] && args[0].length) {
                    for (const n of args[0]) {
                        if (n in override.userAgentMetadata) {
                            result[n] = override.userAgentMetadata[n];
                        } else if (n === 'uaFullVersion') {
                            result[n] = override.userAgentMetadata.fullVersion;
                        }
                    }
                }

                return Promise.resolve(JSON.parse(JSON.stringify(result)));
            },
        });

        // noinspection JSUnresolvedVariable
        utils.replaceWithProxy(NavigatorUAData.prototype, 'toJSON', {
            apply() {
                const result = {
                    brands: override.userAgentMetadata.brands,
                    mobile: override.userAgentMetadata.mobile,
                };

                return Promise.resolve(JSON.parse(JSON.stringify(result)));
            },
        });
    }
}

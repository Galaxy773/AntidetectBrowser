(osType, fakePermissions) => {
    const _Object = utils.cache.Object;
    const _Reflect = utils.cache.Reflect;

    // after test, iOS chrome did not implements `navigator.permissions`
    if (osType === 'IPHONE' || osType === 'IPAD' || osType === 'IPOD') {
        delete _Object.getPrototypeOf(navigator).permission;
    } else {
        if ('undefined' !== typeof Notification) {
            utils.replaceGetterWithProxy(Notification, 'permission', {
                apply(target, thisArg, args) {
                    _Reflect.apply(target, thisArg, args);
                    return 'default';
                },
            });
        }

        // We need to handle exceptions
        utils.replaceWithProxy(Permissions.prototype, 'query', {
            apply(target, thisArg, args) {
                const param = (args || [])[0];
                const paramName = param && param.name;

                return new utils.cache.Promise((resolve, reject) => {
                    const permission = fakePermissions[paramName];

                    if (permission) {
                        let exType = permission.exType;
                        if (exType) {
                            if (!globalThis[exType]) {
                                exType = 'Error';
                            }

                            return reject(
                                utils.patchError(new globalThis[exType](permission.msg), 'apply'),
                            );
                        }

                        let state = permission.state;
                        if (state) {
                            return resolve(_Object.setPrototypeOf({
                                state: state,
                                onchange: null,
                            }, PermissionStatus.prototype));
                        }
                    }

                    _Reflect.apply(...arguments).then(result => {
                        return resolve(result);
                    }).catch(ex => {
                        return reject(utils.patchError(ex, 'apply'));
                    });
                });
            },
        });
    }
}

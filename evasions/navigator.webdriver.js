() => {
    const webdriverDesc = utils.cache.Descriptor.Navigator.prototype.webdriver
        || utils.cache.Descriptor.WorkerNavigator.prototype.webdriver;

    if (webdriverDesc === undefined) {
        // Post Chrome 89.0.4339.0 and already good
        return;
    }

    // invoke the original getter of prototype, *DO NOT* use the code like: ' navigator.webdriver === false '
    const get_webdriverFunc = webdriverDesc.get.bind(utils.cache.window.navigator);
    if (get_webdriverFunc === false) {
        // Pre Chrome 89.0.4339.0 and already good
        return;
    }

    // Pre Chrome 88.0.4291.0 and needs patching
    delete Object.getPrototypeOf(navigator).webdriver;
}

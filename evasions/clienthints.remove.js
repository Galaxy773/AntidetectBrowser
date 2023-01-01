() => {
    //todo: проверить
    let _Object = utils.cache.Object;
    delete _Object.getPrototypeOf(window).NavigatorUAData;
    delete _Object.getPrototypeOf(navigator).userAgentData;
    delete _Object.getPrototypeOf(navigator).uaParsed;
}

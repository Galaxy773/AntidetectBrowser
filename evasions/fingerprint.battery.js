(fakeBattery) => {
    // TODO: If it is a charging state, the user's power should keep increasing to a certain time full.
    // It also needs to simulate the situation that the user has unplugged the power.
    if ('undefined' != typeof BatteryManager) {
        if (!fakeBattery.hasBatteryApi) {
            delete window.BatteryManager;
            delete navigator.getBattery;
            return;
        }
        utils.replaceGetterWithProxy(
            BatteryManager.prototype,
            'charging',
            utils.makeHandler().getterValue(fakeBattery.charging),
        );

        utils.replaceGetterWithProxy(
            BatteryManager.prototype,
            'chargingTime',
            utils.makeHandler().getterValue(fakeBattery.chargingTime === 'Infinity' ? Infinity : fakeBattery.chargingTime),
        );

        utils.replaceGetterWithProxy(
            BatteryManager.prototype,
            'dischargingTime',
            utils.makeHandler().getterValue(fakeBattery.dischargingTime === 'Infinity' ? Infinity : fakeBattery.dischargingTime),
        );

        utils.replaceGetterWithProxy(
            BatteryManager.prototype,
            'level',
            utils.makeHandler().getterValue(fakeBattery.level),
        );
    }
}

(fakeSensor) => {
    const _Reflect = utils.cache.reflect;

    var defineProp = function(proto, property, key) {
        utils.replaceGetterWithProxy(proto, property, {
            apply(target, thisArg, args) {
                const value = fakeSensor[key];
                if (!value) {
                    return _Reflect.apply(target, thisArg, args);
                }
                return value;
            }
        })
    }

    if (fakeSensor.ReplaceGyroscope && typeof Gyroscope !== 'undefined') {
        defineProp(Gyroscope.prototype, 'x', 'GyroscopeX');
        defineProp(Gyroscope.prototype, 'y', 'GyroscopeY');
        defineProp(Gyroscope.prototype, 'z', 'GyroscopeZ');
    }

    if (fakeSensor.ReplaceGravity && typeof GravitySensor !== 'undefined') {
        defineProp(GravitySensor.prototype, 'x', 'GravityX');
        defineProp(GravitySensor.prototype, 'y', 'GravityY');
        defineProp(GravitySensor.prototype, 'z', 'GravityZ');
    }

    if (fakeSensor.ReplaceAccelerometer && typeof Accelerometer !== 'undefined') {
        defineProp(Accelerometer.prototype, 'x', 'AccelerometerX');
        defineProp(Accelerometer.prototype, 'y', 'AccelerometerY');
        defineProp(Accelerometer.prototype, 'z', 'AccelerometerZ');
    }

    if (fakeSensor.ReplaceLinearAcceleration && typeof LinearAccelerationSensor !== 'undefined') {
        defineProp(LinearAccelerationSensor.prototype, 'x', 'LinearAccelerationX');
        defineProp(LinearAccelerationSensor.prototype, 'y', 'LinearAccelerationY');
        defineProp(LinearAccelerationSensor.prototype, 'z', 'LinearAccelerationZ');
    }

    //todo: quaternion
}

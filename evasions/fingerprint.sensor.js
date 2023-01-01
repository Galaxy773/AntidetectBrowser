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

    if (fakeSensor.ReplaceGyroscope && Gyroscope !== 'undefined') {
        defineProp(Gyroscope.prototype, 'x', 'GyroscopeX');
        defineProp(Gyroscope.prototype, 'y', 'GyroscopeY');
        defineProp(Gyroscope.prototype, 'z', 'GyroscopeZ');
    }

    if (fakeSensor.ReplaceGravity && GravitySensor !== 'undefined') {
        defineProp(GravitySensor.prototype, 'x', 'GravityX');
        defineProp(GravitySensor.prototype, 'y', 'GravityY');
        defineProp(GravitySensor.prototype, 'z', 'GravityZ');
    }

    if (fakeSensor.ReplaceAccelerometer && Accelerometer !== 'undefined') {
        defineProp(Accelerometer.prototype, 'x', 'AccelerometerX');
        defineProp(Accelerometer.prototype, 'y', 'AccelerometerY');
        defineProp(Accelerometer.prototype, 'z', 'AccelerometerZ');
    }

    if (fakeSensor.ReplaceLinearAcceleration && LinearAcceleration !== 'undefined') {
        defineProp(LinearAcceleration.prototype, 'x', 'LinearAccelerationX');
        defineProp(LinearAcceleration.prototype, 'y', 'LinearAccelerationY');
        defineProp(LinearAcceleration.prototype, 'z', 'LinearAccelerationZ');
    }

    //todo: quaternion
}

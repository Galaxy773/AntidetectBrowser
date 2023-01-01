(proxyExportIP, myRealExportIP) => {
    // RTCIceCandidate.prototype.candidate get function
    // RTCIceCandidate.prototype.address get function
    // RTCIceCandidate.prototype.toJSON value function
    // RTCSessionDescription.prototype.sdp get function
    // RTCSessionDescription.prototype.toJSON value function

    const fakeIPs = [myRealExportIP];

    if (!proxyExportIP || !fakeIPs || !fakeIPs.length) {
        return;
    }

    const _Reflect = utils.cache.Reflect;

    const replaceIps = (str) => {
        if (fakeIPs && proxyExportIP) {
            for (let fakeIP of fakeIPs) {
                str = str.replace(new RegExp(fakeIP, 'g'), proxyExportIP);
            }
        }

        return str;
    };

    utils.replaceGetterWithProxy(RTCIceCandidate.prototype, 'candidate', {
        apply(target, thisArg, args) {
            const org = _Reflect.apply(target, thisArg, args);
            const dest = replaceIps(org);

            // console.log('!!! h00k RTCIceCandidate_prototype_candidate_get:' + org + ' dest:' + dest);

            return dest;
        },
    });

    utils.replaceGetterWithProxy(RTCIceCandidate.prototype, 'address', {
        apply(target, thisArg, args) {
            const org = _Reflect.apply(target, thisArg, args);
            const dest = replaceIps(org);

            // console.log('!!! h00k RTCIceCandidate_prototype_address_get:' + org + ' dest:' + dest);

            return dest;
        },
    });

    utils.replaceWithProxy(RTCIceCandidate.prototype, 'toJSON', {
        apply(target, thisArg, args) {
            const org = JSON.stringify(_Reflect.apply(target, thisArg, args));
            const dest = replaceIps(org);

            // console.log('!!! h00k RTCIceCandidate_prototype_toJSON_value:' + org + ' dest:' + dest);

            return JSON.parse(dest);
        },
    });

    utils.replaceGetterWithProxy(RTCSessionDescription.prototype, 'sdp', {
        apply(target, thisArg, args) {
            const org = _Reflect.apply(target, thisArg, args);
            const dest = replaceIps(org);

            // console.log('!!! h00k RTCSessionDescription_prototype_sdp_get:' + org + ' dest:' + dest);

            return dest;
        },
    });

    utils.replaceWithProxy(RTCSessionDescription.prototype, 'toJSON', {
        apply(target, thisArg, args) {
            const org = JSON.stringify(_Reflect.apply(target, thisArg, args));
            const dest = replaceIps(org);

            // console.log('!!! h00k RTCSessionDescription_prototype_toJSON_value:' + org + ' dest:' + dest);

            return JSON.parse(dest);
        },
    });
}

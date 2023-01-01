(audioContext) => {
    var contextByName = (contextName) => {
        switch (contextName) {
            case 'AudioContext': return AudioContext;
            case 'BaseAudioContext': return BaseAudioContext;
            case 'AudioDestinationNode': return AudioDestinationNode;
            case 'AnalyzerNode': return AnalyserNode;
            case 'BiquadFilterNode': return BiquadFilterNode;
            case 'AudioBufferSourceNode': return AudioBufferSourceNode;
            case 'ConstantSourceNode': return ConstantSourceNode;
            case 'DelayNode': return DelayNode;
            case 'DynamicsCompressorNode': DynamicsCompressorNode;
            case 'GainNode': return GainNode;
            case 'OscillatorNode': return OscillatorNode;
            case 'StereoPannerNode': return StereoPannerNode;
            case 'AudioListener': return AudioListener;
            case 'PannerNode': return PannerNode;
        }
        return 'undefined';
    }

    for (var contextName in audioContext) {
        var obj = contextByName(contextName);
        if (obj !== 'undefined') {
            const properties = audioContext[contextName];
            for (var key in properties) {
                const value = properties[key];
                utils.replaceGetterWithProxy(obj.prototype, key, {
                    apply() {
                        //todo: prototype AudioParam
                        return value;
                    }
                })
            }
        }
    }
}

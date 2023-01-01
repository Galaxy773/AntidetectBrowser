(historyLength) => {
    for (let n = 0; n < historyLength; ++n) {
        if (window.history.length >= historyLength) {
            break;
        }

        window.history.pushState(null, '');
    }
}

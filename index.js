const progressIndicator = require('./progressIndicator.js');
const progress = new progressIndicator('bar', 250, null);
let steps = 0;
let retries = 100;

function show(interval, retries) {
    progress.start();
    timeout = setInterval(() => {
        steps++;

        progress.step(1);
        if (steps >= retries) {
            progress.stop();
            clearInterval(timeout);
        }
    }, interval);
}

show(100, retries);
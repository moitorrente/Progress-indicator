const process = require('process');
const line = require('readline');

class progressIndicator {
    constructor(type, maxValue, startSymbol, stopSymbol) {
        this.type = type;
        this.maxValue = maxValue;
        this.value = 0;
        this.maxRange = 25;
        this.cursor = 1;
        this.direction = 1;
        this.startSymbol = startSymbol || '[';
        this.stopSymbol = stopSymbol || ']'
        this.throbberFrames = ['\\', '|', '/', '-'];
    }

    start() {
        process.stdout.write('\x1B[?25l');
        if (this.type == 'bar' || this.type == 'indeterminate') {
            process.stdout.write(this.startSymbol);
            for (let i = 0; i < this.maxRange; i++) {
                process.stdout.write('-');
            }
            process.stdout.write(this.stopSymbol);
            line.cursorTo(process.stdout, this.cursor, line.cursor);
        }
    }

    step(stepSize) {
        switch (this.type) {
            case 'bar': this.progressUpdate(stepSize);
                break;
            case 'indeterminate': this.timeUpdate(stepSize);
                break;
            case 'throbber': this.throbberUpdate();
        }
    }

    stop() {
        line.cursorTo(process.stdout, 0);
        line.moveCursor(process.stdout, 0, 3);
        process.stdout.write('\x1B[?25h');
        process.stdout.write('\n\n');
    }

    progressUpdate(stepSize) {
        this.value += stepSize;
        let valuePerc = this.value / this.maxValue;
        let rangePerc = this.cursor / this.maxRange;
        if (valuePerc >= rangePerc) {
            line.cursorTo(process.stdout, this.cursor, line.cursor);
            line.moveCursor(process.stdout, 0, 0);
            process.stdout.write('=');
            if (valuePerc < 1) {
                this.cursor++;
            }
        }
        line.cursorTo(process.stdout, this.maxRange + this.startSymbol.length + this.stopSymbol.length + 3, line.cursor);
        let tempPerc = Math.floor(100 * valuePerc);
        let print = '| ' + tempPerc.toString() + '% | ' + this.value.toString() + ' of ' + this.maxValue.toString();
        process.stdout.write(print);
    }

    timeUpdate(stepSize) {
        line.cursorTo(process.stdout, 1, line.cursor);
        for (let i = 0; i < this.maxRange; i++) {
            process.stdout.write('-');
        }
        if (this.cursor == this.maxRange || (this.cursor < 2 && this.direction < 0)) {
            this.direction *= -1;
        }
        this.cursor = this.cursor + (this.direction * stepSize);
        line.cursorTo(process.stdout, this.cursor, line.cursor);
        line.moveCursor(process.stdout, 0, 0);
        process.stdout.write('=');
    }

    throbberUpdate() {
        line.cursorTo(process.stdout, 1, line.cursor);
        this.cursor += 1;
        if (this.cursor > this.throbberFrames.length - 1){
            this.cursor = 0;
        }
        process.stdout.write(this.throbberFrames[this.cursor]);
    }
}

module.exports = progressIndicator;
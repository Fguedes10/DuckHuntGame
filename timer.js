export class Timer {
  constructor(interval, callback) {
    this.remaining = interval;
    this.callback = callback;
    this.start = Date.now();
    this.isFinished = false;
    this.timeoutId = setTimeout(() => {
      this.callback();
      this.isFinished = true;
    }, this.remaining);
  }

  pause() {
    if (this.isFinished) {
      return;
    }
    clearTimeout(this.timeoutId);
    this.remaining -= Date.now() - this.start;
  }

  resume() {
    if (this.isFinished) {
      return;
    }
    this.start = Date.now();
    this.timeoutId = setTimeout(() => {
      this.callback();
      this.isFinished = true;
    }, this.remaining);
  }
  stop() {
    clearTimeout(this.timeoutId);
    this.isFinished = true;
  }
}

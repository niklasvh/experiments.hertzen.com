function BandwidthMonitor(options) {
  this.options = options || {};
  this.slow = 2024*1024;
  this.fast = 2024*1024;
}

BandwidthMonitor.prototype.progressTracker = function() {
  return function() {
    if (this.options.maxBandwidth) {
      this.slow = this.options.maxBandwidth;
      this.fast = this.options.maxBandwidth;
    }
  }.bind(this);
};

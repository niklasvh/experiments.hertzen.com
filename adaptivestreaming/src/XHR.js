function XHR(url, options) {
  options = options || {};
  options.type = options.type || "GET";
  options.responseType = options.responseType || "arraybuffer";
  var self = this;
  this.xhr = new XMLHttpRequest();
  this.xhr.open(options.type, url + "?" + Math.random());
  this.url = url;
  this.xhr.responseType = options.responseType;
  if (options.load) {
    this.xhr.addEventListener('load', function() {
      options.load.call(self, this);
    });
  }
  if (options.bandwidth) {
    this.xhr.addEventListener('progress', options.bandwidth.progressTracker());
  }
}

XHR.prototype.setRange = function(start, end) {
  this.xhr.startByte = start;
  this.xhr.setRequestHeader('Range', createRange(start, end));
};

XHR.prototype.send = function() {
  this.xhr.send();
};

XHR.prototype.abort = function() {
  log("Aborting XHR request for", this.url);
  this.xhr.abort();
};
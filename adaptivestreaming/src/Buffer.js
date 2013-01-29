function Buffer(representations, media, options) {
  this.options = options;
  this.representations = representations;
  this.buffer = null;
  this.currentRepresentation = 1;
  this.xhr = null;
  this.initialization = null;
  this.chunkId = null;
  this.hasInit = false;
  this.mime = null;
  this.codecs = null;
  this.qualityCooldown = null;
  this.media = media
  this.addSourceBuffer();
}

Buffer.prototype.addSourceBuffer = function() {
  this.mime = this.getRepresentation().mimeType;
  this.codecs = this.getRepresentation().codecs;
  this.buffer = this.media.addSourceBuffer(this.mime + '; codecs="' + this.codecs + '"');
};

Buffer.prototype.request = function(url, start, end, index, init, bandwidthMonitor) {
  var self = this;
  this.xhr = new XHR(url, {
    bandwidth: bandwidthMonitor,
    load: function(request) {
      self.xhr = null;
      var videoBuffer = new VideoParser(request.response);
      var representation = self.getRepresentation();

      if (index) {
        representation.segments = [];
        videoBuffer.parseSIDX(start).forEach(function(segment) {
          representation.addSegment(segment.offset, segment.offset + segment.size - 1, segment.time, segment.duration);
        });
      }

      if (init) {
        self.setInitialization(videoBuffer.parseInit());
      } else {
        if (!self.hasInit) {
          self.appendInit(self.getInitialization());
        }
        log("Appending range", start, "-", end, "for", self.mime);
        self.append(request.response);
        self.chunkId++;
      }
    }
  });
  this.xhr.setRange(start, end);

  this.xhr.send();
};

Buffer.prototype.setInitialization = function(initialization) {
  this.appendInit(initialization);
  this.getRepresentation().value = initialization;
};

Buffer.prototype.append = function(buffer) {
  this.buffer.append(new Uint8Array(buffer));
};

Buffer.prototype.appendInit = function(initialization) {
  this.buffer.append(initialization.subarray(0, 500));
  this.buffer.append(initialization.subarray(500));
  this.initialization = initialization;
  this.hasInit = true;
  log("Appending initialization for", this.mime, "(" + this.codecs + ")");
};

Buffer.prototype.getInitialization = function() {
  return this.getRepresentation().value;
};

Buffer.prototype.getRepresentation = function() {
  return this.representations[this.currentRepresentation];
};

Buffer.prototype.getFragment = function(player) {
  var time = player.element.currentTime;
  var representation = this.getRepresentation();
  var segment;
  var append_time = 0;
  var index = false, init = false;

  if (!this.xhr) {
    if (!representation.value) {
      segment = representation.segments[0];
      index = true;
      init = true;
    } else if (!this.adapt(player.bandwidth)){
      var range = findRangeForPlaybackTime(this, time);
      append_time = (range && range.end) || time;

      if (this.chunkId === null) {
        this.chunkId = findSegmentIndexForTime(representation.segments, append_time);
      }
      segment = representation.segments[this.chunkId];
    }

    if (append_time <= time + player.options.bufferLength && segment) {
      this.request(player.url + representation.url, segment.start, segment.end, index, init, player.bandwidth);
    }
  }
};

Buffer.prototype.reset = function() {
  log('Resetting sourceBuffer');
  if (this.xhr) {
    this.xhr.abort();
    this.xhr = null;
  }
  this.hasInit = false;
  this.chunkId = null;
  this.buffer.abort();
};

Buffer.prototype.setRepresentation = function(quality) {
  log("Setting", this.mime ,"quality to", quality);
  this.initialization = null;
  this.currentRepresentation = quality;
  if (this.options.onqualitychange) {
    this.options.onqualitychange(this.getRepresentation());
  }
  this.reset();
  if (this.qualityCooldown) {
    window.clearTimeout(this.qualityCooldown);
  }
  this.qualityCooldown = window.setTimeout(function() {
    this.qualityCooldown = null;
  }.bind(this), 2000);
};

Buffer.prototype.adapt = function(bandwidth) {
  if (!this.qualityCooldown) {
    var bestBw = 0;
    var best = 0;
    var gbw = Math.min(bandwidth.slow, bandwidth.fast);
    var i = 0;
    this.representations.forEach(function(representation) {
      var representationBandwidth = representation.bandwidth / 8;

      if (representationBandwidth > bestBw && representationBandwidth < (0.85 * gbw - 128000)) {
        bestBw = representationBandwidth;
        best = i;
      }
      i++;
    });

    if (best !== this.currentRepresentation) {
      if (this.representations[best].bandwidth < 48000) {
        return false; // Bug with HE-AACv2 https://code.google.com/p/chromium/issues/detail?id=122913
      }
      this.setRepresentation(best);
      log('Selected new rate', bestBw*8, 'Kbps with bandwidth', Math.round(gbw*8), 'Kbps (', Math.round(bandwidth.slow / 1024) + 'KBps',')');
      return true;
    }
  }
  return false;
}
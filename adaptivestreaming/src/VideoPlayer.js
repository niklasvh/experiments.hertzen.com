"use strict";

var MediaSource = window.MediaSource || window.WebKitMediaSource;
var URL = window.URL;

function $A(array) {
  return [].slice.call(array, 0);
}

var log;

function VideoPlayer(url, options) {

  log = function(startTime) {
    var args = $A(arguments).slice(1);
    args.unshift((now() - startTime) + ":");
    if (options.log) {
      options.log.call(options.log, args.join(" "));
    } else {
      window.console.log.apply(window.console, args);
    }
  }.bind(null, now())
  this.manifest = null;
  this.buffers = [];
  this.options = options || {};
  this.options.bufferLength = 10;
  this.url = url.substring(0, url.lastIndexOf("/") + 1);
  this.bandwidth = new BandwidthMonitor(options);
  this.element = options.element;
  this.element.addEventListener('seeking', onSeeking.bind(this));

  loadMpd(url, function(content) {
    log("MPD manifest loaded");
    this.manifest = content;
    this.attach(this.media, this.element);
  }.bind(this));

  this.media = new MediaSource();

  this.media.addEventListener('sourceopen', mediaSourceOpen.bind(this));
  this.media.addEventListener('webkitsourceopen', mediaSourceOpen.bind(this));
}

VideoPlayer.prototype.attach = function(media, video) {
  video.src = URL.createObjectURL(media);
}

VideoPlayer.prototype.addBuffer = function(representations) {
  var buffer = new Buffer(representations, this.media, this.options);
  this.buffers.push(buffer);
};

function interval(callback, timer) {
  return window.setTimeout(function() {
    callback();
    interval(callback, timer);
  }, timer);
}

function onSeeking() {
  this.buffers.forEach(function(buffer) {
    buffer.reset();
  });
}

function mediaSourceOpen() {
  var media = this.media,
  manifest = this.manifest,
  self = this;

  this.updater = interval(updater.bind(null, this), 500);

  media.duration = manifest.duration;
  manifest.tracks.forEach(function(track) {
    self.addBuffer(track.representations);
  });

}

function createRange(start, end) {
  return 'bytes=' + start + '-' + end;
}

function updater(player) {
  player.buffers.forEach(function(buffer) {
    buffer.getFragment(player);
  });
}

function findSegmentIndexForTime(segments, time) {
  for (var i = 0; i < segments.length; i++) {
    var s = segments[i];
    if (s.time <= time && s.time + s.duration >= time) {
      // Don't be too eager to return a segment from the end of the buffered
      // ranges. (This hack will go away in the more principled
      // implementations.)
      if (i == segments.length - 1 && s.time + s.duration + 0.5 < time)
        return null;

      return i;
    }
  }
  log("Could not find segment for time " + time);
}

function findRangeForPlaybackTime(buf, time) {
  var ranges = buf.buffer.buffered;
  for (var i = 0; i < ranges.length; i++) {
    if (ranges.start(i) <= time && ranges.end(i) >= time) {
      return {
        'start': ranges.start(i),
        'end': ranges.end(i)
      };
    }
  }
}

function now() {
  return (new Date()).getTime();
}

function isElement(node) {
  return (node.nodeType === 1);
}

var isType = function(type, element) {
  return (element.nodeType === 1) && type.test(element.nodeName);
};

function is(type) {
  return isType.bind(null, new RegExp("^" + type + "$", "i"));
}

function loadMpd(url, callback) {
  load(url, function(content) {
    callback(new Media(content));
  });
}

function load(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onload = function(e) {
    if (this.status === 200) {
      callback(this.response);
    }
  };

  xhr.send();
}



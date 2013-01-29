function Segment(start, end, time, duration) {
  this.start = start;
  this.end = end;
  this.time = time;
  this.duration = duration;
}

function Representation (bandwidth, codecs, mimeType, url) {
  this.bandwidth = bandwidth;
  this.codecs = codecs;
  this.mimeType = mimeType;
  this.url = url;
  this.segments = [];
  this.start = 0;
  this.end = null;
  this.value = null;
}

Representation.prototype.addSegment = function(start, end, time, duration) {
  var segment = new Segment(start, end, time, duration);
  this.segments.push(segment);
  return segment;
}

function MediaTrack(contentType, duration, start) {
  this.contentType = contentType;
  this.duration = duration;
  this.start = start;
  this.representations = [];
}

MediaTrack.prototype.addRepresentation = function(bandwidth, codecs, mimeType, url) {
  var rep = new Representation(bandwidth, codecs, mimeType, url);
  this.representations.push(rep);
  return rep;
};

MediaTrack.prototype.sortRepresentations = function() {
  this.representations.sort(function(a, b) {
    return a.bandwidth - b.bandwidth;
  });
};

function Media(xmlString) {
  if (xmlString) {
    var xml = this.parseXML(xmlString);
    switch(xml.nodeName) {
      case "SmoothStreamingMedia":
        return new SmoothStreamingMedia(xml);
        break;
      case "MPD":
        return new MpdMedia(xml);
        break;
      default:
        throw "Unknown manifest type " + xml.nodeName;
    }
  }

  this.duration = null;
  this.tracks = [];
}

Media.prototype.parseRange = function(string) {
  var match = /([0-9]+)-([0-9]+)/.exec(string);
  return (match) ? {
    start: parseInt(match[1], 10),
    end: parseInt(match[2], 10)
  } : null;
}

Media.prototype.addTrack = function(contentType, duration, start) {
  var track = new MediaTrack(contentType, duration, start);
  this.tracks.push(track);
  return track;
};

Media.prototype.parseXML = function(xmlString) {
  return $A((new window.DOMParser()).parseFromString(xmlString, "text/xml").childNodes).filter(isElement)[0];
};

Media.prototype.iso8601_Duration = function(duration) {
  var regexp = /P(([0-9]*)Y)?(([0-9]*)M)?(([0-9]*)D)?T(([0-9]*)H)?(([0-9]*)M)?(([0-9.]*)S)?/;
  var match = regexp.exec(duration);
  return (!match) ? parseFloat(duration) : (parseFloat(match[2] || 0) * 86400*365 + parseFloat(match[4] || 0) * 86400 * 30 + parseFloat(match[6] || 0)) * 86400 +
  (parseFloat(match[8] || 0) * 3600 + parseFloat(match[10] || 0) * 60 + parseFloat(match[12] || 0));
};

function MpdMedia(xml) {
  Media.call(this);
  var self = this;
  var mediaDuration = this.duration = this.iso8601_Duration(xml.getAttribute('mediaPresentationDuration'));
  $A(xml.childNodes).filter(is("Period")).forEach(function(period) {
    var duration = self.iso8601_Duration(period.getAttribute('duration'));
    var start = self.iso8601_Duration(period.getAttribute('start'));
    duration = duration || mediaDuration;
    start = start || 0;

    $A(period.childNodes).filter(is("AdaptationSet")).forEach(function(adaptionSet) {
      var contentComponent = $A(adaptionSet.childNodes).filter(is("ContentComponent"))[0];
      var track = self.addTrack((contentComponent) ? contentComponent.getAttribute('contentType') : adaptionSet.getAttribute("mimeType"), duration, start);
      $A(adaptionSet.childNodes).filter(is("Representation")).forEach(function(representation) {
        var url = $A(representation.childNodes).filter(is("BaseURL"));
        var init;

        var rep = track.addRepresentation(
          parseInt(representation.getAttribute('bandwidth'), 10),
          representation.getAttribute('codecs'),
          representation.getAttribute('mimeType') || adaptionSet.getAttribute("mimeType"),
          url[0].textContent
          );

        if (representation.getAttribute('width') && representation.getAttribute('height')) {
          rep.quality = representation.getAttribute('width') + "x" + representation.getAttribute('height');
        }

        if (representation.getAttribute('sampleRate')) {
          rep.aquality = representation.getAttribute('sampleRate');
        }

        var segmentBase = $A(representation.childNodes).filter(is("SegmentBase"));
        var segmentList = $A(representation.childNodes).filter(is("SegmentList"));

        if (segmentList.length) {

        } else {
          var end = null;
          if (segmentBase.length) {
            if (self.parseRange(segmentBase[0].getAttribute("indexRange"))) {
              end = self.parseRange(segmentBase[0].getAttribute("indexRange")).end;
            }
            init = self.parseRange($A(segmentBase[0].childNodes).filter(is("Initialization"))[0].getAttribute("range"));
            rep.start = init.start || 0;
            rep.end = init.end || rep.segments[0].index || null;
            rep.value = null;
          }
          rep.addSegment(0, end, 0, duration);
        }
      });
      track.sortRepresentations();
    });
  });

}

MpdMedia.prototype = Object.create(Media.prototype);

function SmoothStreamingMedia(xml) {
  Media.call(this);
  var self = this;
  var timeScale = xml.getAttribute("TimeScale") || 10000000;
  var duration = this.duration = xml.getAttribute("Duration") / timeScale;
  $A(xml.childNodes).filter(is("StreamIndex")).forEach(function(stream) {
    var track = self.addTrack(stream.getAttribute("Type") + "/mp4", duration, 0);
    $A(stream.childNodes).filter(is("QualityLevel")).forEach(function(qualityLevel) {
      var rep = track.addRepresentation(
        parseInt(qualityLevel.getAttribute('Bitrate'), 10),
        "avc1.4d4015",
        "video/mp4",
        "QualityLevels(" + parseInt(qualityLevel.getAttribute('Bitrate'), 10) + ")/Fragments(video={start time})"
        );
    });
  });
}

SmoothStreamingMedia.prototype = Object.create(Media.prototype);
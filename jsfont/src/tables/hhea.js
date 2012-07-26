
JSFONT.hheaTable = function(data){   
   
    this._structure = [
    {
        "version": "Fixed"
    },
    {
        "Ascender": "FWORD"
    },
    {
        "Descender": "FWORD"
    },
    {
        "LineGap": "FWORD"
    },
    {
        "advancedWidthMax": "UFWORD"
    },
    {
        "minLeftSideBearing": "FWORD"
    },
    {
        "minRightSideBearing": "FWORD"
    },
    {
        "xMaxExtent": "FWORD"
    },
    {
        "caretSlopeRise": "SHORT"
    },
    {
        "caretSlopeRun": "SHORT"
    },
    {
        "caretOffset": "SHORT"
    },
    {
        "reserved1": "SHORT"
    },
    {
        "reserved2": "SHORT"
    },
    {
        "reserved3": "SHORT"
    },
    {
        "reserved4": "SHORT"
    },
    {
        "metricDataFormat": "SHORT"
    },
    {
        "numberOfHMetrics": "USHORT"
    }                                
    ];

    
    return this;
};
    
JSFONT.hheaTable.prototype = new JSFONT.Table();
JSFONT.hheaTable.prototype.constructor = JSFONT.hheaTable;
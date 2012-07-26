


JSFONT.headTable = function(data){   
   
    this._structure = [
    {
        "version": "Fixed"
    },

    {
        "revision": "Fixed"
    },

    {
        "checkSumAdjustment": "ULONG"
    },

    {
        "magicNumber": "ULONG"
    },

    {
        "flags": "USHORT"
    },

    {
        "unitsPerEm": "USHORT"
    },

    {
        "created": "LONGDATETIME"
    },

    {
        "modified": "LONGDATETIME"
    },

    {
        "xMin": "SHORT"
    },

    {
        "yMin": "SHORT"
    },

    {
        "xMax": "SHORT"
    },

    {
        "yMax": "SHORT"
    },

    {
        "macStyle": "USHORT"
    },

    {
        "lowestRecPPEM": "USHORT"
    },

    {
        "fontDirectionHint": "SHORT"
    },

    {
        "indexToLocFormat": "SHORT"
    },

    {
        "glyphDataFormat": "SHORT"
    }
        
    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.headTable.prototype = new JSFONT.Table();
JSFONT.headTable.prototype.constructor = JSFONT.headTable;

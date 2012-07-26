
JSFONT.hdmxTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "USHORT"
    },

    {
        "numRecords": "USHORT"
    },

    {
        "sizeDeviceRecord": "LONG"
    }      
    ];
    
    this._records = {
        "numTables": "numRecords",
        "structure": [
        {
            "pixelSize": "BYTE"
        },

        {
            "maxWidth": "BYTE"
        },

        {
            "widths": {
                "type": "array",
                "count": function(){ return data.tables.maxp.data.numGlyphs; },
                "itemType": "BYTE"
            }
        }
        ]
    };
    
    

    
    
    return this;
};
    
JSFONT.hdmxTable.prototype = new JSFONT.Table();
JSFONT.hdmxTable.prototype.constructor = JSFONT.hdmxTable;
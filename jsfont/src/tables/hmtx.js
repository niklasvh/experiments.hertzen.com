
JSFONT.hmtxTable = function(data){   
   
    this._structure = [
        {
            "records": {
                "type": "records",
                "numTables": function() {
                    return data.tables.hhea.data.numberOfHMetrics
                },
                "structure": [
                    {
                        "hMetrics": "USHORT",
                        "leftSideBearing": "SHORT"
                    }
                ]
            }
            
        },
        {
            "leftSideBearing": {
                "type": "array",
                "count": function(){
                    return data.tables.maxp.data.numGlyphs - data.tables.hhea.data.numberOfHMetrics;
                },
                "itemType": "USHORT"
            }
        }
    ];
    this.data = {};
    
    
    return this;
};
    
JSFONT.hmtxTable.prototype = new JSFONT.Table();
JSFONT.hmtxTable.prototype.constructor = JSFONT.hmtxTable;
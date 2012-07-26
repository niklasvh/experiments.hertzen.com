JSFONT.gaspTable = function(data){   

    this._structure = [
    {
        "version" : "USHORT"
    },
    {
        "numRanges": "USHORT"
    },
    {
        "gaspRanges": {
            "type": "records",
            "numTables": "numRanges",
            "structure":[
                {
                    "rangeMaxPPEM": "USHORT"
                },
                {
                    "rangeGaspBehavior": "USHORT"
                }
            ]
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.gaspTable.prototype = new JSFONT.Table();
JSFONT.gaspTable.prototype.constructor = JSFONT.gaspTable;


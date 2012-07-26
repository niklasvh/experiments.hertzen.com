
JSFONT.DSIGTable = function(data){   
   
   
   
    this._structure = [
    {
        "ulVersion": "ULONG"
    },

    {
        "usNumSigs": "USHORT"
    },
    {
        "usFlag": "USHORT"
    },
    {
        "signatures": {
            "type": "records",
            "numTables": "usNumSigs",
            "structure":[
            {
                "ulFormat": "ULONG",
                "ulLength": "ULONG",
                "ulOffset": "ULONG",
                "offset1": {
                    "type": "offset",
                    "offset": "ulOffset",
                    "structure": [
                    {
                        "usReserved1": "USHORT"
                    },

                    {
                        "usReserved2": "USHORT"
                    },

                    {
                        "cbSignature": "ULONG"
                    },

                    {
                        "bSignature": "BYTE"
                    }
                            
                    ]
                }
            }
            ]
        }
    }
    ];
    

    
    
    return this;
};
    
JSFONT.DSIGTable.prototype = new JSFONT.Table();
JSFONT.DSIGTable.prototype.constructor = JSFONT.DSIGTable;


JSFONT.locaTable = function(data){   
   
   
   
    this._structure = [
    {
        "cond1": {
            "type": "condition",
            "condition": "==",
            "item": function(){
                return data.tables.head.data.indexToLocFormat;
            },
            "value": 1,
            "structure":[{
                "offsets": {
                    "type": "array",
                    "count": function(){  
                        return data.tables.maxp.data.numGlyphs + 1;
                    },
                    "itemType": "ULONG"
                }
            }
                
            ]
        }
        
    },
    {
        "cond1": {
            "type": "condition",
            "condition": "==",
            "item": function(){
                return data.tables.head.data.indexToLocFormat;
            },
            "value": 0,
            "structure":[{
                "offsets": {
                    "type": "array",
                    "count": function(){  
                        return data.tables.maxp.data.numGlyphs + 1;
                    },
                    "itemType": "USHORT"
                }
            }
                
            ]
        }
        
    }
    ];
    
    return this;
};
JSFONT.locaTable.prototype = new JSFONT.Table();

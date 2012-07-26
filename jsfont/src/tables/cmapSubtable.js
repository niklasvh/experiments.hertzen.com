
JSFONT.cmapSubtable = function(data){   
   

    var glyphIdArray =  function(dataObj, data, obj){
        var glyphArray = [];
        
        // calculate how many bits left in table console.log((dataObj.len - (data.getPosition() - this._offset)) / 2);
        var len = (dataObj.len - (data.getPosition() - this._offset)) / 2;
       
        for (var i = 0; i < len; i++){
            glyphArray[i] = this._readItem("USHORT", data);
        }
        return glyphArray;
        
    };
    
    var halfFunc = function(c) {
        return (c/2);
    }
          
   
    this._structure = [
    {
        "format": "USHORT"
    },

    {
        "len": "USHORT"
    },
    {
        "language": "USHORT"
    },
    {
        "cond1":{
            "type": "condition",
            "item": "format",
            "condition": "==",
            "value": 4,
            "structure":[
            {
                "segCountX2": "USHORT"
            },
            {
                "searchRange": "USHORT"
            },
            {
                "entrySelector": "USHORT"  
            },
            {
                "rangeShift": "USHORT"
            },
            {
                "endCount": {
                    "type": "array",
                    "count": "segCountX2",
                    "countModify": halfFunc,
                    "itemType": "USHORT"
                }
            },
            {
                "reservedPad": "USHORT"
            },
            {
                "startCount": {
                    "type": "array",
                    "count": "segCountX2",
                    "countModify": halfFunc,
                    "itemType": "USHORT"
                }
            },
            {
                "idDelta": {
                    "type": "array",
                    "count": "segCountX2",
                    "countModify": halfFunc,
                    "itemType": "SHORT"
                }
            },
            {
                "idRangeOffset": {
                    "type": "array",
                    "count": "segCountX2",
                    "countModify": halfFunc,
                    "itemType": "USHORT"
                }
            },
            {
                "glyphIdArray": glyphIdArray
            }
                
            ]
        }
          
    },  {
        "cond2": {
            "type": "condition",
            "item": "format",
            "condition": "==",
            "value": 0,
            "structure":[
            {
                "glyphIdArray": {
                    "type": "array",
                    "count": 256,
                    "itemType": "BYTE"
                }
            }
            ]
        }
    
    }
    ];

    
    this._hex = [];

    
    
    return this;
};
    
JSFONT.cmapSubtable.prototype = new JSFONT.Table();
JSFONT.cmapSubtable.prototype.constructor = JSFONT.cmapSubtable;
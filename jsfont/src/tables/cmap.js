
JSFONT.cmapTable = function(data){   
   
    var subtable = function(dataObj, data, obj){
        
    };
    
    
    var glyphIdArray =  function(dataObj, data, obj){
        return {
            "read": function(dataObj, data, obj){
        
                var glyphArray = [];
        
                // calculate how many bits left in table console.log((dataObj.len - (data.getPosition() - this._offset)) / 2);
                var len = (dataObj.len - (data.getPosition() - this._offset)) / 2;
       
                for (var i = 0; i < len; i++){
                    glyphArray[i] = this._readItem("USHORT", data);
                }
                
                return glyphArray;
            },
            "write": function(writer, data){
                
            }
        
        }
        
    };
    
    var halfFunc = function(c) {
        return (c/2);
    }
    
   
    this._structure = [
    {
        "version": "USHORT"
    },

    {
        "numTables": "USHORT"
    },
    {
        "records":{
            "type": "records",
            "numTables": "numTables",
            "structure": [

            {
                "platformID": "USHORT"
            },

            {
                "encodingID": "USHORT"
            },

            {
                "offset": "ULONG"
            },
            {
                "offset1":{
                    "type": "offset",
                    "item": "offset",
                    "structure":[
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
    
                    },  {
                        "cond3": {
                            "type": "condition",
                            "item": "format",
                            "condition": "==",
                            "value": 6,
                            "structure":[
                            {
                                "firstCode": "USHORT"  
                            },
                            {
                                "entryCount": "USHORT"
                            },
                            {
                                "glyphIdArray": {
                                    "type": "array",
                                    "count": "entryCount",
                                    "itemType": "USHORT"
                                }
                            }
                            ]
                        }
    
                    }
                    ]
                }
            }
            ]
        }
    }
    ];
    /*
    this._records = {
        "numTables": "numTables",
        "structure": [
        {
            "platformID": "USHORT"
        },

        {
            "encodingID": "USHORT"
        },

        {
            "offset": "ULONG"
        }
        ]
    };*/
    
    

    
    
    return this;
};
    
JSFONT.cmapTable.prototype = new JSFONT.Table();
JSFONT.cmapTable.prototype.constructor = JSFONT.cmapTable;


JSFONT.glyfTable = function(data){   
   
    };
JSFONT.glyfTable.prototype = new JSFONT.Table();


JSFONT.Glyph = function(data){   
 
    var flagFunc = function(dataObj, data, obj){
        return {
            "read":function(dataObj, data, obj){
                
                var flags = [];        
                var len = dataObj.endPtsOfContours[dataObj.endPtsOfContours.length - 1]; 

                for (var a = 0; a <= len; a++){
                    flags[a] = [];
                    var flagByte = obj._readItem("BYTE", data);
                                
                    // loop through each bit to see if its set
                    for (var b=0;b<=7;b++){
                        flags[a][b] = (flagByte & (1 << b)) ? true : false;
                    }
                    
                    // check for repeat flag
                    if (flags[a][3]){
                        var repeat = obj._readItem("BYTE", data);
                        var curr = flags[a];
                        flags[a][3] = repeat;
                        //  curr[3] = false;
                       
                        for (var i=0; i<repeat; i++){
                            flags[a+1] = curr;
                            a++;
                        }
                    }
                }
                
                return flags;
            },
            "write": function(writer, data){
                var dataObj = this.data;
                var len = dataObj.endPtsOfContours[dataObj.endPtsOfContours.length - 1]; 
               // writer.skip(len-1);
                for (var a = 0; a <= len; a++){
                    
                    
                    var flagByte = 0;
                    // loop through each bit to see if its set
                    for (var b=0;b<=7;b++){
                        if (dataObj.flags[a][b] !== false){
                            flagByte = (flagByte |= (1 << b))
                        }
                    // dataObj[item][a][b] = (flagByte & (1 << b)) ? true : false;
                    }
                    

                    
                    writer.writeItem("BYTE", flagByte);
                    
                    
                    if (dataObj.flags[a][3] !==false){
                        writer.writeItem("BYTE", dataObj.flags[a][3]);
                      //  console.log(a);
                        a += dataObj.flags[a][3];
                      //  console.log(a);
                    }                   
                    
                    

                }
            }
          
        };
    };
 
    var xCoordinates = function(dataObj, data, obj){
        return {
            "read":function(dataObj, data, obj){
                var xcord = [];
                var len = dataObj.endPtsOfContours[dataObj.endPtsOfContours.length - 1]; 
                
                for (var a = 0; a <= len; a++){
            
                    if (dataObj.flags[a][4] && !dataObj.flags[a][1]){
                        // same as previous bit, so 0 delta
                        xcord[a] = 0;
                    }else{
            
                        if (dataObj.flags[a][1]){             
                            xcord[a] = obj._readItem("BYTE", data);
                            if (!dataObj.flags[a][4]){  
                                xcord[a] = -xcord[a];
                            }
                        }else{
                            xcord[a] = obj._readItem("SHORT", data);
                        }       
                    }
                }
          
                return xcord;            
            },
            "write": function(writer, data){
                var dataObj = this.data,
                len = dataObj.endPtsOfContours[dataObj.endPtsOfContours.length - 1]; 
                 
                for (var a = 0; a <= len; a++){
            
                    if (dataObj.flags[a][4] && !dataObj.flags[a][1]){
                    // same as previous bit, so 0 delta
                    //   xcord[a] = 0;
                    }else{
            
                        if (dataObj.flags[a][1]){             
                            
                            // xcord[a] = obj._readItem("BYTE", data);
                            // this.writeItem(structure[item], dataObj[item]);
                            if (!dataObj.flags[a][4]){  
                                // xcord[a] = -xcord[a];
                               
                                writer.writeItem("BYTE", -dataObj.xCoordinates[a]);
                               
                            }else{
                                writer.writeItem("BYTE", dataObj.xCoordinates[a]);
                            }
                        }else{
                            //  xcord[a] = obj._readItem("SHORT", data);
                            writer.writeItem("SHORT", dataObj.xCoordinates[a]);
                        }       
                    }
                }
            }
            
        };
        
        

        

    };
    
    var yCoordinates = function(dataObj, data, obj){
        return {
            "read":function(dataObj, data, obj){
                var ycord = [];
        
        
                var len = dataObj.endPtsOfContours[dataObj.endPtsOfContours.length - 1]; 
        
                for (var a = 0; a <= len; a++){
            
                    if (dataObj.flags[a][5] && !dataObj.flags[a][2]){
                        // same as previous bit, so 0 delta
                        ycord[a] = 0;
                    }else{        
                        if (dataObj.flags[a][2]){             
                            ycord[a] = obj._readItem("BYTE", data);
                            if (!dataObj.flags[a][5]){  
                                ycord[a] = -ycord[a];
                            }
                        }else{
                            ycord[a] = obj._readItem("SHORT", data);
                        }       
                    }
                }
        
                return ycord;
            },
            "write": function(writer, data){
                
                var dataObj = this.data,
                len = dataObj.endPtsOfContours[dataObj.endPtsOfContours.length - 1]; 
        
                
                for (var a = 0; a <= len; a++){
            
                    if (dataObj.flags[a][5] && !dataObj.flags[a][2]){
                    // same as previous bit, so 0 delta
                    //  ycord[a] = 0;
                    }else{        
                        if (dataObj.flags[a][2]){             
                            //  ycord[a] = obj._readItem("BYTE", data);
                            if (!dataObj.flags[a][5]){  
                                writer.writeItem("BYTE", -dataObj.yCoordinates[a]);
                            //   ycord[a] = -ycord[a];
                            }else{
                                writer.writeItem("BYTE", dataObj.yCoordinates[a]); 
                            }
                        }else{
                            // ycord[a] = obj._readItem("SHORT", data);
                            writer.writeItem("SHORT", dataObj.yCoordinates[a]); 
                        }       
                    }
                }
            }
        }

    };
   
    this._structure = [
    {
        "numberOfContours": "SHORT"
    },

  

    {
        "cond1":{
            "type": "condition",
            "item": "numberOfContours",
            "condition": ">",
            "value": 0,
            "structure":[
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
                "endPtsOfContours": {
                    "type": "array",
                    "count": "numberOfContours",                 
                    "itemType": "USHORT"
                }
            },

            {
                "instructionLength": "USHORT"
            },
            {
                "instructions": {
                    "type": "array",
                    "count": "instructionLength",
                    "itemType": "BYTE"
                }
            },
            {
                "flags": flagFunc /*{
                    "type": "bitarray",
                    "count": "endPtsOfContours",
                    "countIndex": -1,
                    "itemType": "BYTE"
                }*/
            },
            {
                "xCoordinates": xCoordinates
            },
            {
                "yCoordinates": yCoordinates
            }
            ]

        
        }
    },{
        "cond1":{
            "type": "condition",
            "item": "numberOfContours",
            "condition": "==",
            "value": -1,
            "structure":[
            {
                "flags": "USHORT"
            },
            {
                "glyphIndex": "USHORT"
            }
            ]
        }
    }
    ];
    
 
  
    return this;
};
    
JSFONT.Glyph.prototype = new JSFONT.Table();
JSFONT.Glyph.prototype.constructor = JSFONT.Glyph;

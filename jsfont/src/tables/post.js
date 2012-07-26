
JSFONT.postTable = function(data){   
    

   
    var nameFunc = function(dataObj, data, obj){
           
        return {
               
            "read":function(dataObj, data, obj){
                var names = [];
          
                for (var i = 0; i <= dataObj.numberOfGlyphs; i++){
           
                    if (dataObj.glyphNameIndex[i] <= 257){
                        /*
                if (dataObj.glyphNameIndex[i] == 0){
                    names[i] = null
                }else if (dataObj.glyphNameIndex[i] <= 97){
                    names[i] = String.fromCharCode(dataObj.glyphNameIndex[i]+29);
                }*/
                        names[i] = new JSFONT.MacGlyph(dataObj.glyphNameIndex[i]);
                
                
                    //  names[i] = String.fromCharCode((JSFONT.WGL4[dataObj.glyphNameIndex[i]]).toString(10))
                    }else{
         
                        names[i] = new JSFONT.PSGlyph();
                        names[i].readData(data, obj);
                
                    }
                }
   
                return names; 
            },
            "write": function(writer, data){
                var dataObj = this.data;
                 
                for (var i = 0; i <= dataObj.numberOfGlyphs; i++){
                    if (dataObj.glyphNameIndex[i] <= 257){
                          
                    }else{
                        
                        dataObj.names[i].write(writer);
                    }
                }
            }
               
        }

    };
    
 
    
   
    this._structure = [
    {
        "version": "Fixed"
    },
    {
        "italicAngle": "Fixed"
    },
    {
        "underlinePosition": "SHORT"
    },
    {
        "underlineThickness": "SHORT"
    },
    {
        "isFixedPitch": "ULONG"
    },
    {
        "minMemType42": "ULONG"
    },
    {
        "maxMemType42": "ULONG"
    },
    {
        "minMemType1": "ULONG"
    },
    {
        "maxMemType1": "ULONG"
    },
    {
        "cond1":{
            "type": "condition",
            "item": "version",
            "condition": "==",
            "value": "2.0",
            "structure":[
            {
                "numberOfGlyphs": "USHORT"
            },

            {
                "glyphNameIndex": {
                    "type": "array",
                    "count": "numberOfGlyphs",                 
                    "itemType": "USHORT"
                }
            },
            {
                "names": nameFunc
            }
            
            ]
            
        }   
    }
    ];
    



    
    
    return this;
};
    
JSFONT.postTable.prototype = new JSFONT.Table();
JSFONT.postTable.prototype.constructor = JSFONT.postTable;
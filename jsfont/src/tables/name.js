/*
JSFONT.nameTable = function(data){   
   
   
    var platforms = [
    "Unicode",
    "Macintosh",
    "ISO",
    "Windows",
    "Custom"       
    ];
     
    this.startPos = data.getPosition();
    

    
    this.format = data.readUInt8();
    this.count = data.readUInt8();
    this.stringOffset = data.readUInt8();
    
    this.nameRecords = [];
    

    
    
    var nameRecordOffset = data.getPosition();
  
    var currentStringOffset = this.stringOffset + this.startPos;
    
    for (var i = 0; i < this.count; i++){      
        
        
        var nameRecord = {
            platformID: data.readUInt8(),
            encodingID: data.readUInt8(),
            languageID: data.readUInt8(),
            nameID: data.readUInt8(),
            offset: data.readUInt8(),
            len:  data.readUInt8()
        };
   
        currentStringOffset += nameRecord.offset;
        
        data.seek(currentStringOffset);
        
        currentStringOffset += nameRecord.len;
        
        nameRecord.content = data.readString(nameRecord.len);
        data.seek(nameRecordOffset + 6*2*(i+1));
        
        this.nameRecords.push(nameRecord);
    }
               
    return this;
};*/


JSFONT.nameTable = function(data){   
   
    this._structure = [
    {
        "format": "USHORT"
    },

    {
        "count": "USHORT"
    },

    {
        "stringOffset": "USHORT"
    },

    {
        "nameRecord": {
            "type": "records",
            "numTables": "count",
            "structure": [
            {
                "platformID": "USHORT"
            },

            {
                "encodingID": "USHORT"
            },

            {
                "languageID": "USHORT"
            },

            {
                "nameID": "USHORT"
            },

            {
                "len": "USHORT"
            },

            {
                "offset": "USHORT"
            }
            ]
        }
    }
    ];
    

    
    this._hex = [];
    
    
    
    return this;
};
    
JSFONT.nameTable.prototype = new JSFONT.Table();
JSFONT.nameTable.prototype.constructor = JSFONT.nameTable;


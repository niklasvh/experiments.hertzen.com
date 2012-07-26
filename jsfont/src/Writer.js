
JSFONT.Writer = function(len){
    var buffer = new ArrayBuffer(len);
    var data = new DataView(buffer);
    this.pos = 0;
    //data.setUint16 (0, 1);

    
    
    
    
    this.writeItem = function(type, value){
        
        switch(type){
            case "Fixed":
                var parts = value.split(".");
                setUint16.call(this, parseInt(parts[0],10));
                setUint16.call(this, parseInt(parts[1],10));
                // buffer.setUint16(1, 0x1);
 
                break;
                
            case "BYTE":
                setUint8.call(this,  value);
                break;
                
            case "CHAR":
                setInt8.call(this,  value);
                break;    
                
            case "USHORT":
                setUint16.call(this,  value);
                break;
            case "SHORT":
                setInt16.call(this,  value);
                break;                  
            case "UFWORD":
                setUint16.call(this,  value);
                break;
            case "FWORD":
                setInt16.call(this,  value);
                break;                 
            case "ULONG":
                setUint32.call(this,  value);
                break;
            case "LONGDATETIME":
                // return data.readUInt32() +''+ data.readUInt32();  
                this.skip(8);
                break;
            default:
            //    console.log("Writer error, unknown "+ type);
        }
        
    };
    
    this.writeStructure = function(structureArray, table){
        var dataObj = table.data || table;
        
        for (var s = 0 , structureLen = structureArray.length; s<structureLen; s++){
            var structure = structureArray[s];
            
       
            for (var item in structure){
                        
                if (typeof structure[item] == "object"){
                
                    switch (structure[item].type){
                        
                        case "offset":
                            var offsetItem = structure[item].item;
                            offsetItem = dataObj[offsetItem];
                            var saveOffset = this.pos;
                            this.seek(offsetItem + this._offset);
                            this.writeStructure(structure[item].structure, dataObj); 
                            // this._len += data.getPosition() - saveOffset;
                            this.seek(saveOffset);
                            
                            break;
                        
                        case "condition":
                       
                                    
                            var condItem = structure[item].item;
                            if (typeof condItem === "function"){
                                condItem = condItem();
                            }else{
                                condItem = dataObj[condItem]
                            }
                                    
                            if (
                                (structure[item].condition == "==" && condItem == structure[item].value) ||
                                (structure[item].condition == ">" && condItem > structure[item].value)               
                                ){
                                        
                                this.writeStructure(structure[item].structure, table);
                            //   this._readStructure(structure[item].structure, data, dataObj); 
                        
                               
                            }
                                 
                        
                            break;
                            
                        case "bitarray":
                             
                           
                            var counter = (dataObj[structure[item].count][structure[item].countIndex]+1) || dataObj[structure[item].count];


                            for (var a = 0; a < counter; a++){
                                //dataObj[item][a] = [];
                                //var flagByte = this._readItem(structure[item].itemType, data);
                                var flagByte = 0;
                                // loop through each bit to see if its set
                                for (var b=0;b<=7;b++){
                                    if (dataObj[item][a][b]){
                                        flagByte = (flagByte |= (1 << b))
                                    }
                                   // dataObj[item][a][b] = (flagByte & (1 << b)) ? true : false;
                                }
                                this.writeItem(structure[item].itemType, flagByte);
                            }
                            break;    
                            
                            
                        case "array":
                            var counter;        
                            if (typeof structure[item].count == "number"){
                                counter = structure[item].count;
                            }else if (typeof structure[item].count == "function"){
                                
                                counter = structure[item].count(dataObj);
                            }else{
                                counter = (dataObj[structure[item].count][structure[item].countIndex]+1) || dataObj[structure[item].count];
                            }
                           
                            if (typeof structure[item].countModify == "function"){
                                counter = structure[item].countModify(counter);
                            }

                            for (var a = 0; a < counter; a++){
                                //dataObj[item][a] = this._readItem(structure[item].itemType,  data);
                                //     this.writeStructure(structure[item].itemType, dataObj[item][r]);
                                this.writeItem(structure[item].itemType, dataObj[item][a]);
                               
                        
                                
                            }
                            break;
                                
                            
                        case "records":
                                 
                          
                            var len;
                            
                            if (typeof structure[item].numTables === "function"){
                                len = structure[item].numTables();
                            }else{
                                len = dataObj[structure[item].numTables];
                            }
                    
                            for (var r = 0; r<len; r++){               
                                //  dataObj[item][r] = this._readStructure(structure[item].structure, data);  
                            
                                this.writeStructure(structure[item].structure, dataObj[item][r]);
                            }                      
                        
                            break;
                            
                        default:
                    //        console.log("Writer error, unknown object "+ structure[item].type);
                    }
                }else if (typeof structure[item] == "function"){
                // dataObj[item] = structure[item].call(this, dataObj, data, this);
                    
                     structure[item]().write.call(table, this, dataObj[item]);
                    
                } else{
                    // console.log(table.data[item]);
                    // console.log(structure[item]);
                    this.writeItem(structure[item], dataObj[item]);
                //dataObj[item] = this._readItem(structure[item], data);
                }
            }
        }
    };
    
    this.seek = function(pos){
        this.pos = pos;  
    };
    this.skip = function(num){
        this.pos += num; 
    };
    
    this.writeString = function(text){
        for (var i = 0, len = text.length; i < len; i++){
            setUint8.call(this,  text.charCodeAt(i));
        }
        
    };
    var setUint8 = function(val){
        data.setUint8(this.pos, val);
        this.pos++;
    };   
    
    var setInt8 = function(val){
        data.setInt8(this.pos, val);
        this.pos++;
    };     
    
    var setUint16 = function(val){
        data.setUint16(this.pos, val);
        this.pos += 2;
    };
    
    var setInt16 = function(val){
        data.setInt16(this.pos, val);
        this.pos += 2;
    };
    
    var setUint32 = function(val){
        data.setUint32(this.pos, val);
        this.pos += 4;
    };
    
    this.blob = function(){
        window.URL = window.URL || window.webkitURL; 
        BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
        var bb = new BlobBuilder();
        bb.append(buffer);

        return window.URL.createObjectURL(bb.getBlob());
        
        
    };
    
    this.base64 = function(){       
        //  return buffer;
        return base64ArrayBuffer(buffer);  
    };
    
    
    // Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
    // use window.btoa' step. According to my tests, this appears to be a faster approach:
    // http://jsperf.com/encoding-xhr-image-data/5

    var base64ArrayBuffer = function (arrayBuffer) {
        var base64    = ''
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

        var bytes         = new Uint8Array(arrayBuffer)
        var byteLength    = bytes.byteLength
        var byteRemainder = byteLength % 3
        var mainLength    = byteLength - byteRemainder

        var a, b, c, d
        var chunk

        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
            // Combine the three bytes into a single integer
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
            c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
            d = chunk & 63               // 63       = 2^6 - 1

            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = bytes[mainLength]

            a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

            // Set the 4 least significant bits to zero
            b = (chunk & 3)   << 4 // 3   = 2^2 - 1

            base64 += encodings[a] + encodings[b] + '=='
        } else if (byteRemainder == 2) {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

            a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

            // Set the 2 least significant bits to zero
            c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

            base64 += encodings[a] + encodings[b] + encodings[c] + '='
        }
 
        return base64
    }
    
};

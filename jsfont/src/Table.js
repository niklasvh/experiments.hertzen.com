
JSFONT.Table = function(){
    this._hex = [];
    this._structure = {};        

    
    
    this._readItem = function(type, data){
        
        switch (type){
            
            case "PASCAL":
                var len = data.readInt8();
                var str = "";
                for (var i = 0; i < len; i++){
                    str += String.fromCharCode(data.readInt8());
                }
                return str;
                break;
            
            case "Fixed":
                return data.readFloat32();  
                break;
            case "CHAR":
                return  data.readInt8();  
                break;
            case "BYTE":
                return data.readUInt8();  
                break;
            case "USHORT":
                return data.readUInt16();  
                break;
            case "FWORD":
                return data.readInt16();   
                break;     
            case "UFWORD":
                return data.readUInt16();   
                break;     
            case "SHORT":
                return data.readInt16();   
                break;                   
            case "ULONG":
                return data.readUInt32();  
                break;               
            case "LONG":
                return data.readInt32();    
                break;
            case "LONGDATETIME":
                // return data.readUInt32() +''+ data.readUInt32();  
                data.skip(8);
                return;
                break;
        }
    };
    
    
    this._readStructure = function (structureArray, data, dataObj){
        
        var dataObj = dataObj || {} ;
        
        
        for (var s = 0; s<structureArray.length; s++){
            var structure = structureArray[s];
        
            for (var item in structure){
       
                if (typeof structure[item] == "object"){
                
                    switch (structure[item].type){
                        
                        case "offset":
                            var offsetItem = structure[item].item;
                            offsetItem = dataObj[offsetItem];
                            var saveOffset = data.getPosition();
                            data.seek(offsetItem + this._offset);
                            this._readStructure(structure[item].structure, data, dataObj); 
                            this._len += data.getPosition() - saveOffset;
                            data.seek(saveOffset);
                            
                            break;
                        
                        case "records":
                                 
                            dataObj[item] = [];
                            var len;
                            
                            if (typeof structure[item].numTables === "function"){
                                len = structure[item].numTables();
                            }else{
                                len = dataObj[structure[item].numTables];
                            }
                    
                            for (var r = 0; r<len; r++){               
                                dataObj[item][r] = this._readStructure(structure[item].structure, data);               
                            }                      
                        
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
                                this._readStructure(structure[item].structure, data, dataObj); 
                        
                            // merge objects
                            /*
                                for (var attr in tmpObj) {
                                    dataObj[attr] = tmpObj[attr];
                                }*/
                            }
                        
                            break;
                        
                        case "array":
                            dataObj[item] = [], counter;      
                            if (structure[item].countIndex < 0){
                                structure[item].countIndex = dataObj[structure[item].count].length + structure[item].countIndex;
                            }
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
                                dataObj[item][a] = this._readItem(structure[item].itemType,  data);
                            }
                            break;
                            
                        case "bitarray":
                            dataObj[item] = [];        
                            if (structure[item].countIndex < 0){
                                structure[item].countIndex = dataObj[structure[item].count].length + structure[item].countIndex;
                            }
                            var counter = (dataObj[structure[item].count][structure[item].countIndex]+1) || dataObj[structure[item].count];


                            for (var a = 0; a < counter; a++){
                                dataObj[item][a] = [];
                                var flagByte = this._readItem(structure[item].itemType, data);
                                
                                // loop through each bit to see if its set
                                for (var b=0;b<=7;b++){
                                    dataObj[item][a][b] = (flagByte & (1 << b)) ? true : false;
                                }
                            }
                            break;
                    }
                }else if (typeof structure[item] == "function"){
                    dataObj[item] = structure[item]().read.call(this, dataObj, data, this);
                    
                } else{
                    dataObj[item] = this._readItem(structure[item], data);
                }
       
            }
        }
        return dataObj;
        
    };
    
    this.getCheckSum = function(){
    /*
         
      ULONG
        CalcTableChecksum(ULONG *Table, ULONG Length)
        {
        ULONG Sum = 0L;
        ULONG *Endptr = Table+((Length+3) & ~3) / sizeof(ULONG);
        while (Table < EndPtr)
                Sum += *Table++;
        return Sum;
        }         
         */
    };
    
    
    
    /*
    this.getLength = function(){
        
        var len = 0,
        getStructureLength = function(structureArray, dataObj){
            var totalLen = 0;
            var getTypeLength = function(type){
                switch (type){
                    case "Fixed":
                        return 4;  
                        break;
                    case "CHAR":
                        return 1;  
                        break;
                    case "BYTE":
                        return 1;  
                        break;
                    case "USHORT":
                        return 2;  
                        break;
                    case "FWORD":
                        return 2;   
                        break;     
                    case "UFWORD":
                        return 2;   
                        break;     
                    case "SHORT":
                        return 2;   
                        break;                   
                    case "ULONG":
                        return 4;  
                        break;               
                    case "LONG":
                        return 4;    
                        break;
                    case "LONGDATETIME":
                        return 8;
                        return;
                    default:
                //console.log("Unknown type: "+type);
                };
            }
            var structureLen = structureArray.length;
            for (var s = 0; s<structureLen; s++){
                var structure = structureArray[s];
                for (var item in structure){
           
                    if (typeof structure[item] == "object"){
                
                        switch (structure[item].type){
                            case "records":
                                 
                             
                                if (dataObj[item] !== undefined){
                                    var len = dataObj[item].length;
                                }
                         
                              
                                for (var r = 0; r<len; r++){       
                                    // console.log(getStructureLength(structure[item].structure, dataObj));
                                    totalLen +=  getStructureLength(structure[item].structure, dataObj);  
                                //  dataObj[item][r] = this._readStructure(structure[item].structure, data);               
                                }                      
                        
                                break;
                            case "condition":
                       
                                if (
                                    (structure[item].condition == "==" && dataObj[structure[item].item] == structure[item].value) ||
                                    (structure[item].condition == ">" && dataObj[structure[item].item] > structure[item].value)               
                                    ){
                                    totalLen += getStructureLength(structure[item].structure, dataObj); 
                        
                              
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
                               
                                totalLen += getTypeLength(structure[item].itemType) * counter;                                              
                                                                                
                                break;
                            
                            case "bitarray":
                                dataObj[item] = [];        
                           
                                var counter = (dataObj[structure[item].count][structure[item].countIndex]+1) || dataObj[structure[item].count];
                               
                                break;
                        }
                    }else if (typeof structure[item] === "function" ){
                    //  dataObj[item] = structure[item].call(this, dataObj, data, this);
                       console.log(item);
                        totalLen += structure[item+"Length"].call(this, dataObj);
                    } else{
              
                        totalLen += getTypeLength(structure[item]);
                    }
       
                }
            }
            
            return totalLen;
            
        };
        
        len += getStructureLength(this._structure, this.data);
        return len;
    };*/
    
    this.readData = function(data, offset){
        /*
        this.offset = data.getPosition();
        var data2 = new jDataView(data.data);
        data2.seek(this.offset);
             */
        
        //   this._offset = data.getPosition();
        this._offset = offset; 
        this._len = 0;
        
        data.seek(offset);
     
        // data.jDataView._offset = parseInt(offset, 10);
      
    
        switch (typeof this._structure){
            case "object":
                this.data = this._readStructure(this._structure, data);
                  
                break;
            case "function":
                //   this.data = this._structure.call(table, data, offset); 
                break;
            
        }
        

     
        if (this._records !== undefined){  
         
            this.records = [];
               
            for (var r = 0; r<this.data[this._records.numTables]; r++){               
                this.records[r] = this._readStructure(this._records.structure,data);
            }                     
        }
        /*
        for (var i = 0; i < this._hex.length; i++){
            this.data[this._hex[i]] = this.toHex(this.data[this._hex[i]]);           
        }*/
        
        this._len += data.getPosition() - offset;
        
    };
    
    this.toHex = function(integer){
        return "0x"+(integer).toString(16).toUpperCase();
    };
    
    return this;
    
};
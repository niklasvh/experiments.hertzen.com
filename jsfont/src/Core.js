var JSFONT = function(font, loadFunc){
    
    if (font){
        // load font
        var binary = this.loadFont(font, loadFunc);
        
    }
    
    
};
/*
JSFONT.prototype.base64 = function(){
    
    
    function cleanHighByte(s) {
        return s.replace(/./g, function(m) { 
            return String.fromCharCode(m.charCodeAt(0) & 0xff);
        });
    };
    
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = "@font-face { font-family: 'test'; src: url(data:font/ttf;base64,"+window.btoa(cleanHighByte(this.binary))+"); } #test { font-family: 'test'  }";
    
    document.getElementById("test").appendChild(style);
    
//console.log(window.btoa(cleanHighByte(this.binary)));
    
//var base64 = new Base64.encode(this.binary);
// console.log(data);

};*/

JSFONT.prototype.loadFont = function(url, loadFunc){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    // xhr.responseType = 'arraybuffer';
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    var _ = this;
    xhr.onload = function(e) {
        //var sfnt_version = new Int32Array(this.response,0,4);
        //console.log(sfnt_version);
         
        _.binary = this.response;
        // _.base64();
        
       
        var reader = new JSFONT.Reader(this.response);
        
        JSFONT.TTCHeader.call(_, reader);
        if (typeof loadFunc == "function"){
            loadFunc.call(_);
        }
    // _.compile();

    };

    xhr.send();
    
    
};


JSFONT.prototype.compile = function(){
    // console.log(this.tables);
    var numTables = (Object.keys(this.tables).length);
    var totalLength = 12 + (Object.keys(this.tables).length) * 16;
    
    
    for (var tableName in this.tables){
        if (this.tables.hasOwnProperty(tableName)){
          //  this.tables[tableName]._offset = totalLength;
       //   console.log(tableName);
       //   console.log(this.tables[tableName]._offset);
        //  console.log(totalLength);
            totalLength += this.tables[tableName]._len;
        }
    // 
    }
    
    
    totalLength = 330740 + 28; // TODO fix to get it automatically, presumably issue with table paddings
    var writer = new JSFONT.Writer(totalLength),
    tables = this.tables,
    tableTags = ["DSIG","FFTM","GDEF","GSUB","JSTF", "LTSH", "OS/2", "PCLT", "VDMX", "cmap", "cvt ", "fpgm","gasp", "glyf", "hdmx", "head", "hhea", "hmtx", "kern", "loca", "maxp", "name", "post", "prep"];
  
    
    // TTC header - len 12
    writer.writeItem("Fixed", this.version);
    writer.writeItem("USHORT", numTables);
    writer.writeItem("USHORT", this.searchRange);
    writer.writeItem("USHORT", this.entrySelector);
    writer.writeItem("USHORT", this.rangeShift);
    
    // Table record entries - len 16 each

    for (var t = 0, len = tableTags.length; t < len; t++){
        if (tables[tableTags[t]] !== undefined){
         
            writer.writeString(tableTags[t]);
            writer.writeItem("ULONG", tables[tableTags[t]].checksum);
            
            writer.writeItem("ULONG", tables[tableTags[t]]._offset);
            writer.writeItem("ULONG", tables[tableTags[t]]._len); 
           
        }
    
   
    }
    var pos = 440900;
    
    for (var tableName in tables){
        if (this.tables.hasOwnProperty(tableName)){
            //  if (tableName.match(/^(head|hhea|maxp|OS\/2|hmtx|cmap|fpgm|prep|cvt |loca|name|post|gasp|GDEF|FFTM)$/)){
            var table = this.tables[tableName];
            writer.seek(table._offset);
            writer._offset = table._offset;
                
            writer.writeStructure(table._structure, table);
              
            // }
            
            if (tableName === "glyf"){
                
                    
                var glyphOffset = this.tables.glyf._offset;
    
                for (var g = 0, len = tables.glyf.glyphs.length; g<len; g++){
        
                   
                    // this.tables.glyf.glyphs[g] = new JSFONT.Glyph();
         
                    // if (tables.loca.data.offsets[g+1] !== tables.loca.data.offsets[g]){
                    // console.log(this.tables.loca.data.offsets[g] + this.tables.glyf._offset);
                    //   data.jDataView.seek(tables.loca.data.offsets[g] + tables.glyf._offset);
          
                    //    tables.glyf.glyphs[g].readData(data, tables.loca.data.offsets[g] + tables.glyf._offset);
                    writer.seek(this.tables.loca.data.offsets[g] + glyphOffset);
                    writer.writeStructure(tables.glyf.glyphs[g]._structure, tables.glyf.glyphs[g]);
           
           
                //      }
                   
        
        
        
          
                }
                
            }else if (tableName === "name"){
                var nameOffset = tables.name._offset + tables.name.data.stringOffset;
                for (var g = 0; g<tables.name.data.count; g++){
                    
                    writer.seek(nameOffset +  tables.name.data.nameRecord[g].offset);
                    writer.writeString(tables.name.content[g]);
                //tables.name.content[g] = data.readString(tables.name.data.nameRecord[g].len);
                    
                }
                
            }
            
        //  totalLength += this.tables[tableName]._len;
        }
    // 
    }
    
    
    return writer;
    /*
        this.version =  data.readFloat32();
    
    var numTables = data.readUInt16();

   
    this.searchRange = data.readUInt16();
    this.entrySelector = data.readUInt16();
    this.rangeShift = data.readUInt16();
 */
    //console.log(writer.blob());
   
   /*
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "base64.php?pos="+pos, true);
    xhr.onreadystatechange = function(){
        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 ) {
                //document.body.innerHTML = "My Name is: " + xhr.responseText;
                
                
         
                
                var t = writer.base64().substring(pos,pos+250);
                if (t == xhr.responseText){
                    console.log("Matched");
                }else{
                    console.log("Not Matched");
                }
                console.log(t);
                console.log(xhr.responseText);
            } 
        }
    };
    xhr.send(null);
   */
    
    
};








JSFONT.TTCHeader = function(data){
    
 
    
    this.version =  data.readFloat32();
    
    var numTables = data.readUInt16();

   
    this.searchRange = data.readUInt16();
    this.entrySelector = data.readUInt16();
    this.rangeShift = data.readUInt16();
    
    var add = data.getPosition();
    
    var tables = [
    "head", JSFONT.headTable,
    "OS/2", JSFONT.OS2Table,
    "name", JSFONT.nameTable,
    "cmap", JSFONT.cmapTable,
    "maxp", JSFONT.maxpTable,
    "loca", JSFONT.locaTable,
    "post", JSFONT.postTable,
    "hhea", JSFONT.hheaTable,
    "hmtx", JSFONT.hmtxTable,
    "hdmx", JSFONT.hdmxTable,
    "kern", JSFONT.kernTable,
    "glyf", JSFONT.glyfTable,
    "DSIG", JSFONT.DSIGTable,
    "FFTM", JSFONT.FFTMTable,
    "GDEF", JSFONT.GDEFTable,
    "cvt ", JSFONT.cvtTable,
    "fpgm", JSFONT.fpgmTable,
    "gasp", JSFONT.gaspTable,
    "prep", JSFONT.prepTable
    ]; 
    
    var tableOffsets = {},
    tableCheckSums = {},
    tableLengths = {};
    
    
    this.tables = {};
     
    for (var i = 0; i < numTables;  i++) { 
      //  var tag = data.readString(4, 12 + i * 16);
        data.seek(12 + i * 16);
        var tag = data.readString(4);
        tableCheckSums[tag] = data.readUInt32(); 
        var offset = data.readUInt32();
        tableOffsets[tag] = offset;
        tableLengths[tag] = data.readUInt32(); 
        
        if (tables.indexOf(tag) == -1){
         //   console.log(tag);
        }
        

        
        
    //data.skip(4); //length

    } 
    //console.log(tableOffsets);
    for (var b = 0, tlen = tables.length; b < tlen; b+=2){
        tag = tables[b];
            
        if (tableOffsets[tag] !== undefined){  
            var table = new tables[b+1](this);
            table.readData(data, tableOffsets[tag]);     
            table.checksum = tableCheckSums[tag]; // checksums not necessary in Chrome at least
           // console.log(table._len);
            table._len = tableLengths[tag];
           // console.log(table._len);
            this.tables[tag] = table;
            
        
            // this.tables[tag].calcLen = this.tables[tag].getLength();
           // console.log(table);             
          //  console.log(tableOffsets[tag]);    
        }
        
        
    }
    
 
       
    /*
    this.tables.loca.table = [];
    
    var locaOffset = this.tables.loca._offset;
    
    for (var g = 0; g<this.tables.maxp.data.numGlyphs; g++){
        
        data.seek(locaOffset);
        if (this.tables.head.data.indexToLocFormat == 1){
            this.tables.loca.table[g] = this.tables.loca._readItem("ULONG",data);        
            locaOffset += 4;
        }else{
            alert("TODO: add indexToLocFormat == 0")
        }
        
      
    }
 */
   
    // load cmap subtables
    /*
    this.tables.cmap.subtables = [];
    
    for (var g = 0; g<this.tables.cmap.data.numTables; g++){
        // data.seek(this.tables.cmap._offset + this.tables.cmap.records[g].offset);
        this.tables.cmap.subtables[g] = new JSFONT.cmapSubtable();
        this.tables.cmap.subtables[g].readData(data, this.tables.cmap._offset + this.tables.cmap.data.records[g].offset)
    }    
 */
    // load name table content
    
    this.tables.name.content = [];
    
    for (var g = 0; g<this.tables.name.data.count; g++){
        data.seek(this.tables.name._offset + this.tables.name.data.stringOffset +  this.tables.name.data.nameRecord[g].offset);
        this.tables.name.content[g] = data.readString(this.tables.name.data.nameRecord[g].len);
     //   this.tables.name._len += this.tables.name.data.nameRecord[g].len;
    }
   // console.log(this.tables.name._len);
   
 
    // load glyphs
    
    this.tables.glyf.glyphs = [];
    
    var glyphOffset = this.tables.glyf._offset;
    
    for (var g = 0, len = this.tables.loca.data.offsets.length; g<len; g++){
        
        
        this.tables.glyf.glyphs[g] = new JSFONT.Glyph();
         
        if (this.tables.loca.data.offsets[g+1] !== this.tables.loca.data.offsets[g]){
            // console.log(this.tables.loca.data.offsets[g] + this.tables.glyf._offset);
            data.jDataView.seek(this.tables.loca.data.offsets[g] + this.tables.glyf._offset);
          
            this.tables.glyf.glyphs[g].readData(data, this.tables.loca.data.offsets[g] + this.tables.glyf._offset);
            glyphOffset += this.tables.glyf.glyphs[g]._len;
        /*
             console.log(this.tables.loca.data.offsets[g] + this.tables.glyf._offset);
             if (g>10){
            break;
            }*/
           
        }
        
        
          
    }
        
    // load hmtx 
    /*
    data.seek(this.tables.hmtx._offset);
    this.tables.hmtx.hMetrics = [];
    this.tables.hmtx.leftSideBearing = [];
    for (var g = 0; g<this.tables.hhea.data.numberOfHMetrics; g++){
        this.tables.hmtx.hMetrics[g] = this.tables.hmtx._readItem("USHORT",data);
        this.tables.hmtx.leftSideBearing[g] = this.tables.hmtx._readItem("SHORT",data); 
        
    }
 */
    
    //console.log(this.tables.glyf.glyphs[4]);
    
    // JSFONT.RenderGlyph(this.tables.glyf.glyphs[4]);
    
    // name table
    

    

    


    
    
    /*
    var numTables = new Uint8Array(data.data,20,4);
    console.log(numTables);
    console.log(numTables[3].toString(16));*/
    //console.log(String.fromCharCode(79,83,47,50));
    
    //console.log(data.position);

 
    
/*
    var numTables = new Uint16Array(data,4,2)
    console.log(numTables);
        
    var numTables = new Uint8Array(data,4,2);
    var searchRange = new Uint8Array(data,6,2);
    var entrySelector = new Uint8Array(data,8,2);
    var rangeShift = new Uint8Array(data,10,2);
    console.log(numTables[1]);*/
    
}

//JSFONT.TTCHeader.prototype = new JSFONT.Table();
//JSFONT.TTCHeader.prototype.constructor = JSFONT.TTCHeader;
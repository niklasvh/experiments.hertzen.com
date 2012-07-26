/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.9.2011 
* @website http://hertzen.com
 */


var SVG = function( width, height ) {
    this.svgNS = "http://www.w3.org/2000/svg";
    this.doc = document;
    this.element = this.doc.createElementNS(this.svgNS, "svg");
    this.element.setAttribute("viewBox", "0 0 " + width + " " + height);
    this.element.setAttribute("width", width);
    this.element.setAttribute("height", height);
    
    return this;
    
}

SVG.prototype.addPoint = function (x, y) {
    var shape = this.doc.createElementNS(this.svgNS, "circle");
    shape.setAttributeNS(null, "cx", x);
    shape.setAttributeNS(null, "cy", y);
    shape.setAttributeNS(null, "r",  20);
    shape.setAttributeNS(null, "fill", "red");
    
    this.element.appendChild(shape);

    return shape;
}

SVG.prototype.drawLine = function (x1, y1, x2, y2) {
    var shape = this.doc.createElementNS(this.svgNS, "line");
    shape.setAttributeNS(null, "x1", x1);
    shape.setAttributeNS(null, "y1", y1);
    shape.setAttributeNS(null, "x2",  x2);
    shape.setAttributeNS(null, "y2", y2);
    shape.setAttributeNS(null, "style", "stroke:red;stroke-width:5");
    this.element.appendChild(shape);
    return shape;
}

//
// jDataView by Vjeux - Jan 2010
//
// A unique way to read a binary file in the browser
// http://github.com/vjeux/jsDataView
// http://blog.vjeux.com/ <vjeuxx@gmail.com>
// 



var compatibility = {
	ArrayBuffer: typeof ArrayBuffer !== 'undefined',
	DataView: typeof DataView !== 'undefined' && 'getFloat64' in DataView.prototype
}

var jDataView = function (buffer, byteOffset, byteLength, littleEndian) {
	this._buffer = buffer;

	// Handle Type Errors
	if (!(compatibility.ArrayBuffer && buffer instanceof ArrayBuffer) &&
		!(typeof buffer === 'string')) {
		throw new TypeError("Type error");
	}

	// Check parameters and existing functionnalities
	this._isArrayBuffer = compatibility.ArrayBuffer && buffer instanceof ArrayBuffer;
	this._isDataView = compatibility.DataView && this._isArrayBuffer;

	// Default Values
	this._littleEndian = littleEndian === undefined ? true : littleEndian;

	var bufferLength = this._isArrayBuffer ? buffer.byteLength : buffer.length;
	if (byteOffset == undefined) {
		byteOffset = 0;
	}

	if (byteLength == undefined) {
		byteLength = bufferLength - byteOffset;
	}

	if (!this._isDataView) {
		// Do additional checks to simulate DataView
		if (typeof byteOffset !== 'number') {
			throw new TypeError("Type error");
		}
		if (typeof byteLength !== 'number') {
			throw new TypeError("Type error");
		}
		if (typeof byteOffset < 0) {
			throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
		}
		if (typeof byteLength < 0) {
			throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
		}
	}

	// Instanciate
	if (this._isDataView) {
		this._view = new DataView(buffer, byteOffset, byteLength);
		this._start = 0;
	}
	this._start = byteOffset;
	if (this._end >= bufferLength) {
		throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
	}

	this._offset = 0;
	this.length = byteLength;
};

jDataView.createBuffer = function () {
	if (typeof ArrayBuffer !== 'undefined') {
		var buffer = new ArrayBuffer(arguments.length);
		var view = new Int8Array(buffer);
		for (var i = 0; i < arguments.length; ++i) {
			view[i] = arguments[i];
		}
		return buffer;
	}

	return String.fromCharCode.apply(null, arguments);
};

jDataView.prototype = {

	// Helpers

	getString: function (length, byteOffset) {
		var value;

		// Handle the lack of byteOffset
		if (byteOffset === undefined) {
			var byteOffset = this._offset;
		}

		// Error Checking
		if (typeof byteOffset !== 'number') {
			throw new TypeError("Type error");
		}
		if (length < 0 || byteOffset + length > this.length) {
			throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
		}

		if (this._isArrayBuffer) {
			// Use Int8Array and String.fromCharCode to extract a string
			var int8array = new Int8Array(this._buffer, this._start + byteOffset, length);
			var stringarray = [];
			for (var i = 0; i < length; ++i) {
				stringarray[i] = int8array[i];
			}
			value = String.fromCharCode.apply(null, stringarray);
		} else {
			value = this._buffer.substr(this._start + byteOffset, length);
		}

		this._offset = byteOffset + length;
		return value;
	},

	getChar: function (byteOffset) {
		var value, size = 1, length;

		// Handle the lack of byteOffset
		if (byteOffset === undefined) {
			var byteOffset = this._offset;
		}

		if (this._isArrayBuffer) {
			// Use Int8Array and String.fromCharCode to extract a string
			value = String.fromCharCode(this.getUint8(byteOffset));
		} else {
			// Error Checking
			if (typeof byteOffset !== 'number') {
				throw new TypeError("Type error");
			}
			if (length < 0 || byteOffset + size > this.length) {
				throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
			}

			value = this._buffer.charAt(this._start + byteOffset);
			this._offset = byteOffset + size;
		}

		return value;
	},

	tell: function () {
		return this._offset;
	},
	
	seek: function (byteOffset) {
		if (typeof byteOffset !== 'number') {
			throw new TypeError("Type error");
		}
		if (byteOffset < 0 || byteOffset > this.length) {
			throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
		}

		this._offset = byteOffset;
	},
        
        skip: function(byteOffset){
            this._offset += byteOffset;
            
        },

	// Compatibility functions on a String Buffer

	_endianness: function (offset, pos, max, littleEndian) {
		return offset + (littleEndian ? max - pos - 1 : pos);
	},

	_getFloat64: function (offset, littleEndian) {
		var b0 = this._getUint8(this._endianness(offset, 0, 8, littleEndian)),
			b1 = this._getUint8(this._endianness(offset, 1, 8, littleEndian)),
			b2 = this._getUint8(this._endianness(offset, 2, 8, littleEndian)),
			b3 = this._getUint8(this._endianness(offset, 3, 8, littleEndian)),
			b4 = this._getUint8(this._endianness(offset, 4, 8, littleEndian)),
			b5 = this._getUint8(this._endianness(offset, 5, 8, littleEndian)),
			b6 = this._getUint8(this._endianness(offset, 6, 8, littleEndian)),
			b7 = this._getUint8(this._endianness(offset, 7, 8, littleEndian)),

			sign = 1 - (2 * (b0 >> 7)),
			exponent = ((((b0 << 1) & 0xff) << 3) | (b1 >> 4)) - (Math.pow(2, 10) - 1),

		// Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
			mantissa = ((b1 & 0x0f) * Math.pow(2, 48)) + (b2 * Math.pow(2, 40)) + (b3 * Math.pow(2, 32))
					+ (b4 * Math.pow(2, 24)) + (b5 * Math.pow(2, 16)) + (b6 * Math.pow(2, 8)) + b7;

		if (mantissa == 0 && exponent == -(Math.pow(2, 10) - 1)) {
			return 0.0;
		}

		if (exponent == -1023) { // Denormalized
			return sign * mantissa * Math.pow(2, -1022 - 52);
		}

		return sign * (1 + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);
	},

	_getFloat32: function (offset, littleEndian) {
		var b0 = this._getUint8(this._endianness(offset, 0, 4, littleEndian)),
			b1 = this._getUint8(this._endianness(offset, 1, 4, littleEndian)),
			b2 = this._getUint8(this._endianness(offset, 2, 4, littleEndian)),
			b3 = this._getUint8(this._endianness(offset, 3, 4, littleEndian)),

			sign = 1 - (2 * (b0 >> 7)),
			exponent = (((b0 << 1) & 0xff) | (b1 >> 7)) - 127,
			mantissa = ((b1 & 0x7f) << 16) | (b2 << 8) | b3;

		if (mantissa == 0 && exponent == -127) {
			return 0.0;
		}

		if (exponent == -127) { // Denormalized
			return sign * mantissa * Math.pow(2, -126 - 23);
		}

		return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
	},

	_getInt32: function (offset, littleEndian) {
		var b = this._getUint32(offset, littleEndian);
		return b > Math.pow(2, 31) - 1 ? b - Math.pow(2, 32) : b;
	},

	_getUint32: function (offset, littleEndian) {
		var b3 = this._getUint8(this._endianness(offset, 0, 4, littleEndian)),
			b2 = this._getUint8(this._endianness(offset, 1, 4, littleEndian)),
			b1 = this._getUint8(this._endianness(offset, 2, 4, littleEndian)),
			b0 = this._getUint8(this._endianness(offset, 3, 4, littleEndian));

		return (b3 * Math.pow(2, 24)) + (b2 << 16) + (b1 << 8) + b0;
	},

	_getInt16: function (offset) {
		var b = this._getUint16(offset);
		return b > Math.pow(2, 15) - 1 ? b - Math.pow(2, 16) : b;
	},

	_getUint16: function (offset, littleEndian) {
		var b1 = this._getUint8(this._endianness(offset, 0, 2, littleEndian)),
			b0 = this._getUint8(this._endianness(offset, 1, 2, littleEndian));

		return (b1 << 8) + b0;
	},

	_getInt8: function (offset) {
		var b = this._getUint8(offset);
		return b > Math.pow(2, 7) - 1 ? b - Math.pow(2, 8) : b;
	},

	_getUint8: function (offset) {
		if (this._isArrayBuffer) {
			return new Uint8Array(this._buffer, this._start + offset, 1)[0];
		} else {
			return this._buffer.charCodeAt(this._start + offset) & 0xff;
		}
	}
};

// Create wrappers

var dataTypes = {
	'Int8': 1,
	'Int16': 2,
	'Int32': 4,
	'Uint8': 1,
	'Uint16': 2,
	'Uint32': 4,
	'Float32': 4,
	'Float64': 8
};

for (var type in dataTypes) {
	// Bind the variable type
	(function (type) {
		var size = dataTypes[type];

		// Create the function
		jDataView.prototype['get' + type] = 
			function (byteOffset, littleEndian) {
				var value;

				// Handle the lack of endianness
				if (littleEndian == undefined) {
					littleEndian = this._littleEndian;
				}

				// Handle the lack of byteOffset
				if (byteOffset === undefined) {
                               
					byteOffset = this._offset;
				}

				// Dispatch on the good method
				if (this._isDataView) {
					// DataView: we use the direct method
					value = this._view['get' + type](byteOffset, littleEndian);
				}
				// ArrayBuffer: we use a typed array of size 1 if the alignment is good
				// ArrayBuffer does not support endianess flag (for size > 1)
				else if (this._isArrayBuffer && byteOffset % size == 0 && (size == 1 || littleEndian)) {
					value = new window[type + 'Array'](this._buffer, byteOffset, 1)[0];
				}
				else {
					// Error Checking
					if (typeof byteOffset !== 'number') {
						throw new TypeError("Type error");
					}
					if (byteOffset + size > this.length) {
                                         //   console.log(byteOffset);
                                          
						throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
					}
					value = this['_get' + type](this._start + byteOffset, littleEndian);
				}

				// Move the internal offset forward
				this._offset = byteOffset + size;

				return value;
			};
	})(type);
}

window.jDataView = jDataView;


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
JSFONT.Reader = function(data){
    
    this.jDataView = new window.jDataView(data);
    this._pos = 0;
    this.data = data;
   // this.BP = new BinaryParser(true, false);
   // this.NBP = new BinaryParser(true, false);
    return this;
};

// Modified version from: BinaryReader
// Refactored by Vjeux <vjeuxx@gmail.com>
// http://blog.vjeux.com/2010/javascript/javascript-binary-reader.html

// Original
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/classes/binary-parser [rev. #1]

JSFONT.Reader.prototype = {
    
    getPosition: function(){
        // return this._pos;  
        return this.jDataView.tell();
    },
    
    readInt8:	function (){
        return this._decodeInt(8, true);
    },
    
    readUInt8:	function (){
        return this._decodeInt(8, false);
    },
    
    readInt16:	function (){
        return this._decodeInt(16, true);
    },
    
    readUInt16:	function (){
        
        return this._decodeInt(16, false);
    },
    
    readInt32:	function (){
        return this._decodeInt(32, true);
    },
    
    readUInt32:	function (){
        return this._decodeInt(32, false);
    },
 
     readUInt64:	function (){
        return this._decodeInt(64, false);
    },
 
    readString: function (length) {
        
        // this._checkSize(length * 8);
        // var result = this.data.substr(this._pos, length);
        // this._pos += length;
        // return this.data.getString(length);
        return this.jDataView.getString(length, this.jDataView.tell());
    },
    
    readFloat32: function(){
        return this.jDataView["getUint16"](this.jDataView.tell(),false)+"."+this.jDataView["getUint16"](this.jDataView.tell(),false);
    },
    
    skip: function(length){       
        // this._pos += parseInt(length,10) || 0;  
        this.jDataView.skip(length);
        
    },
    seek: function (pos) {
        this.jDataView.seek(pos);
    //this._pos = pos || this._pos;
    
    },
    
    _decodeInt: function(bits, signed){
        /*
        var x = this.data.substr(this._pos,(bits / 8));        
        this._pos += bits / 8;
        */
        if (signed){
            var name = "getInt"+bits;
        }else{
            var name = "getUint"+bits;
        }
        if (bits > 8){
         
            return this.jDataView[name](undefined,false);
        }else{
            return this.jDataView[name](undefined);
        }
        
    /*
        if (bits == 32){
            return this.NBP.decodeInt(x, bits, signed);
        }else{
            return this.BP.decodeInt(x, bits, signed);
        }*/
        
    }
    
/*
    skip: function(length){       
        this._pos += parseInt(length,10) || 0;   
        this._checkSize(0);
    },
    seek: function (pos) {
        this._pos = pos;
        this._checkSize(0);
    },
    readString: function (length) {
        this._checkSize(length * 8);
        var result = this.data.substr(this._pos, length);
        this._pos += length;
        return result;
    },
    
    readInt8:	function (){
        return this._decodeInt(8, true);
    },
    
    readUInt8:	function (){
        return this._decodeInt(8, false);
    },
    
    readInt16:	function (){
        return this._decodeInt(16, true);
    },
    
    readUInt16:	function (){
        return this._decodeInt(16, false);
    },
    
    readInt32:	function (){
        return this._decodeInt(32, true);
    },
    
    readUInt32:	function (){
        return this._decodeInt(32, false);
    },

    _checkSize: function (neededBits) {
        if (!(this._pos + Math.ceil(neededBits / 8) < this.data.length)) {
            throw new Error("Index out of bound");
        }
    },
    
    _decodeInt: function(bits, signed){
        var x = this._readBits(0, bits, bits / 8), max = Math.pow(2, bits);
        var result = signed && x >= max / 2 ? x - max : x;

        this._pos += bits / 8;
        return result;
    },
    
    //shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)
    _shl: function (a, b){
        for (++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
        return a;
    },
    
    _readBits: function (start, length, size) {
        var offsetLeft = (start + length) % 8;
        var offsetRight = start % 8;
        var curByte = size - (start >> 3) - 1;
        var lastByte = size + (-(start + length) >> 3);
        var diff = curByte - lastByte;

        var sum = (this._readByte(curByte, size) >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1);

        if (diff && offsetLeft) {
            sum += (this._readByte(lastByte++, size) & ((1 << offsetLeft) - 1)) << (diff-- << 3) - offsetRight; 
        }

        while (diff) {
            sum += this._shl(this._readByte(lastByte++, size), (diff-- << 3) - offsetRight);
        }

        return sum;
    },
        
    _readByte: function (i, size) {
        return this.data.charCodeAt(this._pos + size - i - 1) & 0xff;
    }
    
*/
}
JSFONT.RenderGlyph = function(glyph){
  
    var x = 0,
    y = 0;
  
   
//var svg = Raphael(10, 50, 1320, 1200);
    
  

    for (var i = 0; i < glyph.data.xCoordinates.length; i++){
        x += glyph.data.xCoordinates[i];
        y += glyph.data.yCoordinates[i];
        
     //   svg.circle(x / 3, y / 3, 10);
        /*
        var dot = document.createElement("circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy",  y);
        dot.setAttribute("fill", "black");
        dot.setAttribute("r", 20);
        */
        
       
        
        
    }
    
   
};

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

JSFONT.MacGlyph = function(code){
    
    var asciiCode;
    this.MacIndex = code;
    
    if (code == 0){
        asciiCode = null;
    }else if (code <= 97){
        asciiCode =  (code + 29);
    }else{
        
        // TODO finish list http://www.microsoft.com/typography/otspec/WGL4C.HTM
        var codes = {
            98: 196,
            99: 197,
            100: 199,
            101: 201,
            102: 209
            
        };
        
        asciiCode =  (codes[code]);
    }
    
    this.toString = function(){
      return String.fromCharCode(asciiCode); 
    };
    
    return this;
    
    
};

JSFONT.MacGlyph.prototype.write = function (writer){
    
    var len = this.name.length;
    for (var i = 0; i < len; i++){
       writer.writeItem("CHAR",this.name.charCodeAt(i));
    }
  
};
JSFONT.PSGlyph = function(name){
    
    this.name = name;
    this.toString = function(){
        return this.name;
    };
    return this;
    
};

JSFONT.PSGlyph.prototype.readData = function(data, obj){
    
    var stringLen = obj._readItem("CHAR", data); 
    var tmp = "";
    for (var s = 0; s < stringLen; s++){
        tmp +=  String.fromCharCode(obj._readItem("CHAR", data)); 
    }
    
    this.name = tmp;

};

JSFONT.PSGlyph.prototype.write = function (writer){
    
    var len = this.name.length;
    writer.writeItem("CHAR",len);
    for (var i = 0; i < len; i++){
       writer.writeItem("CHAR",this.name.charCodeAt(i));
    }
  
};
// http://www.microsoft.com/typography/otspec/WGL4B.HTM

JSFONT.WGL4 = {
    0: 0x0,
    3: 0x20,
    4: 0x21,
    5: 0x22,
    6: 0x23,
    7: 0x24,
    8: 0x25,
    9: 0x26,
    10: 0x27,
    11: 0x28,
    12: 0x29,
    13: 0x2a,
    14: 0x2b,
    15: 0x2c,
    16: 0x2d,
    17: 0x2e,
    18: 0x2f,
    19: 0x30,
    20: 0x31
    
        
        
};

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

JSFONT.FFTMTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "ULONG"
    },

    {
        "FontForgeCreation": "LONGDATETIME"
    },
    {
        "sfdCreation": "LONGDATETIME"
    },
    {
        "sfdModification": "LONGDATETIME"
    }
    ];
    

    
    
    return this;
};
    
JSFONT.FFTMTable.prototype = new JSFONT.Table();
JSFONT.FFTMTable.prototype.constructor = JSFONT.FFTMTable;

JSFONT.GDEFTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "ULONG"
    },

    {
        "GlyphClassDef": "USHORT"
    },
    {
        "AttachList": "USHORT"
    },
    {
        "LigCaretList": "USHORT"
    },
    {
        "MarkAttachClassDef": "USHORT"
    },
    {
        "cond1":{
            "type": "condition",
            "condition": ">",
            "value": 0,
            "item": "GlyphClassDef",
            "structure":[
            {
                "offset1":{
                    "type": "offset",
                    "item": "GlyphClassDef",
                    "structure":[
                    {
                        "baseGlyphFormat": "USHORT"                           
                    },
                    {
                        "cond1": {
                            "type": "condition",
                            "item": "baseGlyphFormat",
                            "value": 2,
                            "condition": "==",
                            "structure": [
                            {
                                "classRangeCount": "USHORT"                        
                            },
                            {
                                "classRangeRecords":{
                                    "type": "records",
                                    "numTables": "classRangeCount",
                                    "structure":[
                                    {
                                        "start": "USHORT"
                                    },
                                    {
                                        "end": "USHORT"
                                    },
                                    {
                                        "Class": "USHORT"
                                    } 
                                                    
                                    ]
                                }
                            }
                            ]
                        }
                    }
                    ]
                }
            },{
                "cond2":{
                    "type": "condition",
                    "condition": ">",
                    "value": 0,
                    "item": "AttachList",
                    "structure":[     
                    {
                        "offset2":{
                            "type": "offset",
                            "item": "AttachList",
                            "structure":[
                            {
                                "AttachListCoverage": "USHORT"                           
                            },
                            {
                                "GlyphCount": "USHORT"
                            } // todo add last field ------------------------------------
                            ]
                        }
                    }
                    ]
                }
            },{
                "cond3":{
                    "type": "condition",
                    "condition": ">",
                    "value": 0,
                    "item": "LigCaretList",
                    "structure":[     
                    {
                        "offset2":{
                            "type": "offset",
                            "item": "LigCaretList",
                            "structure":[
                            {
                                "LigCaretListCoverage": "USHORT"                           
                            },
                            {
                                "LigGlyphCount": "USHORT"
                            }// todo add last field ------------------------------------
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
    

    
    
    return this;
};
    
JSFONT.GDEFTable.prototype = new JSFONT.Table();
JSFONT.GDEFTable.prototype.constructor = JSFONT.GDEFTable;

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
JSFONT.cvtTable = function(data){   
   var _ = this;
    this._structure = [
    {
        "controls": {
            "type": "array",
            "itemType": "FWORD",
            "count": function(){
               // console.log(_._len);
               
               var len = 58; // TODO get real length
               
               return len/2;
            }
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.cvtTable.prototype = new JSFONT.Table();
JSFONT.cvtTable.prototype.constructor = JSFONT.cvtTable;

JSFONT.fpgmTable = function(data){   
   var _ = this;
    this._structure = [
    {
        "controls": {
            "type": "array",
            "itemType": "BYTE",
            "count": function(){
               // console.log(_._len);
               
               var len = 613; // TODO get real length
               
               return len;
            }
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.fpgmTable.prototype = new JSFONT.Table();
JSFONT.fpgmTable.prototype.constructor = JSFONT.fpgmTable;

JSFONT.gaspTable = function(data){   

    this._structure = [
    {
        "version" : "USHORT"
    },
    {
        "numRanges": "USHORT"
    },
    {
        "gaspRanges": {
            "type": "records",
            "numTables": "numRanges",
            "structure":[
                {
                    "rangeMaxPPEM": "USHORT"
                },
                {
                    "rangeGaspBehavior": "USHORT"
                }
            ]
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.gaspTable.prototype = new JSFONT.Table();
JSFONT.gaspTable.prototype.constructor = JSFONT.gaspTable;




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


JSFONT.hdmxTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "USHORT"
    },

    {
        "numRecords": "USHORT"
    },

    {
        "sizeDeviceRecord": "LONG"
    }      
    ];
    
    this._records = {
        "numTables": "numRecords",
        "structure": [
        {
            "pixelSize": "BYTE"
        },

        {
            "maxWidth": "BYTE"
        },

        {
            "widths": {
                "type": "array",
                "count": function(){ return data.tables.maxp.data.numGlyphs; },
                "itemType": "BYTE"
            }
        }
        ]
    };
    
    

    
    
    return this;
};
    
JSFONT.hdmxTable.prototype = new JSFONT.Table();
JSFONT.hdmxTable.prototype.constructor = JSFONT.hdmxTable;



JSFONT.headTable = function(data){   
   
    this._structure = [
    {
        "version": "Fixed"
    },

    {
        "revision": "Fixed"
    },

    {
        "checkSumAdjustment": "ULONG"
    },

    {
        "magicNumber": "ULONG"
    },

    {
        "flags": "USHORT"
    },

    {
        "unitsPerEm": "USHORT"
    },

    {
        "created": "LONGDATETIME"
    },

    {
        "modified": "LONGDATETIME"
    },

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
        "macStyle": "USHORT"
    },

    {
        "lowestRecPPEM": "USHORT"
    },

    {
        "fontDirectionHint": "SHORT"
    },

    {
        "indexToLocFormat": "SHORT"
    },

    {
        "glyphDataFormat": "SHORT"
    }
        
    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.headTable.prototype = new JSFONT.Table();
JSFONT.headTable.prototype.constructor = JSFONT.headTable;


JSFONT.hheaTable = function(data){   
   
    this._structure = [
    {
        "version": "Fixed"
    },
    {
        "Ascender": "FWORD"
    },
    {
        "Descender": "FWORD"
    },
    {
        "LineGap": "FWORD"
    },
    {
        "advancedWidthMax": "UFWORD"
    },
    {
        "minLeftSideBearing": "FWORD"
    },
    {
        "minRightSideBearing": "FWORD"
    },
    {
        "xMaxExtent": "FWORD"
    },
    {
        "caretSlopeRise": "SHORT"
    },
    {
        "caretSlopeRun": "SHORT"
    },
    {
        "caretOffset": "SHORT"
    },
    {
        "reserved1": "SHORT"
    },
    {
        "reserved2": "SHORT"
    },
    {
        "reserved3": "SHORT"
    },
    {
        "reserved4": "SHORT"
    },
    {
        "metricDataFormat": "SHORT"
    },
    {
        "numberOfHMetrics": "USHORT"
    }                                
    ];

    
    return this;
};
    
JSFONT.hheaTable.prototype = new JSFONT.Table();
JSFONT.hheaTable.prototype.constructor = JSFONT.hheaTable;

JSFONT.hmtxTable = function(data){   
   
    this._structure = [
        {
            "records": {
                "type": "records",
                "numTables": function() {
                    return data.tables.hhea.data.numberOfHMetrics
                },
                "structure": [
                    {
                        "hMetrics": "USHORT",
                        "leftSideBearing": "SHORT"
                    }
                ]
            }
            
        },
        {
            "leftSideBearing": {
                "type": "array",
                "count": function(){
                    return data.tables.maxp.data.numGlyphs - data.tables.hhea.data.numberOfHMetrics;
                },
                "itemType": "USHORT"
            }
        }
    ];
    this.data = {};
    
    
    return this;
};
    
JSFONT.hmtxTable.prototype = new JSFONT.Table();
JSFONT.hmtxTable.prototype.constructor = JSFONT.hmtxTable;

JSFONT.kernTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "USHORT"
    },

    {
        "nTables": "USHORT"
    },
    {
        "subTables": {
            "type": "records",
            "numTables": "nTables",
            "structure": [
            {
                "version": "USHORT"
            },

            {
                "length": "USHORT"
            },
            {
                "coverage": "USHORT"
            },
            {
                "cond1":{
                    "type": "condition",
                    "item": "version",
                    "condition": "==",
                    "value": 0,
                    "structure": [
                    {
                        "nPairs": "USHORT"
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
                        "kerningPairs":{
                            "type": "records",
                            "numTables" : "nPairs",
                            "structure": [
                            {
                                "left": "USHORT"
                            },

                            {
                                "right": "USHORT"
                            },

                            {
                                "value": "FWORD"
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
        "numTables": "nTables",
        "structure": [
        {
            "version": "USHORT"
        },

        {
            "length": "USHORT"
        },
        {
            "coverage": "USHORT"
        },
        {
            "cond1":{
                "type": "condition",
                "item": "version",
                "condition": "==",
                "value": 0,
                "structure": [
                {
                    "nPairs": "USHORT"
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
                    "kerningPairs":{
                        "type": "records",
                        "numTables" : "nPairs",
                        "structure": [
                        {
                            "left": "USHORT"
                        },

                        {
                            "right": "USHORT"
                        },

                        {
                            "value": "FWORD"
                        }
                        
                        ]
                    }
                }
                    
                ]
            }  
        }
        ]
    };
    */
    

    
    
    return this;
};
    
JSFONT.kernTable.prototype = new JSFONT.Table();
JSFONT.kernTable.prototype.constructor = JSFONT.kernTable;


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





JSFONT.maxpTable = function(data){   
   
    this._structure = [
    {
        "version": "Fixed"
    },

    {
        "numGlyphs": "USHORT"
    },

    {
        "cond1":{
            "type": "condition",
            "item": "version",
            "condition": "==",
            "value": "1.0",
            "structure":[
            {
                "maxPoints": "USHORT"
            },

            {
                "maxContours": "USHORT"
            },

            {
                "maxCompositePoints": "USHORT"
            },

            {
                "maxCompositeContours": "USHORT"
            },

            {
                "maxZones": "USHORT"
            },

            {
                "maxTwilightPoints": "USHORT"
            },

            {
                "maxStorage": "USHORT"
            },

            {
                "maxFunctionDefs": "USHORT"
            },

            {
                "maxInstructionDefs": "USHORT"
            },

            {
                "maxStackElements": "USHORT"
            },

            {
                "maxSizeOfInstructions": "USHORT"
            },

            {
                "maxComponentElements": "USHORT"
            },

            {
                "maxComponentDepth": "USHORT"
            }
            ]
        }
    }
    ];
    
    this._hex = [];
  
    return this;
};
    
JSFONT.maxpTable.prototype = new JSFONT.Table();
JSFONT.maxpTable.prototype.constructor = JSFONT.maxpTable;
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



JSFONT.OS2Table = function(data){   
   
    this._structure = [
    {
        "version": "USHORT"
    },

    {
        "xAvgCharWidth": "SHORT"
    },

    {
        "usWeightClass": "USHORT"
    },

    {
        "usWidthClass": "USHORT"
    },

    {
        "fsType": "USHORT"
    },

    {
        "ySubscriptXSize": "SHORT"
    },

    {
        "ySubscriptYSize": "SHORT"
    },

    {
        "ySubscriptXOffset": "SHORT"
    },

    {
        "ySubscriptYOffset": "SHORT"
    },

    {
        "ySuperscriptXSize": "SHORT"
    },

    {
        "ySuperscriptYSize": "SHORT"
    },

    {
        "ySuperscriptXOffset": "SHORT"
    },

    {
        "ySuperscriptYOffset": "SHORT"
    },

    {
        "yStrikeoutSize": "SHORT"
    },

    {
        "yStrikeoutPosition": "SHORT"
    },

    {
        "sFamilyClass": "SHORT"
    },

    {
        "panose1": "BYTE"
    },

    {
        "panose2": "BYTE"
    },

    {
        "panose3": "BYTE"
    },

    {
        "panose4": "BYTE"
    },

    {
        "panose5": "BYTE"
    },

    {
        "panose6": "BYTE"
    },

    {
        "panose7": "BYTE"
    },

    {
        "panose8": "BYTE"
    },

    {
        "panose9": "BYTE"
    },

    {
        "panose10": "BYTE"
    },

    {
        "ulUnicodeRange1": "ULONG"
    },

    {
        "ulUnicodeRange2": "ULONG"
    },

    {
        "ulUnicodeRange3": "ULONG"
    },

    {
        "ulUnicodeRange4": "ULONG"
    },   

    {
        "achVendID1": "CHAR"
    },

    {
        "achVendID2": "CHAR"
    },

    {
        "achVendID3": "CHAR"
    },

    {
        "achVendID4": "CHAR"
    },        

    {
        "fsSelection": "USHORT"
    },

    {
        "usFirstCharIndex": "USHORT"
    },

    {
        "usLastCharIndex": "USHORT"
    },

    {
        "sTypoAscender": "SHORT"
    },

    {
        "sTypoDescender": "SHORT"
    },

    {
        "sTypoLineGap": "SHORT"
    },

    {
        "usWinAscent": "USHORT"
    },

    {
        "usWinDescent": "USHORT"
    },

    {
        "ulCodePageRange1": "ULONG"
    },

    {
        "ulCodePageRange2": "ULONG"
    },
    {
        "cond1":{
            "type": "condition",
            "item": "version",
            "condition": ">",
            "value": 1,
            "structure":[
            {
                "sxHeight": "SHORT"
            },

            {
                "sCapHeight": "SHORT"
            },

            {
                "usDefaultChar": "USHORT"
            },

            {
                "usBreakChar": "USHORT"
            },

            {
                "usMaxContext": "USHORT"
            } 
            ]
        }
    }
    
      
    ];
    

    this.data = {};
    
    
    return this;
};
    
JSFONT.OS2Table.prototype = new JSFONT.Table();
JSFONT.OS2Table.prototype.constructor = JSFONT.OS2Table;

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
JSFONT.prepTable = function(data){   

    this._structure = [
    {
        "controls": {
            "type": "array",
            "itemType": "BYTE",
            "count": function(){
               // console.log(_._len);
               
               var len = 108; // TODO get real length
               
               return len;
            }
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.prepTable.prototype = new JSFONT.Table();
JSFONT.prepTable.prototype.constructor = JSFONT.prepTable;


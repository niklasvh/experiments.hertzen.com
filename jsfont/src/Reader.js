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
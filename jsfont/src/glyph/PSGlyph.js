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
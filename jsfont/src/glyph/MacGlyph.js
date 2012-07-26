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
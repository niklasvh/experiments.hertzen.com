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

var VisualBlur = function(ready){
    var canvas,
    ctx;
    html2canvas.Preload(undefined, {
        complete: function(images){
            var queue =  html2canvas.Parse(undefined, images);
            canvas = html2canvas.Renderer(queue);
            ctx = canvas.getContext("2d");
            if (typeof ready === "function"){
                window.setTimeout(function(){
                    ready(canvas);
                }, 0);         
            }
        }
    });
    

    
    var methods = {
        "blurCanvas": function(blurCanvas, bounds, amount){
            amount = amount || 10;
            stackBlurCanvasRGBA(blurCanvas, bounds.left, bounds.top, bounds.width, bounds.height, amount);
        }, 
        "blurNode": function(node, amount){
            if(typeof canvas !== "object") {
                return;
            }
            
            var tempCanvas = document.createElement("canvas"),
            tmpctx = tempCanvas.getContext("2d"),
            wLeft = window.pageXOffset,
            wTop = window.pageYOffset,
            bounds;
            
            if (node !== undefined){
                bounds = node.getBoundingClientRect();
            }else{
                bounds = {
                    top: 0,
                    left: 0,
                    width: canvas.width,
                    height: canvas.height
                };
            }
            
            tempCanvas.width = bounds.width;
            tempCanvas.height = bounds.height;
            
            var imageData = ctx.getImageData(bounds.left + wLeft, bounds.top + wTop, canvas.width, canvas.height);
            
            tmpctx.putImageData(imageData, 0, 0);
            
            document.body.appendChild(tempCanvas);
            amount = amount || 10;
            
            stackBlurCanvasRGBA(tempCanvas, 0, 0, bounds.width, bounds.height, amount);
          
            tempCanvas.style.position = "absolute";
            tempCanvas.style.top = bounds.top + wTop + "px";
            tempCanvas.style.left = bounds.left + wLeft + "px";   
                  
        }
        
    };
   
    return methods;
};


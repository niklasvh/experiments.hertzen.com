var imageLoaded;
var img = new Image();   

img.onload = function(){
    imageLoaded = true;
    log('image onLoad complete');
}    
img.src = "http://img.mtv3.fi/mn_kuvat/mtv3/etusivu/2011/06/1152685-max484x484.jpg"; 
var date = new Date();
var startTime = date.getTime();
while(!imageLoaded){
    date = new Date();
                            
    if ((date.getTime()-(5*1000))>startTime){                          
        break;                                   
    } 
}

log(imageLoaded);

window.setTimeout(function(){
    log(imageLoaded);
},0);

function log(a){
    var d = new Date();
    console.log(d.getTime()+"-"+a);  
}

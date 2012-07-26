

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = (function() {

        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

            window.setTimeout( callback, 1000 / 60 );

        };

    } )();

}

(function($) {
    $.fn.html2webgl = function(options) {
        var opts = $.extend({
           
            logging:true,
            canvasLeft:0,
            canvasTop:0,
            elementHeight:20,
            cameraControl: true,
            cameraDistance: (850/900)*window.innerWidth,
            cameraSpeed: 8,
            postProcessing:false,
            useLights:true
		
        },  options);
			
      
        if ( ! Detector.webgl ){ 
            $(this).prepend(Detector.getWebGLErrorMessage()); return false;
        }
        
        var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
        
     
       
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
        //var ctx = {};

        var VIEW_ANGLE = 30,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;
        var count = 0;
        var renderer = new THREE.AnaglyphWebGLRenderer();
      
        var camera = new THREE.Camera(  VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR  );
        var mouseX = 0;
        var mouseY = 0;
        var readyFuncs = [],
        callbackArray = [],
        renderArray = [],
        returnObj = {};
        var scene = new THREE.Scene();
        var animationReady = false;
        // scene.fog = new THREE.Fog( 0x000000, 1000, 3500 );
        var readyFunction = function(func){
            if (!animationReady){
                if (func) readyFuncs.push(func);  
            }
        };     



        // the camera starts at 0,0,0 so pull it back
        
        // camera.position.z = (850/900)*WIDTH;
        var cameraX = 0;
        var cameraY = 0;
        
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        
        var zHeight = opts.elementHeight;
        var zPosition = 1;
        var originalX = (WIDTH/2)+cameraX;
        var originalY = -(HEIGHT/2)+cameraY;
        /*
        var moveZ = opts.cameraDistance;
        camera.position.z = opts.cameraDistance;
        camera.position.x = originalX;
        camera.target.position.x = originalX;
        
        camera.position.y = originalY;
        camera.target.position.y = originalY;*/

        var cameraPosition = $('<div />').css({
            'position':'absolute',
            'top':originalY,
            'left':originalX,
            'margin':opts.cameraDistance
        });
 
        var cameraTarget = $('<div />').css({
            'position':'absolute',
            'top':-originalY,
            'left':originalX,
            'margin':0
        });
        

        // start the renderer
        renderer.setSize(WIDTH, HEIGHT);    
     
        var canvas = $(renderer.domElement).attr('width',WIDTH).attr('height',HEIGHT).css('position','fixed').css('left',0).css('top',0);
        $('body').append(canvas).click(function(){
            
            //   $(canvas).toggle('fast');
            });
        
        if (opts.cameraControl){
            $(document).bind( 'mousemove', function(event){            
                mouseX = ( event.clientX - windowHalfX );
                mouseY = ( event.clientY - windowHalfY );   
                cameraPosition.css('left',function(i,e){                       
                    return parseFloat(e)-( event.clientX - windowHalfX )/20;
                });
                cameraPosition.css('top',function(i,e){                       
                    return parseFloat(e)-( event.clientY - windowHalfY )/20;
                });
            });
        
            $(window).keydown(function(event){
            
                if (event.which==40){
                    cameraTarget.css('top',function(i,e){                       
                        return parseFloat(e)-opts.cameraSpeed;
                    });
                }else if(event.which==39){
                    cameraTarget.css('left',function(i,e){                       
                        return parseFloat(e)-opts.cameraSpeed;
                    });
                }else if(event.which==38){
                    cameraTarget.css('top',function(i,e){                       
                        return parseFloat(e)+opts.cameraSpeed;
                    });
                }else if(event.which==37){
                    cameraTarget.css('left',function(i,e){                       
                        return parseFloat(e)+opts.cameraSpeed;
                    });
                }else if(event.which==87){
                    cameraPosition.add(cameraTarget).css('top',function(i,e){                       
                        return parseFloat(e)-opts.cameraSpeed;
                    });
                }else if(event.which==83){
                    cameraPosition.add(cameraTarget).css('top',function(i,e){                       
                        return parseFloat(e)+opts.cameraSpeed;
                    });
                }else if(event.which==65){
                    cameraPosition.add(cameraTarget).css('left',function(i,e){                       
                        return parseFloat(e)-opts.cameraSpeed;
                    });
                }else if(event.which==68){
                    cameraPosition.add(cameraTarget).css('left',function(i,e){                       
                        return parseFloat(e)+opts.cameraSpeed;
                    });
                }
                
                
            //moveVertical +=moveVertical ;
            
            });
        }
        $(window).resize(function(){
            var newWidth =  window.innerWidth;
            var newHeight = window.innerHeight;

            windowHalfX = newWidth / 2;
            windowHalfY = newHeight / 2;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( newWidth, newHeight );
            
        });
        
        var ambient = new THREE.AmbientLight( 0x555555 );
        
        var pointLight = new THREE.PointLight( 0xFFFFFF );

        
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 80;

        
        
        var postprocessing = {
            enabled : true
        };
        var glow = 0.9;
    
    
        var pointLight2 = new THREE.PointLight( 0xFFFFFF );

        
        pointLight2.position.x = 0;
        pointLight2.position.y = 0;
        pointLight2.position.z = 1030;

        if (opts.useLights){
            scene.addLight(pointLight);
            scene.addLight( ambient );
            scene.addLight(pointLight2);
        }
			
        var imageLoaded;		
        var imagesLoaded = 0;	
        var images = [];	
        var el = $(this);
        var body = this;
        var used = false;
        
        
        function log(a){
            if (opts.logging && console.log){
                console.log(a);
            }
        }     
        
        
        searchImages(this);
        
        /*
        findImages(this,this);
           
        $.each(document.images,function(i,e){
            preloadImage($(e).attr('src'),body);
        });*/
      
        
        initPostprocessing();


        function start(){       
            if (images.length == 0 || imagesLoaded==images.length/2){    
                log('Started parsing');     
                for (var i=0;i<renderArray.length;) {
                    
                    parseElement(renderArray.splice(0,1)[0]);    
                    var callbackFunc = callbackArray.splice(0,1)[0];
                    if (typeof callbackFunc=="function"){
                        callbackFunc();
                    }
                    
                };
                                  
            }            
            
        }
        
        
        
        function animate() { 
            requestAnimationFrame( animate );
            render();          
        }
        
        function animationReadyFunction(){
            for (var i=0;i<readyFuncs.length;){
                readyFuncs.splice(0,1)[0]();
            }
            
        /*
            $.each(readyFuncs,function(i,func){
                func();
            });*/
        }
 
 
        function initPostprocessing() {
            if (opts.postProcessing){
                postprocessing.scene = new THREE.Scene();
 
                postprocessing.camera = new THREE.Camera();
                postprocessing.camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
                postprocessing.camera.position.z = 100;
 
                var pars = {
                    minFilter: THREE.LinearFilter, 
                    magFilter: THREE.LinearFilter, 
                    format: THREE.RGBFormat
                };
                postprocessing.rtTexture1 = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
                postprocessing.rtTexture2 = new THREE.WebGLRenderTarget( 512, 512, pars );
                postprocessing.rtTexture3 = new THREE.WebGLRenderTarget( 512, 512, pars );
 
                var screen_shader = THREE.ShaderUtils.lib["screen"];
                var screen_uniforms = THREE.UniformsUtils.clone( screen_shader.uniforms );
 
                screen_uniforms["tDiffuse"].texture = postprocessing.rtTexture1;
                screen_uniforms["opacity"].value = 1.0;
 
                postprocessing.materialScreen = new THREE.MeshShaderMaterial( {
 
                    uniforms: screen_uniforms,
                    vertexShader: screen_shader.vertexShader,
                    fragmentShader: screen_shader.fragmentShader,
                    blending: THREE.AdditiveBlending,
                    transparent: true
 
                } );
 
                var convolution_shader = THREE.ShaderUtils.lib["convolution"];
                var convolution_uniforms = THREE.UniformsUtils.clone( convolution_shader.uniforms );
 
                postprocessing.blurx = new THREE.Vector2( 0.001953125, 0.0 ),
                postprocessing.blury = new THREE.Vector2( 0.0, 0.001953125 );
 
                convolution_uniforms["tDiffuse"].texture = postprocessing.rtTexture1;
                convolution_uniforms["uImageIncrement"].value = postprocessing.blurx;
                convolution_uniforms["cKernel"].value = THREE.ShaderUtils.buildKernel( 4.0 );
 
                postprocessing.materialConvolution = new THREE.MeshShaderMaterial( {
 
                    uniforms: convolution_uniforms,
                    vertexShader:   "#define KERNEL_SIZE 25.0\n" + convolution_shader.vertexShader,
                    fragmentShader: "#define KERNEL_SIZE 25\n"   + convolution_shader.fragmentShader
 
                } );
 
                var film_shader = THREE.ShaderUtils.lib["film"];
                var film_uniforms = THREE.UniformsUtils.clone( film_shader.uniforms );
 
                film_uniforms["tDiffuse"].texture = postprocessing.rtTexture1;
 
                postprocessing.materialFilm = new THREE.MeshShaderMaterial( {
                    uniforms: film_uniforms, 
                    vertexShader: film_shader.vertexShader, 
                    fragmentShader: film_shader.fragmentShader
                } );
                postprocessing.materialFilm.uniforms.grayscale.value = 0;
                postprocessing.materialFilm.uniforms.nIntensity.value = 0.15;
                postprocessing.materialFilm.uniforms.sIntensity.value = 0.25;
                postprocessing.materialFilm.uniforms.sCount.value = 2048;
 
                //postprocessing.materialFilm.uniforms.nIntensity.value = 0;
                //postprocessing.materialFilm.uniforms.sIntensity.value = 0;
 
                postprocessing.materialScreen.uniforms.opacity.value = glow;
 
                postprocessing.quad = new THREE.Mesh( new THREE.Plane( window.innerWidth, window.innerHeight ), postprocessing.materialConvolution );
                postprocessing.quad.position.z = - 500;
                postprocessing.scene.addObject( postprocessing.quad );
            }
        }
        
        
        
        
        function render() {
            /*  if (opts.cameraControl){
                camera.position.x += ( mouseX - camera.position.x ) * .05  + moveHorizontal;
                camera.position.y += ( - ( mouseY - 200) - camera.position.y ) * .05 + moveVertical;
 
                camera.position.z += moveZ;
                camera.target.position.z += moveZ;
                moveZ = 0;
            }else{*/
            pointLight.position.x = parseFloat(cameraPosition[0].style.left);
            pointLight.position.y = -parseFloat(cameraPosition[0].style.top);
           
            /*
            pointLight.target.position.x = parseFloat(cameraPosition[0].style.left);
            pointLight.target.position.y = -parseFloat(cameraPosition[0].style.top);
             */
            camera.position.x = parseFloat(cameraPosition[0].style.left);
            camera.position.y = -parseFloat(cameraPosition[0].style.top);
            camera.position.z = parseFloat(cameraPosition[0].style.margin);
                
            camera.target.position.x = parseFloat(cameraTarget[0].style.left);
            camera.target.position.y = -parseFloat(cameraTarget[0].style.top);
            camera.target.position.z = parseFloat(cameraTarget[0].style.margin);
            //  }
            renderer.clear();
          
            if (!animationReady){
                animationReady = true;
                animationReadyFunction();
            }
            
            if(opts.postProcessing && returnObj.postProcessing){
                
                renderer.clear();
 
                // Render scene into texture

                renderer.render( scene, camera, postprocessing.rtTexture1, true );
                /*
                // Render quad with blured scene into texture (convolution pass 1)
 
                postprocessing.quad.materials[ 0 ] = postprocessing.materialConvolution;
 
                postprocessing.materialConvolution.uniforms.tDiffuse.texture = postprocessing.rtTexture1;
                postprocessing.materialConvolution.uniforms.uImageIncrement.value = postprocessing.blurx;
 
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTexture2, true );
 
                // Render quad with blured scene into texture (convolution pass 2)
 
                postprocessing.materialConvolution.uniforms.tDiffuse.texture = postprocessing.rtTexture2;
                postprocessing.materialConvolution.uniforms.uImageIncrement.value = postprocessing.blury;
 
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTexture3, true );
 
                // Render original scene with superimposed blur to texture
 

                postprocessing.quad.materials[ 0 ] = postprocessing.materialScreen;
 
                postprocessing.materialScreen.uniforms.tDiffuse.texture = postprocessing.rtTexture3;
 
                renderer.render( postprocessing.scene, postprocessing.camera, postprocessing.rtTexture1, false );*/
 
                // Render to screen
 
                postprocessing.materialFilm.uniforms.time.value += 0.01;
                postprocessing.quad.materials[ 0 ] = postprocessing.materialFilm;
 
                postprocessing.materialScreen.uniforms.tDiffuse.texture = postprocessing.rtTexture1;
                renderer.render( postprocessing.scene, postprocessing.camera );
            }else{
                renderer.render( scene, camera );
            }
 
 
 
        }
        
        function preloadImage(src){
            
            if (images.indexOf(src)==-1){
                images.push(src);
                   
                var img = new Image();   
                $(img).load(function(){
                    imagesLoaded++;
                    start();
                    
                });	
                img.onerror = function(){
                    images.splice(images.indexOf(img.src),2);
                    imagesLoaded++;
                    start();                           
                }
                img.src = src; 
                images.push(img);
                  
            }     
          
        }
        
        function findImages(el,parseStart){
              
            $(el).contents().each(function(i,element){              
                findImages(element,parseStart);
            });       
            
            
            if (el.nodeType==1 || typeof el.nodeType == "undefined"){
                var background_image = $(el).css('background-image');
                if (background_image && background_image != "1" && background_image != "none"){
                    var src = backgroundImageUrl(background_image);
                     
                    preloadImage(src,parseStart);
                    
                }
            }
        }            
        
        function parsing(el,parentTexture,textureEl){


            var currentZ = zPosition;		
            
            var texture = newElement2(el,textureEl,parentTexture);
            if (!texture){
                if (parentTexture){
                    texture =  parentTexture;
                }else{
                    var imageCanvas = document.createElement( "canvas" );
                    texture = imageCanvas.getContext( "2d" );  
                    log('i am lost now');
                }
                
                             
            }else{
                textureEl = el;
            }
            
            if (!textureEl){
                
                textureEl = el;
            }
            
            			
            if (el.nodeName!="IFRAME"){
                if ($(el).contents().length == 1){
                    //console.log($(el).contents());
					
                    if ($(el).contents()[0].nodeType==1){
                        parsing($(el).contents()[0],texture,textureEl);
                    }else{                   

                        newText2(el,$(el).contents()[0],texture,textureEl);
                    }
                }else{
						
                    $(el).contents().each(function(cid,cel){
					
                        if (cel.nodeType==1){
                            // element
                            parsing(cel,texture,textureEl);								
                        }else if (cel.nodeType==3){        
                        
                            newText2(el,cel,texture,textureEl);								
                        }              
						
                    });
                }
            }	
            $(el).data('zPosition',currentZ);	
            zPosition = currentZ;
        }
			
			
        function parseElement(element){
           
            var texture = newElement2(element);
            $(element).children().each(function(index,el){
		
                parsing(el,texture,element);
										
            });
            finish();
        }
		
        function backgroundImageUrl(src){
            if (src.substr(0,5)=='url("'){
                src = src.substr(5);
                src = src.substr(0,src.length-2);                 
            }else{
                src = src.substr(4);
                src = src.substr(0,src.length-1);  
            }
            return src;            
        }        
        function loadImage(src){
           
            
	
            var imgIndex = images.indexOf(src);
            if (imgIndex!=-1){
                return images[imgIndex+1];
            }else{
                return false;
            }
           
            
				
        }
			
        function newElement(els,callbackFunc){
            
            var parent = $(els).parent();
            
            zPosition = parent.data('zPosition');
            //el = parent[0];
            searchImages(els[0],callbackFunc);
        //  animationReady=true;
        /*
            findImages(els[0],els[0]);
            $.each(document.images,function(i,e){
                preloadImage($(e).attr('src'),els[0]);
            });*/
        //   parsing(el[0]);
            
        }

        function newElement2(el,textureEl,parentTexture){
            
		
            if (el.getBoundingClientRect){	
                var bounds = el.getBoundingClientRect();		
	
                var x = bounds.left;
                var y = bounds.top;
                var w = bounds.width;
                var h = bounds.height;
            }else{
                var p = $(el).offset();
                var x = p.left +  parseInt($(el).css('border-left-width'));
                var y =  p.top +   parseInt($(el).css('border-top-width'));
                var w = $(el).innerWidth();
                var h = $(el).innerHeight();
            }
           
            var bgcolor = $(el).css('background-color');
            var background_image = $(el).css('background-image');
            var background_repeat = $(el).css('background-repeat');
            var background_position = $(el).css('background-position');
	
            var borders = getBorderData(el);
            
            zPosition++;
             
            $.each(borders,function(borderSide,borderData){
                if (borderData.width>0){
                    var s1 = x-borders[3].width,
                    s2 = y,
                    s3 = w+borders[3].width+borders[1].width,
                    s4 = h;
                    switch(borderSide){
                        case 0:
                            s2 = s2-borders[0].width;
                            s4 = borders[0].width;
                            break;
                        case 1:
                            s1 = x+w;
                            s3 = borders[1].width;                              
                            break;
                        case 2:
                            s2 = s2+h;
                            s4 = borders[2].width;
                            break;
                        case 3:
                            s3 = borders[3].width;  
                            break;
                    }		
                   
                    var borderMaterial = newRect(s1,s2,s3,s4,borderData.color,null,null,null,null,true);	
                    var sides = ['top','right','bottom','left'];
                    
                    $(el).data('border-'+sides[borderSide],borderMaterial);
                    if(textureEl && isTransparent(bgcolor)) bgcolor = $(textureEl).css('background-color');
                }
                
            });
         
                            
            /*
            if(textureEl && el.nodeName.match(/(a|h1|h2|p)/gi)){
            //    console.log(el.nodeName);
               
                bgcolor = $(textureEl).css('background-color');	
                if (isTransparent(bgcolor)){
                    $(textureEl).parents().each(function(){
                        if (!isTransparent($(this).css('background-color'))){
                            bgcolor = $(this).css('background-color');
                            return false;
                        }
                        
                    });
                }
             //   console.log(bgcolor);
            } */
                            
            if(el && el.nodeName=="IMG"){	
                 
                zPosition--;
            }else{
                
                var imageCanvas = newRect(x,y,w,h,bgcolor,parentTexture,textureEl,el,true);	
                if (isTransparent(bgcolor)){
                 
                    if (!(el && el.nodeName && el.nodeName.match(/(a|h1|h2|p)/gi))){
                    
                        zPosition--;
                   
                    }
            
                }		
            }
            
           
                
           
            
            
            if (background_image && background_image != "1" && background_image != "none"){
                
   
            
                background_image = backgroundImageUrl(background_image);
                var image = loadImage(background_image);
					
                var bgposition = background_position.split(" ");
                var background_position_left = parseInt(bgposition[0]);
                var background_position_top = parseInt(bgposition[1]);
				


                if (image){
                
                    switch(background_repeat){
					
                        case "repeat-x":
                         
                            if (imageCanvas){
                                var texture = imageCanvas.getContext( "2d" );
                                repeatX(texture,image,w,h,x,y,background_position_left,background_position_top);     
                            }else{        
                                // zPosition++;
                                var imageCanvas = createCanvas(w,image.height);
                                var texture = imageCanvas.getContext( "2d" );
                            
                                repeatX(texture,image,w,h,x,y,background_position_left,background_position_top);
                                
                                var material = canvasTexture(imageCanvas);
                                zPosition++;
                                addCube(material,x,y,w,image.height);
 
                                
                            }
                        
                            return texture;   
                                
                            break;
                            
                        case "repeat-y":
                            
                            if (imageCanvas){
                                var texture = imageCanvas.getContext( "2d" );
                                repeatY(texture,image,w,h,x,y,background_position_left,background_position_top);     
                            }else{        
                                // zPosition++;
                                var imageCanvas = createCanvas(image.width,h);
                                var texture = imageCanvas.getContext( "2d" );
                            
                                repeatY(texture,image,w,h,x,y,background_position_left,background_position_top);
                                
                                var material = canvasTexture(imageCanvas);
                                zPosition++;
                                addCube(material,x,y,image.width,h);
 
                                
                            }
                            
                      
                            return texture;  
                           
                            break;
                            
                        case "no-repeat":
                         
                            if (imageCanvas){
                                var texture = imageCanvas.getContext( "2d" );
                                texture.drawImage(image,(background_position_left),(background_position_top));     
                            }else{        
                       
                                var imageCanvas = newCanvas(image,(background_position_left),(background_position_top));
                                var texture = imageCanvas.getContext( "2d" );
                                
                                var material = canvasTexture(imageCanvas);
                                zPosition++;
                                addCube(material,x,y,image.width,image.height);
 
                                
                            }
                            return texture;    
                                
                                
                            break;
					
                    }	
                }else{
                    
                    log("Error loading background:" + background_image);
                
                }
					
            }
            
            
            if (el.nodeName=="IMG"){
                image = loadImage($(el).attr('src'));
                if (image){
                     
                    zPosition++;
                         
                    
                    var imageCanvas = newCanvas(image,0,0);

                    var material = canvasTexture(imageCanvas);
                  
                    var model = addCube(material,x,y,w,h);
                    $(el).data({
                        texture:material,
                        model:model
                    });
                    zPosition--;
                    
              
                }
                else{
                    log("Error loading <img>:" + $(el).attr('src'));
                }
            }
            if (imageCanvas) return imageCanvas.getContext( "2d" );
            
            
			
				
        }

        function toHex(color){
            
            var digits = /(.*?)rgba?\((\d+), (\d+), (\d+)(, (\d+))?\)/.exec(color);
    
            var red = parseInt(digits[2]);
            var green = parseInt(digits[3]);
            var blue = parseInt(digits[4]);
            var rgb = blue | (green << 8) | (red << 16);
            return "0x"+rgb.toString(16);
        }
        
        function canvasTexture(imageCanvas){
            var textureMaterial = new THREE.Texture( imageCanvas);                 

            var material = new THREE.MeshLambertMaterial( {
                map: textureMaterial
            } );
            material.map.needsUpdate = true;   
            return material;
        }       
       
        function createCanvas(width,height){
            var imageCanvas = document.createElement( "canvas" );
            imageCanvas.width = width;
            imageCanvas.height = height;
            return imageCanvas;
        }
       
        function newCanvas(image,x,y,width,height){
                   
            if (!width){
                width = image.width;
            }
            
            if (!height){
                height = image.height;
            }  
            var imageCanvas = createCanvas(width,height);

            var texture = imageCanvas.getContext( "2d" );
            texture.drawImage(image,x,y); 
            return imageCanvas;
        }
        
        function addMesh(mesh,x,y,w,h,addZ){
            if (!addZ) addZ = 0;
            mesh.position.x = (x)+(w/2);
            mesh.position.y = -(y+(h/2));
            mesh.position.z = (zHeight*zPosition)+addZ;
            mesh.overdraw = true;
            scene.addObject( mesh );
        }
        
        function addPlane(material,x,y,w,h,addZ){
            var plane = new THREE.Plane( w, h,4,4 ); 
            var mesh = new THREE.Mesh( plane, material );
            addMesh(mesh,x,y,w,h,addZ);  
        }
        
        function addCube(material,x,y,w,h){
            var mesh = new THREE.Mesh( new THREE.Cube( w, h, zHeight), material );
            addMesh(mesh,x,y,w,h);       
            return mesh;
        }
			
        function newRect(x,y,w,h,bgcolor,parentTexture,textureEl,el,assignElement,returnMaterial){
    
            if (!isTransparent(bgcolor)){
                if (el && $(el).get(0).nodeName == "BODY"){
                    h = $(document).height();
                }

                var imageCanvas = createCanvas(w,h);
                var texture = imageCanvas.getContext( "2d" );
               

                texture.fillStyle = bgcolor;
                texture.fillRect( 0, 0, w, h );
               
               
                
                var material = canvasTexture(imageCanvas);
             
            }else if(el && el.nodeName &&  el.nodeName.match(/(a|h1|h2|p)/gi)){
                
                var imageCanvas = createCanvas(w,h);
             
                var textureMaterial = new THREE.Texture( imageCanvas); 
                 
                var material = new  THREE.MeshLambertMaterial( {
                    map: textureMaterial,
                    transparent:true
                });
                
                material.map.needsUpdate = true;   
                
        
                
            }
                 
            if (material)   {                
                var model = addCube(material,x,y,w,h);
                if (assignElement){
                    
                    $(el).data(
                    {
                        'texture':material,
                        'model':model
                    });
                    
                }
                if (returnMaterial){
                    return model;
                }else{
                    if (imageCanvas)    return imageCanvas; 
                }
            }
            

        }
			
        function repeatX(texture,image,w,h,x,y,background_position_left,background_position_top){
            for(var bgx=(background_position_left);bgx<=w+x;){   
                if ( Math.floor(bgx+image.width)>w+x){
                    texture.drawImage(image,bgx,(background_position_top),(w+x)-bgx,Math.min(image.height,h));   
                }else{                                  
                    texture.drawImage(image,bgx,(background_position_top));   
                }
                                
                bgx = Math.floor(bgx+image.width); 
                               
            } 
            
        }	
        function repeatY(texture,image,w,h,x,y,background_position_left,background_position_top){
                     
            for(var bgy=(y+background_position_top);bgy<=h+y;){     
                if ( Math.floor(bgy+image.height)>h+y){
                    texture.drawImage(image,(x+background_position_left),bgy,Math.min(image.width,w),(h+y)-bgy);   
                }else{                                  
                    texture.drawImage(image,(x+background_position_left),bgy); 
                }
                                
                bgy = Math.floor(bgy+image.height); 
                               
            } 
                            
        }
        
        function rangeBounds(textNode){
            var range = document.createRange();
            range.selectNode(textNode);
            if (range.getBoundingClientRect()){
                return range.getBoundingClientRect();
            }else{
                return {};
            }   
        }

        
        function newText2(el,textNode,ctx,textureEl){
          
            var family = $(el).css('font-family');
            var size = $(el).css('font-size');
            var color = $(el).css('color');
            var text = $.trim($(el).text());
            var bold = $(el).css('font-weight');
            var font_style = $(el).css('font-style');
            var lineheight =  parseInt($(el).css('line-height'));
            var maxwidth =  $(el).width();
            var text_transform = $(el).css('text-transform');
            var text_decoration = $(el).css('text-decoration');
            var text = textNode.nodeValue;                   
		
				
            switch(text_transform){
                case "lowercase":
                    textNode.nodeValue = text.toLowerCase();
                    break;
					
                case "capitalize":
                    textNode.nodeValue = text.replace( /(^|\s)([a-z])/g , function(m,p1,p2){
                        return p1+p2.toUpperCase();
                    } );
                    break;
					
                case "uppercase":
                    textNode.nodeValue = text.toUpperCase();
                    break;
				
            }
			
			
            //text = $.trim(text);
            if (text.length>0){
                switch(bold){
                    case "401":
                        bold = "bold";
                        break;
                }

                ctx.font = bold+" "+font_style+" "+size+" "+family;
                ctx.fillStyle = color;
                ctx.textBaseline = "bottom";
		
                if (textureEl[0] && textureEl[0].nodeName == "BODY"){
                    // console.log($(textureEl).width());
                    var x = 0;
                    var y = 0;
                    var w = $(textureEl).width();
                    var h = $(textureEl).width();  
                }else{
                    var elbounds = textureEl.getBoundingClientRect();		
	
                    var x = elbounds.left;
                    var y = elbounds.top;
                    var w = elbounds.width;
                    var h = elbounds.height;
                }
                
                
                var tbounds = rangeBounds(textNode);
               
                w = tbounds.width;
                h = tbounds.height;

                var oldTextNode = textNode;
                
                for(var c=0;c<text.length;c++){
                    var newTextNode = oldTextNode.splitText(1);
  
                 
                    var bounds = rangeBounds(oldTextNode);
               
                    var newx,newy,maxh = 0,maxw = 0;
                    
                    if ($.trim(oldTextNode.nodeValue).length>0){	
                        newx = bounds.left-x;
                        newy = bounds.bottom-y;
                        ctx.fillText(oldTextNode.nodeValue,newx,newy);
                    }     
                 
                    if (text_decoration=="underline"){	
                        //zPosition++;
                        newRect(bounds.left,bounds.bottom,bounds.width,2,color);                        
                    // zPosition--;
                    }	
                    oldTextNode = newTextNode;
                 
                }
					
            }
			
        }
        
        function getBorderData(el){
     
            var borders = [];
            $.each(["top","right","bottom","left"],function(i,borderSide){
                borders.push({
                    width: parseInt($(el).css('border-'+borderSide+'-width')),
                    color: $(el).css('border-'+borderSide+'-color')
                });
            });
            
            return borders;
            
        }
        
        function isTransparent(bgcolor){
            return (bgcolor=="transparent" || bgcolor.substring(0,4) == "rgba");
        }
        
        function searchImages(els,callbackFunc){
            findImages(els);
            renderArray.push(els);
            callbackArray.push(callbackFunc);
            $.each(document.images,function(i,e){
                preloadImage($(e).attr('src'));
            });
            if (images.length == 0){
                start();
            }
        }
        
        
   
        
        function finish(){
            log("Finished");
            
            window.setTimeout(function(){
                canvas.appendTo($('body'));
                animate();
               
                
            },1000);
            
            
        }
        
        
        // var a = $("p").position();
        log("Reached the end");
        returnObj = {
            "canvas":canvas,
            "cameraPosition":cameraPosition,
            "cameraTarget":cameraTarget,
            "camera":cameraPosition.add(cameraTarget),
            "ready":readyFunction,
            "light":pointLight,
            "addElement":newElement,
            "scene":scene,
            "postProcessing":true
            
            
        }
        return returnObj;

			
			
    }
		
    $.fn.origin = function() {
        var pos = $(this).position();
       
        return {
            left:pos.left+($(this).width()/2)+parseFloat($(this).css('border-left-width')),
            top:pos.top+($(this).height()/2)+parseFloat($(this).css('border-top-width'))
        }
    // Do your awesome plugin stuff here

    };
})(jQuery);
			
			
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

	canvas : !! window.CanvasRenderingContext2D,
	webgl : ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers : !! window.Worker,
	fileapi : window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage : function () {

		var domElement = document.createElement( 'div' );

		domElement.style.fontFamily = 'monospace';
		domElement.style.fontSize = '13px';
		domElement.style.textAlign = 'center';
		domElement.style.background = 'red';
		domElement.style.color = '#000';
		domElement.style.padding = '1em';
		domElement.style.width = '475px';
		domElement.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			domElement.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' );

		}

		return domElement;

	},

	addGetWebGLMessage : function ( parameters ) {

		var parent, id, domElement;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		domElement = Detector.getWebGLErrorMessage();
		domElement.id = id;

		parent.appendChild( domElement );

	}

};
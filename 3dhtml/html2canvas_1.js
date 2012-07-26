(function($) {
    $.fn.html2canvas = function(options) {
        var opts = $.extend({
            account:'niklasvh87',
            interval:50000,
            yql:"http://query.yahooapis.com/v1/public/yql",
            lag:60000, // milliseconds
            logging:false,
            linkMore:true,
            renderLetterSpacing:true,
            canvasLeft:5,
            canvasTop:5
		
        }, $.fn.html2canvas.defaults, options);
			
        var bodyLeft = parseInt($(this).css('margin-left'));
        var bodyTop = parseInt($(this).css('margin-top'));
        var canvas = $('<canvas />').attr('width',$(this).width()+100).attr('height',$(this).height()+100).css('position','absolute').css('left',opts.canvasLeft).css('top',opts.canvasTop);
			
        $(this).click(function(){
            $(canvas).toggle();
        });
			
        var ctx = canvas[0].getContext('2d');
			
			
		
		
        var el = $(this);
        var p = $(el).offset();
        
        newElement(
            p.left +  parseInt($(el).css('border-left-width')),
            p.top +   parseInt($(el).css('border-top-width')),
            $(el).innerWidth(),
            $(el).innerHeight(),
            $(el).css('background-color'),
            $(el).css('background-image'),
            $(el).css('background-repeat'),
            $(el).css('background-position'),
							
            parseInt($(el).css('border-top-width')),
            $(el).css('border-top-color'),
            parseInt($(el).css('border-right-width')),
            $(el).css('border-right-color'),
            parseInt($(el).css('border-bottom-width')),
            $(el).css('border-bottom-color'),
            parseInt($(el).css('border-left-width')),
            $(el).css('border-left-color')
								
            );
		
        parseElement($(this));
				
			
        function parsing(el){
            var p = $(el).offset();
					
            newElement(
                p.left  + parseInt($(el).css('border-left-width')),
                p.top + parseInt($(el).css('border-top-width')),
                $(el).innerWidth(),
                $(el).innerHeight(),
                $(el).css('background-color'),
                $(el).css('background-image'),
                $(el).css('background-repeat'),
                $(el).css('background-position'),
							
                parseInt($(el).css('border-top-width')),
                $(el).css('border-top-color'),
                parseInt($(el).css('border-right-width')),
                $(el).css('border-right-color'),
                parseInt($(el).css('border-bottom-width')),
                $(el).css('border-bottom-color'),
                parseInt($(el).css('border-left-width')),
                $(el).css('border-left-color')
								
                );
							
            var textLeft = p.left + parseInt($(el).css('padding-left')) +  parseInt($(el).css('border-left-width'));
            if ($(el).css('text-align')=="right"){
                textLeft = p.left + parseInt($(el).css('border-left-width')) + parseInt($(el).css('padding-right')) + $(el).width();
            }
            var startLeft = null;
            var startTop = null;
		
            /*if (el.nodeName == "A"){
						var textTop = p.top +  parseInt($(el).css('border-top-width'));
					}else{
					*/
            var textTop = p.top + parseInt($(el).css('padding-top')) +  parseInt($(el).css('border-top-width'));
            //}
            if ($(el).contents().length == 1){
                //console.log($(el).contents());
					
                if ($(el).contents()[0].nodeType==1){
                    parsing($(el).contents()[0]);
                }else{
                    newText(
                        textLeft,
                        textTop,
                        $(el).css('text-align'),
                        $(el).css('font-family'),
                        $(el).css('font-size'),
                        $(el).css('color'),
                        $.trim($(el).text()),
                        $(el).css('font-weight'),
                        $(el).css('font-style'),
                        parseInt($(el).css('letter-spacing')),
                        parseInt($(el).css('line-height')),
                        $(el).width(),
                        $(el).css('text-transform'),
                        $(el).css('text-decoration')
                        );
                }
            }else{
				
						
                $(el).contents().each(function(cid,cel){
						
                    var np = $(cel).offset();
							
						
                    if (cel.nodeType==1){
                        // element
                        parsing(cel);
                        textTop = np.top;
                        startLeft = (np.left+$(cel).width()
                            +parseInt($(cel).css('padding-right'))
                            +parseInt($(cel).css('padding-left'))
                            +parseInt($(cel).parent().css('margin-left')))
                        -textLeft;
								
                    }else if (cel.nodeType==3){
							
							
                        var printText = $(cel).text();
							
                        if (cid==0){
							
                            printText = $.trim(printText);
                        }
							
                        newText(
                            textLeft,
                            textTop,
                            $(el).css('text-align'),
                            $(el).css('font-family'),
                            $(el).css('font-size'),
                            $(el).css('color'),
                            printText,
                            $(el).css('font-weight'),
                            $(el).css('font-style'),
                            parseInt($(el).css('letter-spacing')),
                            parseInt($(el).css('line-height')),
                            $(el).width(),
                            $(el).css('text-transform'),
                            $(el).css('text-decoration'),
                            startLeft
								
                            );
							
								
                    }
                //alert(cel.nodeType);
						
                });
            }
				
        }
			
			
        function parseElement(element){
            $(element).children().each(function(index,el){
				
                parsing(el);
										
            });
        }
			
        function loadImage(src,stripUrl){
				
            if (opts.logging){
                console.log("Loading image "+src);
            }
            src = src.substr(5);
            src = src.substr(0,src.length-2);
	
            var img = new Image();   
					
            img.src = src; 
            return img;
				
        }
			
        function drawImage(img,x,y){
            if (opts.logging){
                console.log("Drawing image x:"+x+" y:"+y+" "+img.src);
            }
            ctx.drawImage(img,x,y);
        }
			
        function newElement(x,y,w,h,
            bgcolor,
            background_image,
            background_repeat,
            background_position,
			
            border_top_width,
            border_top_color,
            border_right_width,
            border_right_color,
            border_bottom_width,
            border_bottom_color,
            border_left_width,
            border_left_color){
				
		
			
			
			
            if (border_top_width>0){
                if (opts.logging){
                    console.log('Border-right:');
                }				
                newRect(x-border_left_width,
                    y-border_top_width,
                    w+border_left_width+border_right_width,
                    border_top_width,
                    border_top_color);					
            }


            if (border_left_width>0){		
                if (opts.logging){
                    console.log('Border-right:');
                }
                newRect(x-border_left_width,
                    y,
                    border_left_width,
                    h,
                    border_left_color);					
            }

            if (border_right_width>0){	
                if (opts.logging){
                    console.log('Border-right:');
                }
                newRect(x+w,
                    y,
                    border_right_width,
                    h,
                    border_right_color);					
            }
				
				
            if (border_bottom_width>0){	
                if (opts.logging){
                    console.log('Border-right:');
                }				
                newRect(x-border_left_width,
                    y+h,
                    w+border_left_width+border_right_width,
                    border_bottom_width,
                    border_bottom_color);					
            }
				
				
            newRect(x,y,w,h,bgcolor);
           
            
            if (background_image && background_image != "1" && background_image != "none"){
                image = loadImage(background_image);
					
                var bgposition = background_position.split(" ");
                var background_position_left = parseInt(bgposition[0]);
                var background_position_top = parseInt(bgposition[1]);
				
                switch(background_repeat){
					
                    case "repeat-x":
                        
                        for(bgx=(x+background_position_left);bgx<=w;){
                            drawImage(image,bgx,(y+background_position_top));
                            bgx = bgx+image.width;
                        }
                        break;
                    case "no-repeat":
                        drawImage(image,(x+background_position_left),(y+background_position_top));
							
                        break;
					
                }	 
					
            }
			
				
        }
			
        function newRect(x,y,w,h,bgcolor){
            if (bgcolor!="transparent"){
                if (opts.logging){
                    console.log('Drawing rectangle x:'+x+' y:'+y+' w:'+w+' h:'+h+' color:'+bgcolor);
                }
                ctx.fillStyle = bgcolor;
                ctx.fillRect (x, y, w, h);
            }
        }
			
        function newLine(x1,y1,x2,y2,width,color){
			
				
        //	context.strokeStyle = color;
        //context.lineWidth   = width;
        }
			
        function printText(currentText,x,y,letter_spacing,text_decoration,color,lineheight){
					
            if ($.trim(currentText).length>0){
				
                if (letter_spacing!=0 && opts.renderLetterSpacing){
                    //loop each character... and print them individually while applying letter-spacing
                    if (opts.logging){
                        console.log('Printing text x:'+(x)+' y:'+(y)+' ls:'+letter_spacing+' ('+currentText.length+'): '+currentText);
                    }
						
                    for(letter=0;currentText.length>=letter;letter++){
						
                        var measure = ctx.measureText(currentText.substr(letter,1));
							
                        ctx.fillText(currentText.substr(letter,1),x+letter_spacing,y);
						
                        if (text_decoration=="underline"){
						
                            newRect(x,y,x+measure.width+letter_spacing,y+1);
                        }
                        x = x+measure.width+letter_spacing;
							
                    }
                }else{		
					
                    if (opts.logging){				
                        //console.log(ctx.font);
                        console.log('Printing text x:'+(x)+' y:'+(y)+' ('+currentText.length+'): '+currentText);
                    }			

                    if (text_decoration=="underline"){		
                        var measure = ctx.measureText(currentText);									
                        newRect(x,y+(lineheight/4),measure.width,1,color);
                    }						
                    ctx.fillText(currentText,x,y);
                }
            }
			
        }
			
        function newText(x,y,
            align,
            family,
            size,
            color,
            text,
            bold,
            font_style,
            letter_spacing,
            lineheight,
            maxwidth,
            text_transform,
            text_decoration,
            startLeft){
							
            if (isNaN(letter_spacing)){
                letter_spacing = 0;
            }
				
				
            switch(text_transform){
                case "lowercase":
                    text = text.toLowerCase();
                    break;
					
                case "capitalize":
                    text = text.replace( /(^|\s)([a-z])/g , function(m,p1,p2){
                        return p1+p2.toUpperCase();
                    } );
                    break;
					
                case "uppercase":
                    text = text.toUpperCase();
                    break;
				
            }
			
			
            //text = $.trim(text);
            if (text.length>0){
                switch(bold){
                    case "401":
                        bold = "bold";
                        break;
                }
					
                // no canvas support for justify
                if (align == "justify"){
                    align = "center";
                }
					
                // ... and have not added support for center yet
                if (align == "center"){
                    align = "left";
                }
					
                var currentLength = 0;
					
                if (typeof startLeft == "undefined" || startLeft == null ){
                    startLeft = 0;
                }
					
                var currentText = "";

                ctx.font = bold+" "+font_style+" "+size+" "+family;
                ctx.textAlign = align;
                ctx.fillStyle = color;
                ctx.textBaseline = "middle";
					
					
                var words = text.split(" ");
                if (words.length > 1){
					
                    $.each(words,function(wordIndex,word){
						
                        var measure = ctx.measureText(currentText+" "+word);
							
                        // apply letter-spacing fix
                        if (letter_spacing!=0){
                            measure_width = measure.width+((currentText+" "+word).length*letter_spacing);
                        }else{
                            measure_width = measure.width;
                        }
							
                        if (startLeft+measure_width<=maxwidth){
								
                            if (currentText.length > 0){
                                currentText = currentText+" "+word;
                            }else{
                                currentText = word;
                            }
								
								
								
                        }else{
											
                            printText(currentText,(startLeft+x),y+lineheight/2,letter_spacing,text_decoration,color,lineheight);
							
                            currentText = word;
                            y = y + lineheight;
                            startLeft = 0;
                        }
							
                    });

                    printText(currentText,x+startLeft,y+lineheight/2,letter_spacing,text_decoration,color,lineheight);

						
                }else{
                    printText(text,(x+startLeft),(y+lineheight/2),letter_spacing,text_decoration,color,lineheight);
                }
					

					
            }
			
        }
			
        var a = $("p").position();
			
        canvas.appendTo($(this));
    /*
			$.getJSON(opts.yql+"?callback=?",
				{
					q :"select * from html where url='http://finance.yahoo.com/q?s=yhoo'",
					format:"json"
				},
				function(data) {
				
					parseElement(data['query']['results']);
					
				
				});
		
			function parseElement(el){
				$.each(el, function(element){
						alert(element);
				});
			
			}
			*/
			
			
    }
		
			
})(jQuery);
			
			
$.fn.extend({
    immediateText: function() {
        return this.clone().find("*").remove().end().text();
    }
});			
	
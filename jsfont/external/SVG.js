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
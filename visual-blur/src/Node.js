PathFinding.Node = function(x, y){
    this.x = x;
    this.y = y;
    this.vertices = [];
    
    return this;  
};


PathFinding.Node.prototype.addVertex = function(dest, cost, oneWay){
    
    /*
    if (this.x === dest.x || this.y === dest.y){
        var cost = Math.abs(this.x-dest.x) + Math.abs(this.y-dest.y);
    }*/
    
    var vertex = new PathFinding.Vertex(dest, cost);
    this.vertices.push(vertex);        
    if (oneWay === undefined || oneWay === false){
        var vertex2 = new PathFinding.Vertex(this);
        dest.vertices.push(vertex2);       
    }

    return vertex;
    
};


/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 31.8.2011 
 * @website http://hertzen.com
 */


PathFinding = function(){
    this.nodes = [];
    
    this.nodeCounter = 0;
    
    /*
 function A*(start,goal)
     closedset := the empty set    // The set of nodes already evaluated.
     openset := {start}    // The set of tentative nodes to be evaluated, initially containing the start node
     came_from := the empty map    // The map of navigated nodes.
 
     g_score[start] := 0    // Cost from start along best known path.
     h_score[start] := heuristic_cost_estimate(start, goal)
     f_score[start] := h_score[start]    // Estimated total cost from start to goal through y.
 
     while openset is not empty
         x := the node in openset having the lowest f_score[] value
         if x = goal
             return reconstruct_path(came_from, came_from[goal])
 
         remove x from openset
         add x to closedset
         foreach y in neighbor_nodes(x)
             if y in closedset
                 continue
             tentative_g_score := g_score[x] + dist_between(x,y)
 
             if y not in openset
                 add y to openset
                 tentative_is_better := true
             else if tentative_g_score < g_score[y]
                 tentative_is_better := true
             else
                 tentative_is_better := false
 
             if tentative_is_better = true
                 came_from[y] := x
                 g_score[y] := tentative_g_score
                 h_score[y] := heuristic_cost_estimate(y, goal)
                 f_score[y] := g_score[y] + h_score[y]
 
     return failure
 
 function reconstruct_path(came_from, current_node)
     if came_from[current_node] is set
         p = reconstruct_path(came_from, came_from[current_node])
         return (p + current_node)
     else
         return


     */
    
    return this;
};



PathFinding.prototype.addNode = function(x, y){
    
   
    var  node = new PathFinding.Node(x, y);
    node.id = this.nodeCounter++;
    this.nodes.push(node);
    return node;
    
};





PathFinding.Vertex = function(dest, cost) {
  
    this.cost = cost || 1;
    this.dest = dest;
    
};


PathFinding.prototype.Solver = function(from, to, solver){
    
    if (solver === undefined){
        solver = "astar";
    }
    
    switch(solver.toLowerCase()){
        case "astar":
            /*
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            window.URL = window.URL || window.webkitURL;
            var bb = new BlobBuilder();
            bb.append("onmessage = function(e) { var func = ");
            
            bb.append(PathFinding.prototype.AStarSolver);
            bb.append("; self.postMessage(func(e.data.from,e.data.to)) }");
            var worker = new Worker(window.URL.createObjectURL(bb.getBlob()));
            
            worker.postMessage({'from': from, 'to': to});
            */
           
            return this.AStarSolver(from, to);
            break;
        default:
            alert("Unknown solver "+solver);
    }
    
};

PathFinding.prototype.AStarSolver = function(from, to){
    var closedset = []; // The set of nodes already evaluated.
    var openset = []; // The set of tentative nodes to be evaluated, initially containing the start node
    var came_from = []; // The map of navigated nodes.
    var goal = to;
    
    openset.push(from);
    /*
    var neighbor_nodes = function(node){
        return node.vertices;
    };*/
    var route = [];
    var reconstruct_path = function(fromNode){
        /*
        if (came_from[current_node] !== undefined){
            var p = reconstruct_path(came_from, came_from[current_node]);
            return (p + current_node);
        } else{
            return current_node;
        }*/
        if (fromNode !== from){
            route.push(fromNode);
            reconstruct_path(came_from[fromNode.id]);
        }else{
            route.push(from);
        }
        return route;
    };
    

    
    var heurestic_cost_estimate = function(from, to){
        var xDist = Math.abs(from.x - to.x);
        var yDist = Math.abs(from.y - to.y);
        return Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));
        
    };
    
    var start = from.id, g_score = [],  h_score = [], f_score = []; 
    g_score[start] = 0;
    h_score[start] = heurestic_cost_estimate(from, to);
    f_score[start] = h_score[start];
    
    
    
    while (openset.length > 0){
        var x = null; // current node
        
        for (var i = 0, openset_len = openset.length; i < openset_len; i++){          
            if (x === null || f_score[openset[i].id] < f_score[x.id]){
                x = openset[i];
            }       
        }

        
        // we have reached the goal
        if (x === goal) {
            route.push(goal);
            reconstruct_path(came_from[x.id]);
            //     console.log(closedset.length);
            return route.reverse();
        }
        
        // delete openset[0];
        openset.splice(openset.indexOf(x),1);
        
        closedset.push(x);
        for(var y = 0, neighbors = x.vertices, neighbor_len = neighbors.length; y < neighbor_len; y++){
            //  console.log(y);
            var tentative_is_better = false;
            
            var yd = neighbors[y].dest;
            if (closedset.indexOf(yd) > -1){
                continue;
            }
            // console.log(yd);
            var tentative_g_score = g_score[x.id] + neighbors[y].cost;
            
            if (openset.indexOf(yd) === -1){
                openset.push(yd);
                tentative_is_better = true;
            } else if (tentative_g_score < g_score[yd.id]){
                tentative_is_better = true;
            } 
            
            if (tentative_is_better){
                came_from[yd.id] = x;
                g_score[yd.id] = tentative_g_score;
                h_score[yd.id] = heurestic_cost_estimate(yd, to);
                f_score[yd.id] = g_score[yd.id] + h_score[yd.id];
                
            }
        //    console.log(openset);
            
        }
    }
    return false;
    
};


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



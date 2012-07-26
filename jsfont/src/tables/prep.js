JSFONT.prepTable = function(data){   

    this._structure = [
    {
        "controls": {
            "type": "array",
            "itemType": "BYTE",
            "count": function(){
               // console.log(_._len);
               
               var len = 108; // TODO get real length
               
               return len;
            }
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.prepTable.prototype = new JSFONT.Table();
JSFONT.prepTable.prototype.constructor = JSFONT.prepTable;

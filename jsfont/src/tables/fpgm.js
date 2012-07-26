JSFONT.fpgmTable = function(data){   
   var _ = this;
    this._structure = [
    {
        "controls": {
            "type": "array",
            "itemType": "BYTE",
            "count": function(){
               // console.log(_._len);
               
               var len = 613; // TODO get real length
               
               return len;
            }
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.fpgmTable.prototype = new JSFONT.Table();
JSFONT.fpgmTable.prototype.constructor = JSFONT.fpgmTable;

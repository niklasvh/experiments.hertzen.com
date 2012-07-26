JSFONT.cvtTable = function(data){   
   var _ = this;
    this._structure = [
    {
        "controls": {
            "type": "array",
            "itemType": "FWORD",
            "count": function(){
               // console.log(_._len);
               
               var len = 58; // TODO get real length
               
               return len/2;
            }
        }
    }


    ];
    
   // this._hex = ["checkSumAdjustment","magicNumber","macStyle","flags"];
  
    return this;
};
    
JSFONT.cvtTable.prototype = new JSFONT.Table();
JSFONT.cvtTable.prototype.constructor = JSFONT.cvtTable;

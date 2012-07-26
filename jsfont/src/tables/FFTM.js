
JSFONT.FFTMTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "ULONG"
    },

    {
        "FontForgeCreation": "LONGDATETIME"
    },
    {
        "sfdCreation": "LONGDATETIME"
    },
    {
        "sfdModification": "LONGDATETIME"
    }
    ];
    

    
    
    return this;
};
    
JSFONT.FFTMTable.prototype = new JSFONT.Table();
JSFONT.FFTMTable.prototype.constructor = JSFONT.FFTMTable;
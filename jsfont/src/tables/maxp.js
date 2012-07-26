



JSFONT.maxpTable = function(data){   
   
    this._structure = [
    {
        "version": "Fixed"
    },

    {
        "numGlyphs": "USHORT"
    },

    {
        "cond1":{
            "type": "condition",
            "item": "version",
            "condition": "==",
            "value": "1.0",
            "structure":[
            {
                "maxPoints": "USHORT"
            },

            {
                "maxContours": "USHORT"
            },

            {
                "maxCompositePoints": "USHORT"
            },

            {
                "maxCompositeContours": "USHORT"
            },

            {
                "maxZones": "USHORT"
            },

            {
                "maxTwilightPoints": "USHORT"
            },

            {
                "maxStorage": "USHORT"
            },

            {
                "maxFunctionDefs": "USHORT"
            },

            {
                "maxInstructionDefs": "USHORT"
            },

            {
                "maxStackElements": "USHORT"
            },

            {
                "maxSizeOfInstructions": "USHORT"
            },

            {
                "maxComponentElements": "USHORT"
            },

            {
                "maxComponentDepth": "USHORT"
            }
            ]
        }
    }
    ];
    
    this._hex = [];
  
    return this;
};
    
JSFONT.maxpTable.prototype = new JSFONT.Table();
JSFONT.maxpTable.prototype.constructor = JSFONT.maxpTable;
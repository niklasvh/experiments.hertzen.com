
JSFONT.GDEFTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "ULONG"
    },

    {
        "GlyphClassDef": "USHORT"
    },
    {
        "AttachList": "USHORT"
    },
    {
        "LigCaretList": "USHORT"
    },
    {
        "MarkAttachClassDef": "USHORT"
    },
    {
        "cond1":{
            "type": "condition",
            "condition": ">",
            "value": 0,
            "item": "GlyphClassDef",
            "structure":[
            {
                "offset1":{
                    "type": "offset",
                    "item": "GlyphClassDef",
                    "structure":[
                    {
                        "baseGlyphFormat": "USHORT"                           
                    },
                    {
                        "cond1": {
                            "type": "condition",
                            "item": "baseGlyphFormat",
                            "value": 2,
                            "condition": "==",
                            "structure": [
                            {
                                "classRangeCount": "USHORT"                        
                            },
                            {
                                "classRangeRecords":{
                                    "type": "records",
                                    "numTables": "classRangeCount",
                                    "structure":[
                                    {
                                        "start": "USHORT"
                                    },
                                    {
                                        "end": "USHORT"
                                    },
                                    {
                                        "Class": "USHORT"
                                    } 
                                                    
                                    ]
                                }
                            }
                            ]
                        }
                    }
                    ]
                }
            },{
                "cond2":{
                    "type": "condition",
                    "condition": ">",
                    "value": 0,
                    "item": "AttachList",
                    "structure":[     
                    {
                        "offset2":{
                            "type": "offset",
                            "item": "AttachList",
                            "structure":[
                            {
                                "AttachListCoverage": "USHORT"                           
                            },
                            {
                                "GlyphCount": "USHORT"
                            } // todo add last field ------------------------------------
                            ]
                        }
                    }
                    ]
                }
            },{
                "cond3":{
                    "type": "condition",
                    "condition": ">",
                    "value": 0,
                    "item": "LigCaretList",
                    "structure":[     
                    {
                        "offset2":{
                            "type": "offset",
                            "item": "LigCaretList",
                            "structure":[
                            {
                                "LigCaretListCoverage": "USHORT"                           
                            },
                            {
                                "LigGlyphCount": "USHORT"
                            }// todo add last field ------------------------------------
                            ]
                        }
                    }
                    ]
                }
            }
            ]
        }
    }
    ];
    

    
    
    return this;
};
    
JSFONT.GDEFTable.prototype = new JSFONT.Table();
JSFONT.GDEFTable.prototype.constructor = JSFONT.GDEFTable;
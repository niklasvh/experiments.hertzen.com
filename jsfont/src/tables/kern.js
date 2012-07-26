
JSFONT.kernTable = function(data){   
   
   
   
    this._structure = [
    {
        "version": "USHORT"
    },

    {
        "nTables": "USHORT"
    },
    {
        "subTables": {
            "type": "records",
            "numTables": "nTables",
            "structure": [
            {
                "version": "USHORT"
            },

            {
                "length": "USHORT"
            },
            {
                "coverage": "USHORT"
            },
            {
                "cond1":{
                    "type": "condition",
                    "item": "version",
                    "condition": "==",
                    "value": 0,
                    "structure": [
                    {
                        "nPairs": "USHORT"
                    },
                    {
                        "searchRange": "USHORT"
                    },

                    {
                        "entrySelector": "USHORT"
                    },

                    {
                        "rangeShift": "USHORT"
                    },

                    {
                        "kerningPairs":{
                            "type": "records",
                            "numTables" : "nPairs",
                            "structure": [
                            {
                                "left": "USHORT"
                            },

                            {
                                "right": "USHORT"
                            },

                            {
                                "value": "FWORD"
                            }
                        
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
    
    
    /*
    this._records = {
        "numTables": "nTables",
        "structure": [
        {
            "version": "USHORT"
        },

        {
            "length": "USHORT"
        },
        {
            "coverage": "USHORT"
        },
        {
            "cond1":{
                "type": "condition",
                "item": "version",
                "condition": "==",
                "value": 0,
                "structure": [
                {
                    "nPairs": "USHORT"
                },
                {
                    "searchRange": "USHORT"
                },

                {
                    "entrySelector": "USHORT"
                },

                {
                    "rangeShift": "USHORT"
                },

                {
                    "kerningPairs":{
                        "type": "records",
                        "numTables" : "nPairs",
                        "structure": [
                        {
                            "left": "USHORT"
                        },

                        {
                            "right": "USHORT"
                        },

                        {
                            "value": "FWORD"
                        }
                        
                        ]
                    }
                }
                    
                ]
            }  
        }
        ]
    };
    */
    

    
    
    return this;
};
    
JSFONT.kernTable.prototype = new JSFONT.Table();
JSFONT.kernTable.prototype.constructor = JSFONT.kernTable;
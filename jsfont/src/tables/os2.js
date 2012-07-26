
JSFONT.OS2Table = function(data){   
   
    this._structure = [
    {
        "version": "USHORT"
    },

    {
        "xAvgCharWidth": "SHORT"
    },

    {
        "usWeightClass": "USHORT"
    },

    {
        "usWidthClass": "USHORT"
    },

    {
        "fsType": "USHORT"
    },

    {
        "ySubscriptXSize": "SHORT"
    },

    {
        "ySubscriptYSize": "SHORT"
    },

    {
        "ySubscriptXOffset": "SHORT"
    },

    {
        "ySubscriptYOffset": "SHORT"
    },

    {
        "ySuperscriptXSize": "SHORT"
    },

    {
        "ySuperscriptYSize": "SHORT"
    },

    {
        "ySuperscriptXOffset": "SHORT"
    },

    {
        "ySuperscriptYOffset": "SHORT"
    },

    {
        "yStrikeoutSize": "SHORT"
    },

    {
        "yStrikeoutPosition": "SHORT"
    },

    {
        "sFamilyClass": "SHORT"
    },

    {
        "panose1": "BYTE"
    },

    {
        "panose2": "BYTE"
    },

    {
        "panose3": "BYTE"
    },

    {
        "panose4": "BYTE"
    },

    {
        "panose5": "BYTE"
    },

    {
        "panose6": "BYTE"
    },

    {
        "panose7": "BYTE"
    },

    {
        "panose8": "BYTE"
    },

    {
        "panose9": "BYTE"
    },

    {
        "panose10": "BYTE"
    },

    {
        "ulUnicodeRange1": "ULONG"
    },

    {
        "ulUnicodeRange2": "ULONG"
    },

    {
        "ulUnicodeRange3": "ULONG"
    },

    {
        "ulUnicodeRange4": "ULONG"
    },   

    {
        "achVendID1": "CHAR"
    },

    {
        "achVendID2": "CHAR"
    },

    {
        "achVendID3": "CHAR"
    },

    {
        "achVendID4": "CHAR"
    },        

    {
        "fsSelection": "USHORT"
    },

    {
        "usFirstCharIndex": "USHORT"
    },

    {
        "usLastCharIndex": "USHORT"
    },

    {
        "sTypoAscender": "SHORT"
    },

    {
        "sTypoDescender": "SHORT"
    },

    {
        "sTypoLineGap": "SHORT"
    },

    {
        "usWinAscent": "USHORT"
    },

    {
        "usWinDescent": "USHORT"
    },

    {
        "ulCodePageRange1": "ULONG"
    },

    {
        "ulCodePageRange2": "ULONG"
    },
    {
        "cond1":{
            "type": "condition",
            "item": "version",
            "condition": ">",
            "value": 1,
            "structure":[
            {
                "sxHeight": "SHORT"
            },

            {
                "sCapHeight": "SHORT"
            },

            {
                "usDefaultChar": "USHORT"
            },

            {
                "usBreakChar": "USHORT"
            },

            {
                "usMaxContext": "USHORT"
            } 
            ]
        }
    }
    
      
    ];
    

    this.data = {};
    
    
    return this;
};
    
JSFONT.OS2Table.prototype = new JSFONT.Table();
JSFONT.OS2Table.prototype.constructor = JSFONT.OS2Table;
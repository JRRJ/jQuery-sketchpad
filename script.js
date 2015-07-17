// Script for Odin Project jQuery Sketchpad
// John Jenson 7/17/2015
//
// Credits:
// random color generator code in makeBoxes from
//          http://www.paulirish.com/2009/random-hex-color-code-snippets/
// rgb2hex method from 
//          http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value

var rows = 16;
var boxSize = 56;

// creates the array of .box divs and changes their background color when the mouse is over them.
// the background color will be the color from the color picker, a random rgb value, or #222 darker
// or lighter, depending on which radio button is selected.
var makeBoxes = function () {
    for (var i=0; i< rows*rows; i++){
        $('#container').append("<div class='box'></div>");
    }
    $('.box').mouseover(function(){
        if($('input[name="styleRadio"]:checked', '#styleForm').val() == "selected"){
             $(this).css({'background-color':$('.colorpicker').val()});
        }
        else if($('input[name="styleRadio"]:checked', '#styleForm').val() == "random"){
            $(this).css({'background-color':'#'+Math.floor(Math.random()*16777215).toString(16)});
        }
        else if($('input[name="styleRadio"]:checked', '#styleForm').val() == "darker"){
            //console.log(rgb2hex($(this).css('background-color')));
            var tempColor = shading(rgb2hex($(this).css('background-color')),-1);
            $(this).css({'background-color':tempColor});
        }
        else if($('input[name="styleRadio"]:checked', '#styleForm').val() == "lighter"){
            //console.log(rgb2hex($(this).css('background-color')));
            var tempColor = shading(rgb2hex($(this).css('background-color')),1);
            $(this).css({'background-color':tempColor});
        }
    });
};

// this function takes colorIn in the form of a hex string along with a shading factor.
// 'factor' should be a power of 2 (negative powers included), between 1/32 and 8.
// A factor of 1 brightens the color by 1/8 (that is, it adds #202020)
// a factor of 2 brightens by 1/4, a factor of 0.5 brightens by 1/16, a factor of 8 will brighten
// any color to white, and negative factors darken the result instead.

// NOTE: when used with rgb2hex, this function is not well optimized.
// this is because some redundant string parsing is going on.
// combining these functions would eliminate the problem, but I wanted to leave the
// rgb2hex function unchanged.
var shading = function (colorIn, factor) {
    //slice a string in the form '#RRGGBB' into three strings, one for each color channel
    var rChannel = colorIn.slice(1,3);
    var gChannel = colorIn.slice(3,5);
    var bChannel = colorIn.slice(5,7);
    
    //convert these hexidecimal strings into integers
    var rInt = parseInt(rChannel,16);
    var gInt = parseInt(gChannel,16);
    var bInt = parseInt(bChannel,16);
    
    //
    rInt += 32 * factor;
    if(rInt < 0){rInt=0;}
    else if(rInt > 255){rInt=255;}
    
    gInt += 32 * factor;
    if(gInt < 0){gInt=0;}
    else if(gInt > 255){gInt=255;}
    
    bInt += 32 * factor;
    if(bInt < 0){bInt=0;}
    else if(bInt > 255){bInt=255;}
    
    console.log("Darker = " + intToHex(rInt));
    return '#' + intToHex(rInt) + intToHex(gInt) + intToHex(bInt);
};

// converts an integer to a length-2 string
// mostly a safety check to ensure 0-F are written 00-0F
var intToHex = function(intColor){
    var hex = intColor.toString(16);
    if(hex.length === 1){
        hex = "0" + hex;
    }
    return hex;
};

// converts strings in the form 'rgb(R, G, B)' (as returned by jQuery .css('background-color)) to '#RRGGBB'
// source: http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// starting point for the page.
// upon loading, creates the grid.
// also redraws the grid at a specified size whenever the reset button is pressed.
$(document).ready(function(){
    makeBoxes();
    $('button').mousedown(function(){
        rows = prompt("How many rows?", 16);
        boxSize = Math.floor(900/rows);
        //alert("The new box size will be " + boxSize + " pixels.");
        $('#container').empty();
        makeBoxes();
        $('.box').width(boxSize);
        $('.box').height(boxSize);
    });
});


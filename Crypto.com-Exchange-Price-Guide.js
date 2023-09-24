// ==UserScript==
// @name         Crypto.com Exchange Price Guide
// @namespace    https://github.com/jumbojoffer/Crypto.com-Exchange-Price-Guide
// @version      0.1
// @description  A simple userscript for greasemonkey/tampermonkey that displays a percentage number in the the hover overlay, below avg. price, in relation to current price/ticker
// @author       jumbojoffer
// @match        https://crypto.com/exchange/trade/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crypto.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

let CP; // Current Price. Price that the mouse is currently hovering over, which also enables the overlay.
let OP; // Original Price (Ticker)
let Percent; // Percentage value calculated from OP devided by CP, using CP as baseline.

setTimeout(function() {
    // After 5 second timeout, activate script and log to console console
    console.log("Ticker Script Online");

    // Create new pan element on new line after avg. price number in hover overlay.
    $('div.overlay-item span.e-number__text:first').after('</br><span id="PercentOfTicker" style="font-size:0.9em; background-color: rgba(0,0,0,0.2); float: right; padding: 0px 2px;">test</span>');

    // Places event listener on current price ticker to watch for changes on the element/price. Store the value in variable.
    $('div.current-price').on('DOMSubtreeModified',function(){
        CP = $(this).text().replace(/,/g, '');
        console.log("Price changed to: "+CP);
    });

    // Places event listener in hover overlay to watch for changes on the element/avg. price number. Store the ticker value in variable.
    // Then calculates percentage of hover price where ticker price is the baseline as 100%, then removes 100 to make 0 the new baseline, keeping 4 decimals.
    // Lastly checks if the number is more, less or equal to 0 and changes the text color to match impression of the value.
    $('div.overlay-item span.e-number__text:first').on('DOMSubtreeModified',function(){
        OP = $(this).text().replace(/,/g, '');
        Percent = (OP/CP*100-100).toFixed(4);

        if (Percent > 0) {
            console.log("Setting color to orange");
            $("span#PercentOfTicker").css({'color':'orange'});
        }

        if (Percent < 0) {
            console.log("Setting color to lime");
            $("span#PercentOfTicker").css({'color':'lime'});
        }

        if (Percent == 0) {
            console.log("Setting color to white");
            $("span#PercentOfTicker").css({'color':'white'});
        }

        // Updates the script-created price percentage span element in hover overlay with the newly calculated price percentage diffierence between .
        $("span#PercentOfTicker").text(Percent+"%");
    });
}, 5000);

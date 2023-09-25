// ==UserScript==
// @name         Crypto.com Exchange Price Guide
// @namespace    https://github.com/jumbojoffer/Crypto.com-Exchange-Price-Guide
// @version      0.2
// @description  A simple userscript for greasemonkey/tampermonkey that displays a percentage number in the the hover overlay, below avg. price, in relation to current price/ticker
// @author       jumbojoffer
// @match        https://crypto.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crypto.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

let CP = 0; // Current Price (Ticker).
let HP = 0; // Hover Price. Price that the mouse is currently hovering over, which also enables the overlay.
let Percent = 0; // Percentage value calculated from HP devided by CP, using CP as baseline.
let Once = false;



// A whole function that waits for elements to load.
$(function init() {
    if (location.href.indexOf("/exchange/trade") > -1) {
        const isElementLoaded = async selector => {
            while (document.querySelector(selector) === null) {
                await new Promise(resolve => requestAnimationFrame(resolve))
            }
            return document.querySelector(selector);
        };

        // Elements with classes .price.color-buy-price will be checked. If they exist, execute run().
        isElementLoaded('.price.color-buy-price').then((selector) => {
            console.log("You are on the trading page!");
            setTimeout(run, 1000);
        });
    } else {
        console.log("I don't know where you are...");
        $("div.sub-menu:first").onclick = function() {
            setTimeout(init, 1000);
        };
    }
});


function run() {
    console.log("Script Online!");

    // Store avg. price element, ticker element, closest ask price element and closest buy price element.
    const avgprice = $('div.overlay-item span.e-number__text:first');
    const TickerElement = $('div.current-price .sy-price');
    const Cbuy = $("div.price.color-buy-price:first");
    const Cask = $("div.price.color-ask-price:last");


    // Create new span elements. One on new line after avg. price element and one next to the ticker.
    TickerElement.after('<span id="AskBuyGap" style="font-size:0.95em; background-color: rgba(0,0,0,0.2); float: right; padding: 0px 2px;">'+parseFloat(Cask.text().replace(/[\s,"]/g, '') / Cbuy.text().replace(/[\s,"]/g, '') * 100 - 100).toFixed(5)+'</span>');
    avgprice.after('</br><span id="PercentOfTicker" style="font-size:0.95em; background-color: rgba(0,0,0,0.2); float: right; padding: 0px 2px;"></span>');


    // Watch for changes on prices closest to ticker and update the AskBuyGap span with new values.
    $(Cbuy, Cask).on('DOMSubtreeModified',function(){
        $("span#AskBuyGap").text(parseFloat(Cask.text().replace(/[\s,"]/g, '') / Cbuy.text().replace(/[\s,"]/g, '') * 100 - 100).toFixed(5));
    });

    // Store the current price ticker value and place event listener on it to update on change.
    CP = TickerElement.text().replace(/[\s,"]/g, '');
    TickerElement.on('DOMSubtreeModified',function(){
        CP = $(this).text().replace(/[\s,"]/g, '');
        console.log("Price changed to: "+CP);
    });

    // Places event listener in hover overlay to watch for changes on the element/avg. price number. Store the ticker value in variable.
    // Then calculates percentage of hover price where ticker price is the baseline as 100%, then removes 100 to make 0 the new baseline, keeping 4 decimals.
    // Lastly checks if the number is more, less or equal to 0 and changes the text color to match impression of the value.
    avgprice.on('DOMSubtreeModified',function(){
        HP = $(this).text().replace(/[\s,"]/g, '');
        Percent = (HP/CP*100-100);

        if (Percent > 0) {
            $("span#PercentOfTicker").css({'color':'orange'});
        }

        if (Percent < 0) {
            $("span#PercentOfTicker").css({'color':'lime'});
        }

        if (Percent == 0) {
            $("span#PercentOfTicker").css({'color':'white'});
        }

        // Updates the script-created price percentage span element in hover overlay with the newly calculated price percentage diffierence between .
        $("span#PercentOfTicker").text(Percent.toFixed(4)+"%");
    });
};

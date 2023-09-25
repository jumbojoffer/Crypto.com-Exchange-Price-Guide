# Crypto.com-Exchange-Price-Guide
A simple userscript for greasemonkey/tampermonkey that tracks percent difference of some prices on the trade page of crypto.com exchange.

What it calculates:
- Mouseover/hover price divided by current price. Gives a small percentage (eg. -0.0013%), displayed dynamically in the hover overlay.
- First buy order price below ticker divided by first ask order price above ticker. Gives a small positive percentage (eg. 0.00204%) displayed on right side of ticker. Signifies the percentage "gap" between buy and ask.

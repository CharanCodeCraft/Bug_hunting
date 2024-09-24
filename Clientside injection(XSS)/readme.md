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
        2. select individual report and select all and disable all and select input returned all in scan report
        3. put 250 for audit fail and 150 to pause the task in error audit
### After finding reflected inputs
* Finding a good reflected inputs(eliminating not so useful)
    * Request from url parameter and post parameters are the only good enpoints for xss
    * Respose with json content type is not so useful
#### Check for compensenting controls after finding good enpoints
3. WAF(Webapplication firewall)
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
    * See inputing different characters in Proxy(repeater) and if it strips it in any way
#### After finding compensating controls
1. Output encoding
    * Try to go through all character in fuzz dir of seclist to identify which are being encoded and which aren't
    * Also try to throw different encoded characters in fuzz to bypass
    * try to put some fuzzing character(in fuzz/naughty characters) before the encoding character like `rson$????????$"`
2. WAF bypass 
    * Try to put simple `<script>` tag and see if it cacthes it
    * then try to use other tags like img,a,svg and other...
    * Use OWASP cheat sheet and portswigger cheatsheet to get payload of different tags
    * Try to change case of letters,open tag twice and add `+` b/w tag name or use `%0a` which \r\n negleted
## XSS Tips
* The location where the input is reflected is very useful in determineing payload and how u can weaponize xss
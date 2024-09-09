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
## Before attacking
1. Collect sub-domains from sources u can use rson framwork for that which also sort live sub-domains
2. Then classify them into different list through the response
    * No functinality - nothing in page
    * Restricted access(Forbidden) - 403 or 401 status code
    * API - with 404 response to root directory
    * External services login page - basically it is external services used like microsoft 
    * Internal services login page - internally developed page for something like adminstration
    * Full app with authentication 
* We can use screenshot in enumeration section of rson framework
3. Then go through them one by one to find endpoints for xss
## Try to Find attack surface
1. Finding endpoints in no functionality sub-domains
    * U can use param miner to fuzz for endpoints(guess parameters) and u will see result in dashboard 
    * And if u see something pops up try to play around and manually test 
    * and also u can check for directory and also random headers fuzzing using intruder with seclist payload(raft list)
    * Seclist payloads that can be used are header list,raft list,fuzzing-unicode,uri-hex
2. Finding targets in restricted access domains
    * If we bypass the 403 it is itself a bug so after bypassing we can try to find endpoints too
    * It is typically a access control bypass

* So after this if u find any endpoint or parameter with positive response u can check if they are being reflected in response and if not try manually playing with request like changing http method or removing header
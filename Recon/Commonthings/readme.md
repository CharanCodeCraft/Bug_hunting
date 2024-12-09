# Common things to check for
Things to check when u just start to test on website
### Basic things to look for in website
- admin login page: /admin
- robots.txt file
- sitemap.xml
- technologies: waplyzer
### Google dorks
* For BBP 
```inurl:/bug bounty
inurl:/security
inurl:security.txt
inurl:security "reward"
Bug Bounty program "reward"
inurl:/responsible disclosure
inurl:/responsible-disclosure/ reward
inurl:/responsible-disclosure/ swag
inurl:/responsible-disclosure/ bounty
responsible disclosure "reward" site:com
responsible disclosure hall of fame
"powered by bugcrowd" -site:bugcrowd.com
"submit vulnerability report"
"submit vulnerability report" | "powered by bugcrowd" | "powered by hackerone"
```
* For domain testing 
```site:*.dell.com "keyword"
inurl:/admin
site:hackerone.com inurl:reports "Default Credentials"
site:linkedin.com inurl:posts "SQLi WAF bypass"
site:hackerone.com inurl:reports "Bypass of report"
```
* site:domain.com inurl:= inurl:? inurl:&
* for open redirect
```
site:domain.com inurl:keyword1here inurl:keyword2here .......

Make your own custom dorks using combinations of keywords below

🤑Keywords for OpenRedirect Urls
#set1
redir
redirect
redirect_uri
redirect_url
uri
url
next
out
to
forward
view

#set2
oauth
auth
client
response
code
sso
authorize
token
secret
type

#set3
v1
v2
v3
v4
2F (2F means /)
3A (3A means :)

http:// ->  http3A2F2F😎

#set4
login
identity
iam
oidc
saml
```
### Shodan Search engine
* So shodan is a search engine which collects the data of vulnerable devices in internet
* If any new CVE is released and if u search for it u will get vulnerable website on that cve and same goes with wordpress version
* Shodan count returns number of vulnerable data for specific key word like wordpress version
* Shodan download allows u to download the database data
* Just use org:domain name to get all data
* use shodan host get the open ports of domain or ip
```
org:"Intigriti"
http.status:200 org:"Intigriti"
http.html:"© copyright <company>" # unique keywords
org:<company> http.title:"Index of" # Finding sites with directory listings enabled
org:<company> http.component:php
```
### Githhub dorking(finding sensitive info)
* Manual dorking
    - Search for domain in github, will find many results
    - narrowing down search results to find senstive results search with these keywords
        * "domain" password | "domain" pwd | "domain" pass | "domain" credentials | "domain" login | "domain" token | "domain" config | "domain" secrets
    - With more accurate keywords 
        * "domain" security_credentials - active directory | "domain" connectionstring - database| "domain" JDBC - database |"domain" ssh2_suth_password - servers
        | "domain" send_keys
    * https://github.com/random-robbie/keywords/blob/master/keywords.txt has some keywords
    * u can search org:domain and see the peopled connected to it and search with user:username keywords
* automated gitrob tool
* Resources - https://securitytrails.com/blog/github-dorksx
### Things to look for in wordpress websites
- admin login page by trying /login or /wp-admin or other default directory
- version of wp by inspect or view page source option
- look for xmlrpc.php for brute force or ping back
- look for /wp-json/wp/v2/users for user enumaertion
- see the wp file structure to get some directory 
- fuzz with seclists/Discovery/Web-content/CMS/wordpress.fuzz.txt
### Parameter discovery only for one main domain that ur testing
Now for fetching all urls from archive from many source i used gau rather then wayback bcz it use many sources and its all passive you can use katana for active urls and anew with that files.after use uro to filter out duplicates params..
* cat   subdomains_alive.txt | gau > newparms.txt
* katana -u subdomain_alive.txt -d 5 -ps -pss waybackarchive,commoncrawl,alienvault -kf -jc -fx -ef woff,css,png,svg,jpg,gif -o newparms.txt
* waymore -i domain.com -mode U -oU waymore_domain.com.txt
* Removing duplicate
    - cat newparms.txt | uro > filterparm.txt
And for js files that contains senstive keyss and pass i used grep command you can also fetch it by katana by  -jc flag for active js endpoint.
* cat waymore_domain.com.txt | grep "=" | grep "&" | grep "?"
cat  filterparam.txt | grep ".js$" > jsfiles.txt
### Nuclei template for finding js exposed keys
* cat jsfiles.txt | nuclei -t /home/charan/nuclei-templates/http/exposures -c 30
* nuclei -l js.txt -t /home/charan/nuclei-templates/http/exposures -o potential_secrets.txt
### JUICY PATTERN FINDING
* extracting endpoints from js files
    - curl -s https://target.com/main.js | sed ‘s/\./\n/g’ | grep ‘/api/’ | sort -u | grep -o -E ‘(https?://)?/?[{}a-z0–9A-Z_\.-]{2,}/[{}/a-z0–9A-Z_\.-]+’ ## extracts links and pathes
    - curl -s https://app.com/main.js | sed ‘s/\./\n/g’ | grep ‘/v1/’ | sort -u ## finds endpoints with the method
* UUID🆔 for IDOR
    - grep -Eo '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}' filterparm.txt | sort -u 
* JWT
    - cat filterparm.txt | grep "eyJ"
* Any suspicious keyword/path/number
    - grep -Eo '([a-zA-Z0-9_-]{20,})' filterparm.txt
* SSN (Social Security Number)
    - grep -Eo '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b' filterparm.txt
* Credit Card Numbers
    - grep -Eo '\b[0-9]{13,16}\b' filterparm.txt
* Potential SessionIDs and cookies
    - grep -Eo '[a-zA-Z0-9]{32,}' filterparm.txt
* Tokens + Secrets
     ```cat filterparm.txt | grep "token"
     cat filterparm.txt | grep "token="
     cat filterparm.txt | grep "code"
     cat filterparm.txt | grep "code="
      cat filterparm.txt | grep "secret"
      cat filterparm.txt | grep "secret="```
* Others
   ``` cat filterparm.txt | grep "admin"
cat filterparm.txt | grep "pass"
cat filterparm.txt | grep "pwd"
cat filterparm.txt | grep "passwd"
cat filterparm.txt | grep "password"
cat filterparm.txt | grep "phone"
cat filterparm.txt | grep "mobile"
cat filterparm.txt | grep "number"
cat filterparm.txt | grep "mail"```
* Private IP Address🚨
    - grep -Eo '((10|172\.(1[6-9]|2[0-9]|3[0-1])|192\.168)\.[0-9]{1,3}\.[0-9]{1,3})' filterparm.txt
    - grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}' filterparm.txt
* IPv6🔴
    - grep -Eo '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}' filterparm.txt
* Payment💸
    ```grep "payment" filterparm.txt
grep "order" filterparm.txt
grep "orderid" filterparm.txt
grep "payid" filterparm.txt
grep "invoice" filterparm.txt
grep "pay" filterparm.txt
```
* API Endpoint👾
```grep "/v1/" filterparm.txt
grep "/v2/" filterparm.txt
grep "/v3/" filterparm.txt
grep "/v4/" filterparm.txt
grep "/v5/" filterparm.txt
```
```grep "/api/" filterparm.txt
grep "api." filterparm.txt
grep "api" filterparm.txt
grep "/graphql" filterparm.txt
grep "graphql" filterparm.txt
```
* Authentication & Authorization👮‍♂️
```cat filterparm.txt | grep "sso"
cat filterparm.txt | grep "/sso"
cat filterparm.txt | grep "saml"
cat filterparm.txt | grep "/saml"
cat filterparm.txt | grep "oauth"
cat filterparm.txt | grep "/oauth"
cat filterparm.txt | grep "auth"
cat filterparm.txt | grep "/auth"
cat filterparm.txt | grep "callback"
cat filterparm.txt | grep "/callback"
```
* Information Disclosure via exposed files📂
    - grep -Eo 'https?://[^ ]+\.(env|yaml|yml|json|xml|log|sql|ini|bak|conf|config|db|dbf|tar|gz|backup|swp|old|key|pem|crt|pfx|pdf|xlsx|xls|ppt|pptx)' filterparm.txt
* Google Dork
    - site:domain.com ext:env OR ext:yaml OR ext:yml OR ext:json OR ext:xml OR ext:zip OR  ext:log OR ext:sql OR ext:ini OR ext:bak OR ext:conf OR ext:config OR ext:db OR ext:dbf OR ext:tar OR ext:gz 
### After this
* when start to test on main domain 
    - try this google dork site:domain.com inurl:= inurl:? inurl:&
    - and try to collect passive url and check manually, sometimes u find unauthenticated endpoints
    - cat waymore_domain.com.txt | grep "=" | grep "&" | grep "?"
    - arjun -u https://tst2.dev.targets.com/cgi-bin/fr.cfg/php/custom/id-pass.php -m GET -w Parameters_Fuzz.txt
    - Also u can use virustotalx for endpoints `./orwa.sh subdomain.txt | tee results.txt ` and `cat results.txt | egrep 'http|https' > endpoints.txt`
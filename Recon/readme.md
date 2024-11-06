# Recon and automation 
This repo contains using automated tools and perform recon like directory discovery and other things
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

### Shodan Search engine
* So shodan is a search engine which collects the data of vulnerable devices in internet
* If any new CVE is released and if u search for it u will get vulnerable website on that cve and same goes with wordpress version
* Shodan count returns number of vulnerable data for specific key word like wordpress version
* Shodan download allows u to download the database data
* Just use org:domain name to get all data
* use shodan host get the open ports of domain or ip
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
* Resources - https://securitytrails.com/blog/github-dorks
### Things to look for in wordpress websites
- admin login page by trying /login or /wp-admin or other default directory
- version of wp by inspect or view page source option
- look for xmlrpc.php for brute force or ping back
- look for /wp-json/wp/v2/users for user enumaertion
- see the wp file structure to get some directory 
- fuzz with seclists/Discovery/Web-content/CMS/wordpress.fuzz.txt

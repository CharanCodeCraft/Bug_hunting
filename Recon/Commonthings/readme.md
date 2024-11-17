# Common things to check for
Things to check when u just start to test on website
### Basic things to look for in website
- admin login page: /admin
- robots.txt file
- sitemap.xml
- technologies: waplyzer
### Subdomain enumeration
First step collect as much as subdomains you can.i use subfinder with my all api keys virustotal,censys,shodan etc no need many  other tool for subdomains finding its enough with all api keys + crt.sh manual+automation
-recursive flag used for fetching domain of subdomains its called sub sub domains example amazon.amazoncloud.amazon.com many people miss this part  and -all switch from its fetch all api from all sources with all api keys

subfinder -d google.com -all  -recursive > subdomain.txt

This oneliner fetch all subdomains from crt.sh

curl -s https://crt.sh/\?q\=\amazon.com\&output\=json | jq -r '.[].name_value' | grep -Po '(\w+\.\w+\.\w+)$'

Normaly people use httpx default command and they only filter subdomains with port 443 or 80 but many domains contains dashboard or control pannel and login pannel at 8080,8888,8000 port so always include these ports..
### Filtering live hosts with httpx🚨
* cat  subdomains.txt | httpx-toolkit -ports 80,8080,8000,8888 -threads 200 > subdomains_alive.txt
* cat subs_domain.com.txt | httpx -td -title -sc -ip > httpx_domain.com.txt
    - to get live domains with there return status
* cat httpx_domain.com.txt | awk '{print $1}' > live_subs_domain.com.txt
### Scanning for open ports
For checking open ports i used naabu its very fast by this i can check the result of open ports and what service is running on that port is it contain any vulnerable version so i exploit that service thats why port enumeration is important
* To remove https:// - sed 's|https://||' live_subs_domain.com.txt >fornaabu.txt
* naabu -list subdomains.txt  -c 50 -nmap-cli 'nmap -sV -sC'  -o naabu-full.txt
* Port 21 (FTP): Anonymous login, weak credentials, outdated software.
* Port 22 (SSH): Weak passwords, outdated software, improper configuration
* Port 3306 (MySQL): Weak passwords, SQL Injection.
* Port 80/443 (HTTP/HTTPS): Cross-Site Scripting (XSS), SQL Injection, outdated software.
### Nuclei Automated Live Subdomains Spray (with rate limit)
* nuclei -l live_subs_domain.com.txt -rl 10 -bs 2 -c 2 -as -silent -s critical,high,medium
* -l live_subs_domain.com.txt: Specifies the input file containing the live subdomains.
* -rl 10: Limits the rate of requests to 10 per second. This is essential to avoid overwhelming the target server, which could lead to rate-limiting or even being blocked.
* -bs 2: maximum number of hosts to be analyzed in parallel per template(default is 25)
* -c 2: maximum number of templates to be executed in parallel (default is 25)
* -as: Automatic web scan using wappalyzer technology detection to tags mapping
* -silent: Removes extra output from the terminal, leaving only critical information.
* -s critical,high,medium: Tells Nuclei to scan only for critical, high, and medium severity vulnerabilities, which helps you focus on the most important findings
### Subdomains without WAF
* cat httpx_domain.com.txt | grep -v -i -E 'cloudfront|imperva|cloudflare' > nowaf_subs_domain.com.txt
### List of subdomains with 403 response for fuzzing
* cat nowaf_subs_domain.com.txt | grep 403 | awk '{print $1}' > 403_subs_domain.com.txt
### 403 fuzzing
* Default Wordlist Fuzzing
    - dirsearch -l batches/ -x 403,404,500,400,502,503,429 --random-agent
* Extension based Fuzzing
    - dirsearch -u https://sub.domain.com -e xml,json,sql,db,log,yml,yaml,bak,txt,tar.gz,zip -x 403,404,500,400,502,503,429 --random-agent
### Finding Appropriate Wordlists📗
* When fuzzing specific services like Apache Tomcat, using targeted wordlists can significantly improve your chances of finding hidden vulnerabilities
* U can use seclist
* dirsearch -u https://sub2.sub1.domain.com -x 403,404,500,400,502,503,429 -e xml,json,sql,db,log,yml,yaml,bak,txt,tar.gz,zip -w /usr/share/seclists/Discovery/Web-Content/ApacheTomcat.fuzz.txt
### Finding Hidden Database Files
* dirsearch -u https://sub2.sub1.domain.com -x 403,404,500,400,502,503,429 -e xml,json,sql,db,log,yml,yaml,bak,txt,tar.gz,zip -w /path/to/wordlists/database.txt
### Parameter discovery
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
    - site:domain.com ext:env OR ext:yaml OR ext:yml OR ext:json OR ext:xml OR ext:zip OR  ext:log OR ext:sql OR ext:ini OR ext:bak OR ext:conf OR ext:config OR ext:db OR ext:dbf OR ext:tar OR ext:gz OR ext:backup OR ext:swp OR ext:old OR ext:key OR ext:pem OR ext:crt OR ext:pfx OR ext:pdf OR ext:xlsx OR ext:xls OR ext:ppt OR ext:pptx

### Content discovery
And for Checking any hidden Directory and files i used dirsearch with onelist for all list that contains many directory and filess used in web and include only status code that one is important..by this you can find many senstive discloure of files and directory i dont use ffuf bcz its give result with lots of waste things and its also blocked by the domains for its fast bruteforcing..thats why i like dirsearch with colorfull and clean output and less errors. 

dirsearch -l subdomains_alive.txt  -i 200,204,403 -x 500,502,429 -R 5 --random-agent -t 50 -F -w /home/coffinxp/oneforall/onelistforallshort.txt -o directory.txt
### Secretfinder in js
and for secret keys i used one liner secret finder or you can send it to nuclei custom secret finder that give clean result i will send u that.

cat  jsfiles.txt | while read url; do python3 /home/coffinxp/SecretFinder/SecretFinder.py -i $url -o cli >> secret.txt; done

and then grep all keyss

cat secret.txt | grep aws
cat secret.txt | grep goole captcha
cat secret.txt | grep twilio

and in last i send  all param to nuclei that contains all types of vulnerability with my custom templates i will share with you all soon after adding more..

before this if you want seperate vulnerability and  find with any other tool for specially made  for that purpose like for xss use dalfox,for openredirect use openredirex, for lfi use dotdotpwn & lfi suite..filter these with Gf pattren so you only get valid params for that vulnerability and send to nuclei with that specific vulnerability tags --tags xss

nuclei -list sorted_wordlist_100000.txt -t /home/coffinxp/Custom-Nuclei-Templates/

i have many things to add but due to yt policy i cant do much but i will send in channel bcz some tools have so much powerful and detected by the yt bot..i will make seperate video for that for http request smuggling,crlf injection,csrf,rce,cache poisoning,jwt attacks etc...
### After this
* when start to test on main domain 
    - try this google dork site:domain.com inurl:= inurl:? inurl:&
    - and try to collect passive url and check manually, sometimes u find unauthenticated endpoints
    - cat waymore_domain.com.txt | grep "=" | grep "&" | grep "?"
    - arjun -u https://tst2.dev.targets.com/cgi-bin/fr.cfg/php/custom/id-pass.php -m GET -w Parameters_Fuzz.txt
### Google dork for open redirect
* site:*.google.com inurl:redirect

### Some other tools
* Robinhood
* graphqlmap
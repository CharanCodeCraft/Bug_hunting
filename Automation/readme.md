# Automation for certain vulnerbilites
but this type of automation doesn't work on well secured website which gives 429 too many request error or blocks the ip
1. [XSS](#XSS)

## XSS 
### Using GF patterns 
* collect the url's from different tools
* then `cat url.txt|gf xss|sed 's/=.*/=/'
* The above gives xss vulnerable parameters and through sed the parameter values are removed
* Then use dalfox for scanning with different payloads are u can specifiy ur own 
* cat filterparm.txt | gf xss >> XSS.txt
* cat XSS.txt | Gxss -p khXSS -o XSS_Ref.txt
* dalfox file XSS_Ref.txt -o Vulnerable_XSS.txt
## Open redirect
* cat filterparm.txt | grep "=http" | sort -u | uro > orurls.txt
* we check the burp history after few days of crawling the web app, and then peforming burpsuite global search for commonly known OpenRedirect parameters.
## SSRF 
## 0dssrf
* sudo 0dSSRF.sh -hepak -l dominos/subdomains.txt -c my-collab-id.oastify.com -s 20

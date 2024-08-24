# Automation for certain vulnerbilites
but this type of automation doesn't work on well secured website which gives 429 too many request error or blocks the ip
1. [XSS](#XSS)

# XSS 
### Using GF patterns 
* collect the url's from different tools
* then `cat url.txt|gf xss|sed 's/=.*/=/'
* The above gives xss vulnerable parameters and through sed the parameter values are removed
* Then use dalfox for scanning with different payloads are u can specifiy ur own 

# Practice website for xss
## Exercise steps 
1. Build a vulnerable website
2. Get an XSS(Act as an attacker)
3. Fix the XSS(Act as a developer)
4. Repeat over and over again
### For xsspractice1
* payload: `<script>alert(1)</script>`
* solution: `.replaceAll("<","").replaceAll('>',"")`
### For xsspractice2
* payloads: `" onclick="alert(1)`,`" onmouseover="alert(1)`,`javascript.alert(1)`
* solution: `.replaceAll("<","").replaceAll('>',"").replaeAll('"',"")`
## Tips
* If JSON data is returned with content type:text/html u can run script

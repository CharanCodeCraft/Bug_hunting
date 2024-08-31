## Broken Access Control Reports

1. [Email Confirmation Bypass in myshop.myshopify.com that Leads to Full Privilege Escalation to Any Shop Owner by Taking Advantage of the Shopify SSO](https://hackerone.com/reports/791775) to Shopify - 1844 upvotes, $16000
    * It is design flaw where email address can be changed to any already logined account bcuz u can change email just by reciveing confirmation link to old email 
    * Takeaway - look for Email changing function where u can change it by just confirming using old email 
    * Try changing it to already existing account email address
2. [Ability to reset password for account](https://hackerone.com/reports/322985) to Upserve - 605 upvotes 
    * It looks typical idor bcuz email address is passed as a request parameter to change the password so if change it or send an array of email it can send it to all of it
    * Takeway - if u see email is used in request parameter to send pass changing link u can send an array of emails 
    * {"email_address":["admin@breadcrumb.com","attacker@evil.com"]} - POST method json
3. [Request smuggling on admin-official.line.me could lead to account takeover ](https://hackerone.com/reports/740037)to LY Corporation - 556 upvotes
4. 
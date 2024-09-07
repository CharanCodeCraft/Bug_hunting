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
4. [Able to blocking users with 2fa from login into their accounts by just knowing the SteamID](https://hackerone.com/reports/1179232)
    * Try to check any account blocking while u try to login as other user
    * Here When entering 2FA u can change the id and block others account 
5. [IDOR to delete profile images ](https://hackerone.com/reports/2213900)
    * U can check for delete functionality whereever it is used 
    * Here Id is used to delete profile picture of user
6. [IDOR vulnerability in unreleased HackerOne Copilot feature](https://hackerone.com/reports/2218334)
    * Guys are very fast they are even in waiting for unreleased features
    * Monitor JS files for code changes
7. [IDOR: Authorization Bypass in LockReport Mutation for public reports](https://hackerone.com/reports/2139190)
    * U should look for graphql operation and try to fuzz for operation that should not be used by normal user
    * Here he has used one of those operation i.e lock operation used report id to change it to any other public report
    * This guy kept reporting issues to H1, he has reported 22 issues and 6 has accepted only - stick to one program and you’ll find bugs.
8. [Improper santization of edit in list feature at twitter leads to delete any twitter user's list cover photo.](https://hackerone.com/reports/1437004)
    * Always try to look for deleting fuctionality as it creates good impact
    * Try to do something when u get id something will work
9. [IDOR - send a message on behalf of other user](https://hackerone.com/reports/1888545)
    * Try to look for websocket request reponses and play with them too
    * Here he has got id of other user in a response
10. [Able to see Bonus amount given to a report even if the bounty and Bonus is not visible to public or mentioned in {Report-Id}.json](https://hackerone.com/reports/2101087)
    * always note down what’s supposed to be public and what not
    * check for small things that could be found 
11. [IDOR - Delete all Licenses and certifications from users account using CreateOrUpdateHackerCertification GraphQL query](https://hackerone.com/reports/2122671)
    * Here he was able to change the id and can delete the licence of others
    * U need to understand the fuctions of the application
12. [IDOR allows an attacker to delete anyone's featured photo.](https://hackerone.com/reports/1608735)
    * Try to make them understand POC well and don't stop reporting if u find it exploitable
    * Here he was able to get the id by viewing the images of others which is not bruteforceable so he could delete image
13. [An Attacker Can Flag Draft Job Posts And Can Disclose The Draft Job Posts Details [ Similar to #1581528 Resolved Report]](https://hackerone.com/reports/1675674)
    * Sometimes resolved bug can still be a bug when it is not completely resolved
    * here the bug was only resolved that he was not able to get mail but was still able to get notification from linkdin
14. [Any (non-admin) user from an instance can destroy any (user and/or global) external filesystem](https://hackerone.com/reports/2047168)
    * When u have a view or get request try to send a delete request to same endpoint see if it works
    * changing request method specially delete can be used
15. [Rider can forcefully get passenger's order accepted resulting in multiple impacts including PII reveal and more mentioned in the report.](https://hackerone.com/reports/1960107)
    * Try to chain attacks 
16. [Attacker can create malicious child epics linked to a victim's epic in an unrelated group](https://hackerone.com/reports/1892200)
17. [Attacker is able to create,Edit & delete notes and leak the title of a victim's private personal snippet](https://hackerone.com/reports/1751258)
    * Try to change the operation that is being passed in a post body request sometimes if u know the exact operation name
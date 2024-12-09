# Broken access control and IDOR
```
By narrowing your focus to B2B applications, business logic, and Broken Access Control vulnerabilities, you're positioning yourself in a high-demand niche. With persistent learning and targeted efforts, you can become a successful and sought-after bug bounty hunter. Happy hunting!
```
* List of B2B bug bounty programs for BAC testing (And one game program) on 
@intigriti
*
```
https://t.co/qOI1yTg1a5
https://t.co/y2ea0M9D3x
https://t.co/68Qu4kprpY
https://t.co/uHWJyomFl6
```
### Reference for theory

- BAC - https://medium.com/@insightfulrohit/all-about-broken-access-control-cf6ec98a990b
- IDOR - https://medium.com/@insightfulrohit/all-about-insecure-direct-object-reference-idor-666cad6a94f0

## Before attacking
* Try to create two or more accounts for applications
* Try to take notes from markdown
    - Pointers-things that can be used later in attack
    - Accounts-different accounts 
* Use username@wearehackerone.com email and try to follow there rules of adding header or anything else
* Add username+anything@wearehackerone.com for creating different accounts(use incongnito)
* Set scope in burpsuite and know the techonologies using waplyzer

## Using desktop application
* desktop application pull up data in two ways
    - one way by connecting same endpoints of web application
    - or by creating a different api or routing for desktop and website
* If u find any endpoint from desktop that is not similar to website then try browsing it from browser
## Methodology(IDOR)

* First thing is to identify how the app is pulling large dataset like what identifiers are used
* Cookie as identifiers
    - try deleting different cookie associated until the u identify which on is validated
    - try identifing how the cookie value is represented like is it encoded or hashed or jwt 
    - check for the flags of the cookie
    - If u find any numerical id in sequential try manipulating it
* JWT Cookie as access token
    - mainly it contain algorithm.data.signature
    - so if u find id in data u should check if signature is being validated by removing character from signature
    - if not try finding algorithm
* After looking for identifier then look for mechanisms for get,post,update,delete methods basically CRUD operation
* For example if user A can perform all CRUD but where as user B shouldn't be able to do on behalf of user A 
* Try to fuzz parameter that u find in one request to all other requests
* U should look for idor in such a way u are in ur session but using someones id to perform serious fuctions on them
## Identifier complexity(predicting id of other user)

1. Decimal number shorter than 8
2. Decimal number longer than 8
3. Name and email as identifer
4. UUID(completely random non-bruteforcable)
5. Hexadecimal identifers
6. created using certain values like time,random num,increamenting number mixed
* Even the predicting id is not possible u can test it by creating another account and getting its id and submit it has couldn't predict the id but always try to predict
## Methodology(BAC)

* Create all different roles and note what they can do and what not
* Create verified and unverified account and test there features 
* Log in to powerful account to locate all the functionality and try to access it using low prev 
* Graphql endpoint 
    - In this type fetching data u need to look for operation or json request that are being performed
    - u should check for identifer for how they are identifing roles through cookie or parameter
    - if it is a cookie used to validate with session cookie try changing its identifier if not then replace complete cookie
    - try to fuzz every operations in graphql 
    - then try replacing different cookies of different roles to different operation
* When checking for bac and idor u will find multiple boundries like one request involving both idor and bac for an example
    - If u consider a team having roles as admin and non-admin created by admin user
    - so here roles makes RBAC to check for non-admin to use admin function like renaming the team name
    - for idor u should check if any other admin user of not in team can change the team name where team will be identified with unique id
    - so we will have two identifiers one for team and one for user both should be validated 
## Points to remember
* If u don't find identifier sequential try accesing the identifier of other account directly 
* Try changing the non-sequential data too or change it to identifier of other account
* A app can use the user provided data as identifier to grab data
* There could be chance different mechanisms or functions like api's use different identifiers or tokens
* Try reading documents of the application to study about role and their features
* you should choose a target with multiple roles
* If u find a cookie which non-sequnetial or not hashed or encoded look for it through search bar
* crawl for other endpoints as autheticated user
    - select root dir and right click and select scan 
    - select crawl and set crawl strategy 
    - give login credential
* Try discovering content through discover content option in burpsuite 
* U should try to identify CRUD operation that can be performed any instanace and then try doing that operation with different users
* There could be a same identifier used multiple times in one request then u test all combination by changing all
* IDOR and BAC are not like injection attack where u will have multiple security controls like waf,client side validation and server side validation but this invlove layers of validation to give access to something to some user
* So to find a valide bac u need to check every mechanism are they validating all the mechanism 
* Again the only thing u need to think is all possible ways of idor and bac in single request 
* Try to create function matrix for different roles
* U can use cyberchef to decode id's
* PII stands for personal identifiable information which can be retrived in get request most of the time
* Try to read docs of api provided by company and try to look for endpoints
* Changing http methods from post to get can some time work and also try head which is similar to get 
## Four cases

1. does the endpoint returns a larger useful dataset?
2. Does the endpoint is validated through client id?
3. Does the endpoint identify the client through a user context object via session validation?
4. Does the endpoint identify the client through an ID value with a signature?

## Idor in websocket
* first look for 101 protocol response but u should look for request that is valuable
* poisning initial request - Look for any identifer is used make websocket connection if not they are using already established session to make connection
* After the initial request-check for request with high length and see for identifires used to pull larger user data

## Automating through authorize(BAC) and autorepeater(IDOR)
* Mainly this can be used replace identifers or session token of other account to check for request are authorized or not
* Authorize for BAC
    - Basically we first need to search for feature or request that is available in high prev and not in low prev
    - Then we get the session token that is being used with cookie header and add it authorize
    - then by selecting the request we needed we send it authorize

## Other bugs closely related to BAC and IDOR to look for

* Static files 
    - sometimes staic files are also subjected to access control failure
    - Image and documents are key to secure when they deal with private data
    - Ex: GET /patientimages/3218878.jpg , GET /patientdocuments/217394.pdf
*  Forceful browsing
    - these are when functionalites are opened but can't be accessed directly 
    - Ex: GET /admin/viewtransactions - 403
          GET /ADMIN/viewtransactions - 200
* Parameter manipulation or parameter based access control
    - here we can tamper with parameter values like price value
    - or if ?admin=false parameter is present we can change it to true
* Access control on multi-stage process
    - many kinds of functions within an application are implemented across several stages, involving multiple requests being sent form the client to the server
    - the developer assumes that any user who reaches the later stages of the process must have the relevant privileges because this was verified at the earlier stages
* Restriction bypass(403 or 401)
    - u can use 403 bypasser tool to bypass
    - and also u need to check manually through book.hacktricks guide
* Verification access control 
    - Try to differentiate verified and unverified account features and try to access it through unverified 

### Amit tips
```
When acting as an editor, you have the ability to invite other users as editors. However, you are not allowed to delete users with "full" permissions. This is where an interesting exploit opportunity arises. The key is to intercept the request when attempting to delete another editor and replace the user ID of the target with that of a full-permission user.
Example Scenario:
Some sites send a delete request using a POST method in the following format:

{
 "userid": 8888,
 "role": "read,edit",
 "destroy": true
}

The server validates the 'role' parameter to ensure that the user initiating the delete action has the same or higher privileges than the target user. If an editor attempts to delete a user with a "full" role, the server will return an error, indicating insufficient permissions:


{
 "userid": 1111,
 "role": "full",
 "destroy": true
} 
// Server Response: 403 Forbidden

Even if the editor modifies the 'role' parameter to indicate lower permissions like "view,edit", the server still checks the actual role of the target user. Therefore, it still responds with a 403 Forbidden:

{
 "userid": 1111,
 "role": "view,edit",
 "destroy": true
}
// Server Response: 403 Forbidden

The Exploit: Removing the Role Parameter
What if we simply remove the 'role' parameter from the request? By doing so, the server no longer receives any information about the target user's role to validate against. This effectively bypasses the role-based validation. Additionally, since there is no role parameter in the request, the server does not attempt to validate the current user's privileges, resulting in a successful 
deletion:

{
 "userid": 1111,
 "destroy": true
}
// Server Response: 200 OK

By eliminating the role parameter, you can bypass the server’s validation checks and successfully delete users with full permissions.
```
* If there is an organization ID present, we can replace it with the victim organization's ID and schedule the victim organization for deactivation.
* An attacker can exploit an Insecure Direct Object Reference (IDOR) vulnerability on example.com, allowing them to delete or edit a user invited to another organization. The attacker can first obtain the victim's invited user ID by sending a forged request to the backend API that lists all invitations in an organization. After obtaining the user ID, the attacker logs into their own account, intercepts the request used to modify their own invited user, and replaces their user ID with the victim's invited user ID. This grants the attacker the ability to delete or modify the invited user in the victim's organization without proper authorization. This attack bypasses access controls, posing a significant security risk.
* always check for parameter in response if there is org id parameter in response we can add it in the request and replace our org id and victim template id to exploit the idor
* am fully manual . I just go through each and every endpoint and try to find the vuln

``` when there is single id and you change the id to the victim id and site gave the 403 there is no idor . i suggest you try to find the idor in the endpoint where is multiple id for example

my company id is : 1 my : image id is 1234
victim company id is 2 victim image id is 0000

now suppose our request like

POST /img/delete
host
cookie: e

{
org:1
img:1234
}
now here the in this request there is 2 ids our org id and our image id

now if we replace the victim org id and image id

POST /img/delete
host
{
org:2
img:0000
}

 its going to give the error 403 the reason for this is we dont have the access of victim org whose id is 2
but what if we do like this

POST /img/delete
host
cookie: e
{
org: my org id
img: victim image id
}

here i replace down my org id and victim image id

now if on backend if its check first that does the user victim username:me has access to particular org or not so if we use the victim org id then this condition will restrict us as we dont have to access to org 2 

but what if the developer forgot to check restriction for the image
like its checking that we are part of org 2 or not but not checking that does we have access of that img whose id is 9999

so on that point we can do like

POST /img/delete
host
cookie: e
{
org:1
img:0000
}

now site check user has access to org 1 but its dosent check does user also has access of img whose id is 0000 and because of this is image got deleted

you can also reverse on some endpoints

```
* there is WebSocket i intercepted the request while edit my detail i found there is my id like 1111 i changed to 1102 and other user data changed and using this i was able to change the victim email address and after that just need to hit forgot password to takeover account

```
i just analyze the response and found there is status parameter which is set to be active 

and by default its not allowing admin to edit the super admin but 

i just intercept the request while edit any user there is role parameter i removed it and add new parameter name status and set to inactive

so example request before exploit

userid=1234&name=lords&role=admin

and attacking request

userid=superadmin-id&name=lords&status=inactive

i sent the request and super admin is deactivated
```
```
Am spending more than 14 hours on hunting daily.

Thinnk logically try to break functionality its all about bug bounty. Try to combine multiple bugs and creat attack scenario 

Example idor with xss so we can takeover user account


And never lose hope it's just on confidence
It took 9month for me for my 1 ts bounty so it's may take time but after that it's very easy
```

```
 mostly search targets using Google dorks 

While searching for target attach 2023 with our dork , also add random keyword while search , combine multiple dorks , and also use Google search tools

Also exchange program from people

If target not respond contact there support
```
* Site:*.*.com bug bounty 2023
"Responsible disclosure" intext:bounty | intext:reward

```
SO WHILE IVITING THE USER REQUEST AS
user.firstName=dsx&user.lastName=dsxz&user.email=VICTIM@MAIL.COM
SO WHAT IS I ADD USER.PASSWORD=”AND NEW PASSWORD”
SO I FORGED REQUEST AS
user.firstName=dsxz&user.lastName=dsxz&user.email=VICTIM@MAIL.com&user.Password=”new password for victim”
AND I SEND INVITATION AND I WAS ABEL TO INVITE THE USER
```

```
info: while hunting on example.com i found there is 3 privileges
admin,user,static
and each of it has unique id like for
admin=5,user=4,static=3
“here i took 2 minutes to think like website implemented id to each privileges so what if there is other privilege which is not know to me “
\\\\actual starting\\\\

step1: so i logged in in admin account and while promoting the user i intercept the request
step2: i sent it to the intruder selected the role field and selected payload type number from 0 to 100
step3: and i started attack i get 200 on some of the numbers lik
1,3,4,5,88,99
step4: so i manually try to send this roles so request as
{
“email”:”ex@example.com”,
”role”:1
}
and on first attempt i got success
```
```
info: there is 3 privileges as admin , manager , member where the manager allow to invite users as manager and member and admin can manage them all

issue: manager not allow to demote the admin but i was able to demote the admin using manager account

//manager allow to invite the user as manager and member which is endpoint
{“email”:”victim@mail.com”,”roleType”:”manager”,”allSites”:1}
i just replaced the admin email and send the request
```
```
i found role id here and every time run inruder on this endpoint
so i just send the request to intruder selected role field and run number from 1 to 100
and i got 3 200 ok
for number 1,2,3
```
```
site:*.intigriti.com intext:"privilege escalation" inurl:"programs" intext:"low"
inurl:admin "login"
inurl:manager "login"
inurl:user "login"
site:*.*.com intext:"user roles" intitle:"crm"
* site:*.*.com intext:"user roles" inurl:"docs"
site:*.*.com intext:"pricing" intext:crm platforms
site:hackerone.com OR site:bugcrowd.com OR site:intigriti.com OR site:yeswehack.com OR site:openbugbounty.org "target-name"
site:*.target.com intext:"bug bounty"
CRM (Hubspot, Pipedrive, Zoho), Customer Relations (Zendesk, Freshdesk, Aircall, Front)
```
### xssrat tips
* Practice now! https://labs.hackxpert.com
```
Bug bounties have become a lucrative and intellectually stimulating career path for cybersecurity enthusiasts. While many guides cover general vulnerability hunting, narrowing your focus to B2B (Business-to-Business) applications, particularly around business logic and Broken Access Control (BAC), can set you apart as a specialized bug bounty hunter.```
```
Burp Suite (Pro or Community):
Use the Repeater and Intruder tools for testing business logic.
Extensions:
Autorize: Helps check access control issues.
Turbo Intruder: Useful for large-scale testing.
```
```
Selecting Programs
Focus on B2B applications that:
Have multi-user roles (e.g., admin, manager, employee).
Include sensitive operations (e.g., financial transactions, data exports).
Use bug bounty platforms or search for public programs with interesting B2B targets.
Examples: Enterprise CRMs, SaaS management platforms, HR management tools.
```
```
Sign Up and Explore:
Use trial accounts or demo versions to understand the application's workflows.
Document the user roles and their permissions.
Map Endpoints:
Use Burp Suite's Proxy to capture requests and identify API endpoints.
Organize endpoints into categories based on roles, functions, and critical actions.
```
```
Stay Updated:
Follow experts in the field and read write-ups on platforms like Medium and HackerOne.
Participate in CTFs:
Join Capture The Flag events to sharpen your skills.
Collaborate with the Community:
Engage in forums and bug bounty groups to share knowledge and get feedback.
```
```
### some of the attack methodologies for IDOR
```
Base-Steps:
1. Create two accounts if possible or else enumerate users first.
2. Check if the endpoint is private or public and does it contains any kind of id param.
3. Try changing the param value to some other user and see if it does anything to their account
```
```
Testcase - 1: Add IDs to requests that don’t have them
GET /api/MyPictureList → /api/MyPictureList?user_id=<other_user_id>
Testcase - 2: Try replacing parameter names
Instead of this: 
GET /api/albums?album_id=<album id>
Try This: 
GET /api/albums?account_id=<account id>
```
```
Testcase - 3: Supply multiple values for the same parameter (HPP).
Instead of this: 
GET /api/account?id=<your account id>
Try This: 
GET /api/account?id=<your account id>&id=<admin's account id>
Testcase - 4: Try changing the HTTP request method when testing for IDORs
Instead of this:
POST /api/account?id=<your account id>
Try this:    
PUT /api/account?id=<your account id>
For RESTful services, try changing GET to POST/PUT/DELETE to discover create/update/delete.
```
```
Testcase - 5: Try changing the request’s content type
Instead of this:
POST /api/chat/join/123 […] 
Content-type: application/text
user=test
Try this:
POST /api/chat/join/123 […] 
Content-type: application/json 
{“user”: “test”}
Testcase - 6: Try changing the requested file type (Test if Ruby)
Example:
GET /user_data/2341 --> 401 Unauthorized
GET /user_data/2341.json --> 200 OK
Tip: Experiment by appending different file extensions (e.g. .json, .xml, .config)
```
```
Testcase - 7: Does the app ask for non-numeric IDs? Use numeric IDs instead
Try numeric IDs anywhere non-numeric IDs are accepted
Example:
username=user1 → username=1234
account_id=7541A92F-0101-4D1E-BBB0-EB5032FE1686 → account_id=5678
album_id=MyPictures → album_id=12
Testcase - 8: Try using an array
 For example:
{“id”:19} → {“id”:[19]}
Testcase - 9: Wildcard ID
For example:
GET /api/users/<user_id>/ → GET /api/users/*
Testcase - 10: Path Traversal
For example:
GET /api/users/<user_id>/ → GET /api/users/<user_id>/../<user_id>
```
```
Testcase - 11: Pay attention to new features
If you stumble upon a newly added feature within the web app, such as the ability to upload a profile picture for an upcoming charity event, and it performs an API call to:
/api/CharityEventFeb2021/user/pp/<ID>
```
### Nahamsec tips
* we can't hit our first milestone($1000) if we bounce back between programs
* Running same automated tools like others are doing gets u no where 
* Pick one program and stick with it
* The real vulnerability comes from knowing the program well enough so u can spot what everybody is missing 
* It's not just about testing their endpoints it's about understanding their buisness 
* You have to got to match ur hunting style based on program u choose 
* Tools make u efficient but will not replace u
* U need to make a bug bounty hobby even just one to two hour a day is enough at start, it's just like going to gym 
* breaking things week by week 
1. Week 1: Program selection
    * Don't rush 
    * select company with massive attack surface 
    * pick three and narrow down to one 
2. Week 2: knowing about the target 
    * learn everything about their buisness 
    * Look their API docs and youtube videos 
    * also create account with different applications and map all different features of targets
3. Week 3: Start to test
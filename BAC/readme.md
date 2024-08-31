# Broken access control and IDOR

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
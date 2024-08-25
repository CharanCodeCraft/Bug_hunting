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
* After looking for identifier then look for mechanisms for get,post,update,delete methods
## Points to remember
* If u don't find identifier sequential try accesing the identifier of other account directly 
* Try changing the non-sequential data too or change it to identifier of other account
* A app can use the user provided data as identifier to grab data
* There could be chance different mechanisms or functions like api's use different identifiers or tokens
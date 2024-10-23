# Subdomain takerover
* Best reference article - https://medium.com/@dub-flow/subdomain-takeover-what-is-it-how-to-exploit-how-to-find-them-d2b6b82b155b
* This github repo can be used to identify if it can be takeovered or not - https://github.com/EdOverflow/can-i-take-over-xyz?tab=readme-ov-file

## How it works
* To take over a subdomain simple thing is to find a subdomain that is mapped non-existing external domain
* So Subdomains has a record called C_NAME record and that means the subdomain is mapped to some other external domain that is used by web application
* consider if a company has a external services associated to its website like aws,azure,microsoft or other services they get there own domain address which they don't like so they use a subdomain with their name but mapped to that domain
* So if a subdomain mapped to some external service and they stopped using that then the subdomain mapped to it remains as it is if not removed 
* To identify subdomain takeover u can see if the C_NAME subdomain returns 404 error
* U can use automated tools to do it 
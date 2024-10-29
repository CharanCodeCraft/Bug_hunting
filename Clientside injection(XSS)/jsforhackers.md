# Analyzing JS
Analyzing JS can help in two ways 
1. To obtain different Endpoints 
    * Different enpoints can be used to request to that enpoint see if it requires any parameter or any access to access it
    * and if it requires parameter like api key u can anyalze the fuction in js using this endpoint by going to source and search the enpoint 
    * If u can't understand the function try AI
2. To obtain API keys
    * API key can be weaponized to obtain access to endpoints
## Tools for analyzing js
1. To obtain different Endpoints
    * Linkfinder in burpsuite just gives all the endpoints found while analyzing
        * The drawback is it throws to many endpoints and u get confused what to check for 
    * Best one is renniepak's script
2. To obtain API Keys
    * Secretlinkfinder
    * grep -r -E "aws_access_key|aws_secret_key|api key|passwd|pwd|heroku|slack|firebase|swagger|aws_secret_key|aws key|password|ftp password|jdbc|db|sql|secret jet|config|admin|pwd|json|gcp|htaccess|.env|ssh key|.git|access key|secret token|oauth_token|oauth_token_secret" /path/to/directory/*.js
    * nuclei -l js.txt -t ~/nuclei-templates/exposures/ -o js_exposures_results.txt
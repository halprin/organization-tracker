# organization-tracker

Generate reports on users and their names for organizations.

## Run

```shell
$ node index.js <GitHub organization> <GitHub personal access token>
```

## Credentialing

Navigate to Settings ➡️ Developer settings ➡️ Personal access tokens.  Choose to generate a new token, and give it at
least the `read:org` permission. 

The randomly generated string is your personal access token.  Keep it secret; keep it safe.  You will pass it into this
application so that it can call GitHub without going over the limit and get the private listing of users in any
organization you are part of. 

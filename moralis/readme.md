## Moralis Cloud function

# 1 Install Moralis Admin CLI
npm install -g moralis-admin-cli

# 2 Create a folder where the javascript file will be located and run this command (update {} values)
moralis-admin-cli watch-cloud-folder --moralisApiKey {api_key} --moralisApiSecret {api_secret} --moralisSubdomain subdomain.moralis.io --autoSave 1 --moralisCloudfolder {path_to_cloud_files}

# 3 (Optional) Run to get log messages in command prompt
moralis-admin-cli get-logs --moralisApiKey {api_key} --moralisApiSecret {api_secret}
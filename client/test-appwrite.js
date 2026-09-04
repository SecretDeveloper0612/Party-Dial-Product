const { Client, Account, OAuthProvider } = require('appwrite');
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('dummy');
const account = new Account(client);
console.log(account.createOAuth2Session(OAuthProvider.Google, 'http://localhost/', 'http://localhost/'));

const Account = require('APP/db').Accounts

Account.findAll()
  .then(allAccounts => {
    allAccounts.forEach(account => {
      account.setAccountData(0)
    })
  })

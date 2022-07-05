$(() => {
  $('#account-form').on('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const newAccount = new Account(formData.get('username'))
    const accounts = await Account.getAccounts()
    const validationMsg = newAccount.validate(accounts)

    if (validationMsg) {
      alert(validationMsg)
    } else {
      newAccount.save()
    }
  })
})

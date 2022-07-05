$(() => {
  $('#account-form').on('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const newAccount = new Account(formData.username)
    const accounts = await getAccounts()
    const validationMsg = validateAccount(newAccount, accounts)

    if (validationMsg) {
      alert(validationMsg)
    }
  })
})

function getAccounts() {
  return new Promise((resolve, reject) => {
    $.ajax(`${BASE_ENDPOINT}/accounts`)
      .done((data) => resolve(data))
      .fail((err) => reject(err))
  })
}

function validateAccount(account, accounts) {
  let validationMsg = ''

  if (!account.username) {
    validationMsg = 'Please enter a value'
  }

  const alreadyExists = accounts.some((a) => a.username === account.username)

  if (alreadyExists) {
    validationMsg = `There is already an account with the name "${a.username}". Please, try a different one`
  }

  return validationMsg
}

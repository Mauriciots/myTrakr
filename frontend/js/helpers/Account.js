class Account {
  constructor(username, transactions) {
    this.username = username
    this.transactions = transactions || []
  }

  validate(accounts) {
    let validationMsg = ''

    if (!this.username) {
      validationMsg = 'Please enter a value'
    }

    const alreadyExists = accounts.some((a) => a.username === this.username)

    if (alreadyExists) {
      validationMsg = `There is already an account with the name "${this.username}". Please, try a different one`
    }

    return validationMsg
  }

  save() {
    const newAccount = {
      username: this.username,
      transactions: [],
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        url: `${BASE_ENDPOINT}/accounts`,
        data: JSON.stringify({ newAccount }),
        dataType: 'json',
        contentType: 'application/json',
      })
        .done((data) => resolve(data))
        .fail((err) => reject(err))
    })
  }

  get balance() {
    return this.transactions.reduce((total, transaction) => {
      const transactionObj = Transaction.instantiate(transaction)
      return total + transactionObj.value
    }, 0)
  }

  static getAccounts() {
    return new Promise((resolve, reject) => {
      $.ajax(`${BASE_ENDPOINT}/accounts`)
        .done((data) => resolve(data))
        .fail((err) => reject(err))
    })
  }

  static getAccountById(accounts, id) {
    return accounts.find((a) => a.id === id)
  }
}

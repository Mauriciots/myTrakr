class Transaction {
  constructor(amount, description, categoryId, accountId) {
    this.amount = amount
    this.description = description
    this.categoryId = categoryId
    this.accountId = accountId
  }

  validate(account) {
    let validationMsg = ''

    if (this.type !== 'deposit' && account.balance < this.amount) {
      validationMsg = 'Account does not have enough funds'
    }

    return validationMsg
  }

  save() {
    const newTransaction = this.buildNewTransaction({
      amount: this.amount,
      description: this.description,
      categoryId: this.categoryId,
      type: this.type,
    })

    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        url: `${BASE_ENDPOINT}/transaction`,
        data: JSON.stringify({ newTransaction }),
        dataType: 'json',
        contentType: 'application/json',
      })
        .done((data) => resolve(data))
        .fail((err) => reject(err))
    })
  }

  static getTransactions(accountId) {
    return new Promise((resolve, reject) => {
      $.ajax(`${BASE_ENDPOINT}/transactions`)
        .done((data) => {
          const normalized = data.reduce((acc, curr) => {
            curr.forEach((t) => acc.push(t))
            return acc
          }, [])
          const filtered = normalized.filter((t) => !accountId || t.accountId === accountId)
          filtered.sort((a, b) => b.id - a.id)
          resolve(filtered)
        })
        .fail((err) => reject(err))
    })
  }

  static instantiate(transaction) {
    switch (transaction.type) {
      case 'deposit':
        return new Deposit(transaction.amount, transaction.description, transaction.categoryId, transaction.accountId)
      case 'withdrawal':
        return new Withdrawal(
          transaction.amount,
          transaction.description,
          transaction.categoryId,
          transaction.accountId
        )
      case 'transfer':
      default:
        return new Transfer(
          transaction.amount,
          transaction.description,
          transaction.categoryId,
          transaction.accountFrom,
          transaction.accountFrom,
          transaction.accountTo
        )
    }
  }
}

class Withdrawal extends Transaction {
  constructor(amount, description, categoryId, accountId) {
    super(amount, description, categoryId, accountId)
    this.type = 'withdrawal'
  }

  get value() {
    return -this.amount
  }

  buildNewTransaction(baseTransaction) {
    return {
      ...baseTransaction,
      accountId: this.accountId,
    }
  }
}

class Deposit extends Transaction {
  constructor(amount, description, categoryId, accountId) {
    super(amount, description, categoryId, accountId)
    this.type = 'deposit'
  }

  get value() {
    return this.amount
  }

  buildNewTransaction(baseTransaction) {
    return {
      ...baseTransaction,
      accountId: this.accountId,
    }
  }
}

class Transfer extends Transaction {
  constructor(amount, description, categoryId, accountId, accountIdFrom, accountIdTo) {
    super(amount, description, categoryId, accountId)
    this.accountIdFrom = accountIdFrom
    this.accountIdTo = accountIdTo
    this.type = 'transfer'
  }

  get value() {
    return this.accountId === this.accountIdFrom ? -this.amount : this.amount
  }

  buildNewTransaction(baseTransaction) {
    return {
      ...baseTransaction,
      accountId: this.accountId,
      accountIdFrom: this.accountIdFrom,
      accountIdTo: this.accountIdTo,
    }
  }

  validate(account) {
    let validationMsg = super.validate(account)

    if (this.accountIdFrom === this.accountIdTo) {
      validationMsg = 'Transfers can only be performed when both accounts are not the same'
    }

    return validationMsg
  }
}

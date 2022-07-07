class Transaction {
  constructor(amount, account) {
    this.amount = amount
    this.account = account
  }
  commit() {
    if (this.value < 0 && this.amount > this.account.balance) return
    this.account.transactions.push(this.value)
    // this.account.balance += this.value;
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount
  }
}

class Deposit extends Transaction {
  get value() {
    return this.amount
  }
}

class Transfer extends Transaction {
  constructor(amount, accountIdFrom, accountIdTo) {
    this.amount = amount
    this.accountIdFrom = accountIdFrom
    this.accountIdTo = accountIdTo
  }

  get value() {
    return -this.amount
  }
}

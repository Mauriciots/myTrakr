class Elements {
  get accountNameInput() {
    return $('#account-name')
  }

  get accountDropdown() {
    return $('#account-dropdown')
  }

  get fromDropdown() {
    return $('#from-dropdown')
  }

  get toDropdown() {
    return $('#to-dropdown')
  }

  get accountForm() {
    return $('#account-form')
  }

  get transactionTypeRadioGroup() {
    return $('input[name="type"]')
  }

  get selectedTransactionTypeRadio() {
    return $('input[name="type"]:checked')
  }

  get accountBalance() {
    return $('#accountBalance')
  }

  get categoryDropdown() {
    return $('#category-dropdown')
  }

  get categoryFields() {
    return $('#category-fields')
  }

  get categorySaveBtn() {
    return $('#category-save-button')
  }

  get categoryInput() {
    return $('#category-name')
  }

  get transactionForm() {
    return $('#transaction-form')
  }

  get transactionsTable() {
    return $('#transactions-table')
  }
}

const pageEls = new Elements()

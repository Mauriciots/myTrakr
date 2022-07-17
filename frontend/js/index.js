function createSelect(value, label) {
  return $(`<option value="${value}">${label}</option>`)
}

function renderAccountDropdowns(accounts) {
  pageEls.accountDropdown.empty()
  pageEls.fromDropdown.empty()
  pageEls.toDropdown.empty()
  pageEls.accountFilter.empty()

  pageEls.accountDropdown.append(createSelect('', 'Select account'))
  pageEls.fromDropdown.append(createSelect('', 'Select sender account'))
  pageEls.toDropdown.append(createSelect('', 'Select destination account'))
  pageEls.accountFilter.append(createSelect('', 'Select account'))

  accounts.forEach((a) => {
    pageEls.accountDropdown.append(createSelect(a.id, a.username))
    pageEls.fromDropdown.append(createSelect(a.id, a.username))
    pageEls.toDropdown.append(createSelect(a.id, a.username))
    pageEls.accountFilter.append(createSelect(a.id, a.username))
  })
}

async function handleAccountSubmit(event) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const newAccount = new Account(formData.get('username'))
  const accounts = await Account.getAccounts()
  const validationMsg = newAccount.validate(accounts)

  if (validationMsg) {
    alert(validationMsg)
    return
  }

  await newAccount.save()
  renderAccountDropdowns(await Account.getAccounts())
  pageEls.accountNameInput.val('')
}

function rearrangeForm(transactionType = 'deposit') {
  pageEls.accountDropdown.show()
  pageEls.fromDropdown.hide()
  pageEls.toDropdown.hide()

  pageEls.accountDropdown.attr('required', 'true')
  pageEls.fromDropdown.removeAttr('required')
  pageEls.toDropdown.removeAttr('required')

  if (transactionType === 'transfer') {
    pageEls.accountDropdown.hide()
    pageEls.fromDropdown.show()
    pageEls.toDropdown.show()
    pageEls.accountDropdown.removeAttr('required')
    pageEls.fromDropdown.attr('required', 'true')
    pageEls.toDropdown.attr('required', 'true')
  }
}

function handleTransactionRadioClick(event) {
  const transactionType = pageEls.selectedTransactionTypeRadio.val()
  rearrangeForm(transactionType)
}

function renderCategories(categories) {
  pageEls.categoryDropdown.empty()
  pageEls.categoryDropdown.append(createSelect('', 'Select a category'))
  categories.forEach((c) => {
    pageEls.categoryDropdown.append(createSelect(c.id, c.name))
  })
  pageEls.categoryDropdown.append(createSelect('__ADD__NEW__', 'Add new...'))
  pageEls.categoryDropdown.val('')
  pageEls.categoryFields.hide()
}

function handleCategoryDropdownChange() {
  const category = $(this).val()
  if (category === '__ADD__NEW__') {
    pageEls.categoryDropdown.val('')
    pageEls.categoryDropdown.hide()
    pageEls.categoryFields.show()
  }
}

async function handleCategorySaveBtnClick() {
  const newCategoryName = pageEls.categoryInput.val()

  if (newCategoryName) {
    const newCat = new Category(newCategoryName)
    await newCat.save()
    renderCategories(await Category.getCategories())
  }

  pageEls.categoryDropdown.show()
  pageEls.categoryFields.hide()
  pageEls.categoryInput.val('')
}

async function renderTransactions(transactions, accounts, categories) {
  const table = pageEls.transactionsTable
  const tableBody = table.find('tbody')
  tableBody.empty()
  pageEls.emptyTable.show()
  table.hide()

  if (transactions && transactions.length) {
    table.show()
    pageEls.emptyTable.hide()
    transactions.forEach((t) => {
      const tObj = {
        deposit: () => new Deposit(t.amount, t.description, t.categoryId, t.accountId),
        withdrawal: () => new Withdrawal(t.amount, t.description, t.categoryId, t.accountId),
        transfer: () =>
          new Transfer(t.amount, t.description, t.categoryId, t.accountId, t.accountIdFrom, t.accountIdTo),
      }[t.type]()
      const account = Account.getAccountById(accounts, t.accountId)
      const fromAcc = Account.getAccountById(accounts, tObj.accountIdFrom)
      const toAcc = Account.getAccountById(accounts, tObj.accountIdTo)
      const category = Category.getCategoryById(categories, t.categoryId)
      tableBody.append(`
        <tr>
          <td>${t.id}</td>
          <td>${account.username}</td>
          <td>${tObj.type}</td>
          <td>${category.name}</td>
          <td>${tObj.description}</td>
          <td>${tObj.value}</td>
          <td>${fromAcc ? fromAcc.username : '--'}</td>
          <td>${toAcc ? toAcc.username : '--'}</td>
        </tr>
      `)
    })
  }
}

async function handleTransactionSubmit(event) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const transaction = Transaction.instantiate({
    type: formData.get('type'),
    accountId: parseInt(formData.get('accountId')),
    accountFrom: parseInt(formData.get('accountFrom')),
    accountTo: parseInt(formData.get('accountTo')),
    categoryId: parseInt(formData.get('categoryId')),
    description: formData.get('description'),
    amount: parseFloat(formData.get('amount')),
  })
  const account = await Account.getAccountById(await Account.getAccounts(), transaction.accountId)
  const accountObj = new Account(account.username, account.transactions)
  const validationMsg = transaction.validate(accountObj)

  if (validationMsg) {
    alert(validationMsg)
    return
  }

  await transaction.save()
  const accountId = parseInt(pageEls.accountFilter.val()) || null
  const accounts = await Account.getAccounts()
  renderTransactions(await Transaction.getTransactions(accountId), accounts, await Category.getCategories())
  renderSummary(Account.getAccountById(accounts, transaction.accountId))
}

async function renderSummary(account) {
  if (account) {
    const accountObj = new Account(account.username, account.transactions)
    pageEls.summaryContainer.show()
    pageEls.summaryAccName.text(accountObj.username)
    pageEls.summaryAccBalance.text(accountObj.balance)
  } else {
    pageEls.summaryContainer.hide()
  }
}

async function handleAccountDropdownChange(event) {
  const accountId = $(this).val()
  const account = await Account.getAccountById(await Account.getAccounts(), parseInt(accountId))
  renderSummary(account)
}

async function handleAccountFilterChange(event) {
  const accountId = parseInt($(this).val()) || null
  const accounts = await Account.getAccounts()
  const categories = await Category.getCategories()
  const transactions = await Transaction.getTransactions(accountId)
  renderTransactions(transactions, accounts, categories)
}

$(async () => {
  const categories = await Category.getCategories()
  const accounts = await Account.getAccounts()
  const transactions = await Transaction.getTransactions()

  pageEls.accountForm.on('submit', handleAccountSubmit)
  renderAccountDropdowns(accounts)

  pageEls.transactionTypeRadioGroup.click(handleTransactionRadioClick)
  rearrangeForm()

  pageEls.categoryDropdown.change(handleCategoryDropdownChange)
  pageEls.categorySaveBtn.click(handleCategorySaveBtnClick)
  renderCategories(categories)

  pageEls.transactionForm.on('submit', handleTransactionSubmit)
  renderTransactions(transactions, accounts, categories)

  pageEls.accountDropdown.change(handleAccountDropdownChange)
  pageEls.fromDropdown.change(handleAccountDropdownChange)
  pageEls.accountFilter.change(handleAccountFilterChange)
})

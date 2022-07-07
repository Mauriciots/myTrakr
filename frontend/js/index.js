function createSelect(value, label) {
  return $(`<option value="${value}">${label}</option>`)
}

function renderAccountDropdowns(accounts) {
  pageEls.accountDropdown.empty()
  pageEls.fromDropdown.empty()
  pageEls.toDropdown.empty()

  pageEls.accountDropdown.append(createSelect('', 'Select account'))
  pageEls.fromDropdown.append(createSelect('', 'Select sender account'))
  pageEls.toDropdown.append(createSelect('', 'Select destination account'))

  accounts.forEach((a) => {
    pageEls.accountDropdown.append(createSelect(a.id, a.username))
    pageEls.fromDropdown.append(createSelect(a.id, a.username))
    pageEls.toDropdown.append(createSelect(a.id, a.username))
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

  if (transactionType === 'transfer') {
    pageEls.accountDropdown.hide()
    pageEls.fromDropdown.show()
    pageEls.toDropdown.show()
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
  pageEls.categoryInput.validate()
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

$(async () => {
  pageEls.accountForm.on('submit', handleAccountSubmit)
  renderAccountDropdowns(await Account.getAccounts())

  pageEls.transactionTypeRadioGroup.click(handleTransactionRadioClick)
  rearrangeForm()

  pageEls.categoryDropdown.change(handleCategoryDropdownChange)
  pageEls.categorySaveBtn.click(handleCategorySaveBtnClick)
  renderCategories(await Category.getCategories())
})

function createSelect(value, label) {
  return $(`<option value="${value}">${label}</option>`)
}

function renderAccountDropdowns(accounts) {
  const $accountDropdown = $('#account-dropdown')
  const $fromDropdown = $('#from-dropdown')
  const $toDropdown = $('#to-dropdown')

  $accountDropdown.empty()
  $fromDropdown.empty()
  $toDropdown.empty()

  $accountDropdown.append(createSelect('', 'Select account'))
  $fromDropdown.append(createSelect('', 'Select sender account'))
  $toDropdown.append(createSelect('', 'Select destination account'))

  accounts.forEach((a) => {
    $accountDropdown.append(createSelect(a.id, a.username))
    $fromDropdown.append(createSelect(a.id, a.username))
    $toDropdown.append(createSelect(a.id, a.username))
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
  renderAccountDropdowns(Account.getAccounts())
}

function rearrangeForm(transactionType = 'deposit') {
  const $accountDropdown = $('#account-dropdown')
  const $fromDropdown = $('#from-dropdown')
  const $toDropdown = $('#to-dropdown')

  $accountDropdown.show()
  $fromDropdown.hide()
  $toDropdown.hide()

  if (transactionType === 'transfer') {
    $accountDropdown.hide()
    $fromDropdown.show()
    $toDropdown.show()
  }
}

function handleTransactionRadioClick(event) {
  const transactionType = $('input[name="transaction-type"]:checked').val()
  rearrangeForm(transactionType)
}

$(async () => {
  $('#account-form').on('submit', handleAccountSubmit)
  renderAccountDropdowns(await Account.getAccounts())

  $('input[name="transaction-type"]').click(handleTransactionRadioClick)
  rearrangeForm()
})

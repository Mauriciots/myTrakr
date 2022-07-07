class Category {
  constructor(name) {
    this.name = name
  }

  save() {
    const newCategory = this.name
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        url: `${BASE_ENDPOINT}/categories`,
        data: JSON.stringify({ newCategory }),
        dataType: 'json',
        contentType: 'application/json',
      })
        .done((data) => resolve(data))
        .fail((err) => reject(err))
    })
  }

  static getCategories() {
    return new Promise((resolve, reject) => {
      $.ajax(`${BASE_ENDPOINT}/categories`)
        .done((data) => resolve(data))
        .fail((err) => reject(err))
    })
  }
}

const searchBtn = document.getElementById("search-btn")
const bookList = document.getElementById("book")
const bookDetailsContent = document.querySelector(".book-details-content")
const descriptionCloseBtn = document.getElementById("description-close-btn")

//event listeners
searchBtn.addEventListener("click", getBookList)
bookList.addEventListener("click", getBookDescription)
descriptionCloseBtn.addEventListener("click", () => {
  bookDetailsContent.parentElement.classList.remove("showDescription")
})

//https://openlibrary.org/search.json?title=the+lord+of+the+rings

async function getBookList() {
  let searchInputTxt = await document.getElementById("search-input").value.trim()
  await fetch(`https://openlibrary.org/search.json?title=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
      let html = ""
      if (data.numFound > 0) {
        data.docs.forEach(book => {
          if (!book.cover_i || book.title.length > 50) return
          let url = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          html += `
                <div class="book-item" data-id="${book.key.slice(7)}" data-cover="${book.cover_i}" data-fby="${book.first_publish_year}" data-auth="${book.author_name}" data-editions="${book.edition_count}">
                    <div class="book-img">
                        <img src="${url}" alt="" />
                    </div>
                    <div class="book-name">
                        <h3>${book.title}</h3>
                        <a href="#" class="description-btn">Read More</a>
                    </div>
                </div>
            `
        })
        bookList.classList.remove("notFound")
      } else {
        html = "Sorry, we don't have the book you want."
        bookList.classList.add("notFound")
      }
      bookList.innerHTML = html
    })
}

// https://openlibrary.org/works/OL15395994W.json

function getBookDescription(e) {
  e.preventDefault()
  if (e.target.classList.contains("description-btn")) {
    let bookItem = e.target.parentElement.parentElement
    let obj = {
      id: bookItem.dataset.id,
      cover: bookItem.dataset.cover,
      fby: bookItem.dataset.fby,
      auth: bookItem.dataset.auth,
      editions: bookItem.dataset.editions
    }
    fetch(`https://openlibrary.org/works/${obj.id}.json`)
      .then(response => response.json())
      .then(data => {
        obj.data = data
        bookDescriptionModal(obj)
      })
  }
}

//create a Modal
function bookDescriptionModal(obj) {
  let url = `https://covers.openlibrary.org/b/id/${obj.cover}-L.jpg`
  if (typeof obj.data.description == "object") obj.data.description = obj.data.description.value
  if (!obj.data.description) obj.data.description = "Sorry, we couldn't find a description of this book :("

  let html = `
    <h2 class="description-title">${obj.data.title}</h2>
    <p class="description-category">- ${obj.auth}</p>
    <div class="description-instruct">
        <h3>Description:</h3>
        <p>${obj.data.description}</p>
    </div>
    <div class="description-book-img">
        <img src="${url}" alt="" />
    </div>
    <div class="description-bottom">
      <p>First Published : ${obj.fby} <br>
      No. of Editions : ${obj.editions}</p>
    </div>
  `
  bookDetailsContent.innerHTML = html
  bookDetailsContent.parentElement.classList.add("showDescription")
}

//book
class Book {
  constructor(name, author, isbn) {
    this.name = name;
    this.author = author;
    this.isbn = isbn;
  }
}

//store
class Store {
  static getBooks() {
    const books = localStorage.getItem("books");
    return books ? JSON.parse(books) : [];
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    const filterBooks = books.filter((book) => book.isbn !== isbn);
    localStorage.setItem("books",JSON.stringify(filterBooks));
  }
}

//ui side-effects
class UI {
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookTolist(book));
    }

    static addBookTolist(book){
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn-delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static clearFields(){
        Array.from(document.querySelectorAll("#book-list-form input")).forEach(input=> input.value = '');
    }

    static removeBook(el) {
        const isbn = el.target.parentElement;
        const row = isbn.parentElement;
        const list = document.getElementById("book-list");
        list.removeChild(row);
        Store.removeBook(isbn.previousElementSibling.innerText);
        UI.showAlert("Book removed successfully","success");
    }

    static showAlert(message,className){
        const main = document.querySelector(".main");
        const form = document.getElementById("book-list-form");
        const alertMsg = document.createTextNode(`${message}`);

        const alertBox = document.createElement("div");
        alertBox.className = `alert alert-${className}`;
        alertBox.id = "alert";
        alertBox.appendChild(alertMsg);

        main.insertBefore(alertBox,form);
        setTimeout(()=> document.getElementById("alert").remove(),3000);
    }
}

//events: display
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//event: add book
document.getElementById("book-list-form").addEventListener("submit",function(e){
        e.preventDefault();

        const name = document.getElementById("name").value;
        const author = document.getElementById("author").value;
        const isbn = document.getElementById("isbn").value;

        if(name === '' || author === '' || isbn === '' ) return UI.showAlert("Not all field are filled","danger");
        
        const book = new Book(name,author,isbn);

        UI.addBookTolist(book);
        Store.addBook(book);
        UI.clearFields();
        UI.showAlert("Book added succesfully","success");
});

//event: delete book
document.getElementById("book-list").addEventListener("click",function(e){
    if(e.target.classList.contains("btn-delete")){
       UI.removeBook(e);
       Store.removeBook()
    }
})


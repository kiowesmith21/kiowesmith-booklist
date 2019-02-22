//OOP using Javascript

//Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI {
    static displayBooks() {

    const books = Store.getBooks();

    //loop through the array then call the addBookToList function for it
    books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        //add td elements to the row
        //add the book to the td and give it a class
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        //delete row containing the delete button that was clicked
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');

        //set the div's class name
        div.className = `alert alert-${className}`;

        //add the text
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        //insert the alert before the form
        container.insertBefore(div, form);

        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Store Class: Handles Storage
//when adding books you have to make them strings
//when pulling them out of storage, you have to parse them
class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            //pull the book from storage and parse it
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        //add a book and strigify it
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            //if the book's isbn is equal
            //then splice it out of the array
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }

        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    //Prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger')
    } else {
    //if all fields are filled then add the book
    //Instantiate Book
    const book = new Book(title, author, isbn);

    //Add book to UI
    UI.addBookToList(book);

    //Add Book to Store 
    Store.addBook(book);

    //Show success message
    UI.showAlert('Book Added', 'success');

    //Clear Fields
    UI.clearFields();
    }
    
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //remove book from UI
    UI.deleteBook(e.target);

    //Remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

     //Show remove message
     UI.showAlert('Book Removed', 'success');

});
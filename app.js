// Book Class: Represents a Book
class Book{
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks(){
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book)) 
  }

  // Add Book to UI
  static addBookToList(book){
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td class="border px-5 py-3">${book.title}</td>
    <td class="border px-5 py-3">${book.author}</td>
    <td class="border px-5 py-3">${book.isbn}</td>
    <td class="border px-5 py-3"><a href="#" class="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded delete">X</a></td>
    `;
    list.appendChild(row);
  }

  //Remove Book from UI
  static deleteBook(el){
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.remove();
    }
  }

  // Show Alerts
  static showAlert(message, className){
    // Insert Alert div in HTML
    const html = `
    <div class="bg-${className}-100 border-t-4 border-${className}-500 rounded-b text-${className}-900 my-4 px-4 py-3 shadow-md w-6/12" role="alert">
      <div class="flex">
        <div class="py-1"><svg class="fill-current h-6 w-6 text-${className}-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
        <div>
          <p class="font-bold">Get Notice</p>
          <p class="text-sm">${message}</p>
        </div>
      </div>
    </div>`; 
    const alert = document.getElementById('alert');
    alert.innerHTML = html; 

    // Vanish in 3 seconds
    setTimeout(()=> document.getElementById('alert').remove(), 3000);
  }

  // Clear Form Fields
  static clearFields(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.getElementById('book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  // Get Form Values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  // Validate Fields
  if(title === '' || author === '' || isbn === ''){
    // Show Error Message
    UI.showAlert('Please fill the required fields!', 'red');
  }else{
    // Instantiate Book
    const book = new Book(title,author,isbn);
  
    // Add Book to UI
    UI.addBookToList(book);

    // Store Book
    Store.addBook(book);

    // Show Success Message
    UI.showAlert('Thanks for sharing your knowledge with us.', 'green');

    // Clear Fields
    UI.clearFields();  
  }
});

// Event: Remove a Book
document.getElementById('book-list').addEventListener('click', (e) => {
  // Remove Book from UI 
  UI.deleteBook(e.target);

  // Remove Book from localStorage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Success Message
  UI.showAlert('Book removed successfully.', 'green');
});

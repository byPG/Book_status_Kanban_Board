'use strict';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const toReadCol = document.getElementById('toReadColumn');
const readingCol = document.getElementById('readingColumn');
const finishedCol = document.getElementById('finishedColumn');

function getBooks() {
    return JSON.parse(localStorage.getItem('books')) || [];
}

function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}


async function fetchBooks(searchTerm) {
    const url =  `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}`;
   
    try { 
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json();
        return results.items || [];

    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Error fetching books. Please try again later.');
        throw error;
    }
}

function renderSearchResults(books) {
    resultsContainer.innerHTML = '';

    if (books.length === 0) {
        resultsContainer.textContent = 'No books found.';
        return;
    }

    books.forEach((book) => {
        const card = document.createElement('article');
        card.classList.add('book-card');

        const title = document.createElement('h3');
        title.textContent = book.volumeInfo.title || 'No title';

        const author = document.createElement('p');
        author.textContent = book.volumeInfo.authors
            ? book.volumeInfo.authors[0]
            : 'Unknown author';

        const cover = document.createElement('img');
        cover.src = book.volumeInfo.imageLinks?.thumbnail || '';
        cover.alt = book.volumeInfo.title || 'Book cover';

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        
        card.appendChild(title);
        card.appendChild(cover);    
        card.appendChild(author);
        card.appendChild(addBtn);

        resultsContainer.appendChild(card);
    });
}


searchBtn.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        console.error('Please enter a search term');
        alert('Please enter a search term');
        return;
    }

    try {
        const books = await fetchBooks(searchTerm);
        renderSearchResults(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Error fetching books. Please try again later.');
    }
});

searchInput.addEventListener('keydown', async (e) => {
    const searchTerm = searchInput.value.trim();
  if (e.key === 'Enter') {
    if (!searchTerm) {
        console.error('Please enter a search term');
        alert('Please enter a search term');
        return;
    }

    try {
        const books = await fetchBooks(searchTerm);
        renderSearchResults(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Error fetching books. Please try again later.');
    }}
});


// document.addEventListener("DOMContentLoaded", function () {
// const savedBooks = getBooks();

// savedBooks.forEach((book) => {
//     renderBook(book);
// });});
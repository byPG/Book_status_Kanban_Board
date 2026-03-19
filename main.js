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

searchBtn.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        console.error('Please enter a search term');
        alert('Please enter a search term');
        return;
    }

    try {
        const books = await fetchBooks(searchTerm);
        console.log(books);
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
        console.log(books);
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
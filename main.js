'use strict';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const booksToReadCol = document.getElementById('booksToReadColumn');
const readingCol = document.getElementById('readingColumn');
const finishedCol = document.getElementById('finishedColumn');

function getBooks() {
    return JSON.parse(localStorage.getItem('books')) || [];
}

function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

//connect API and fetch books based on search term
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

//render results from API for card  title, author, cover and add button in the page
function renderSearchResults(booksFromAPI) {
    resultsContainer.innerHTML = '';

    if (booksFromAPI.length === 0) {
        resultsContainer.textContent = 'No books found.';
        return;
    }

//render each book from API with usuing foreEch loop
    booksFromAPI.forEach((book) => {
        const title = document.createElement('h4');
        title.textContent = book.volumeInfo.title || 'No title';

        const author = document.createElement('p');
        author.textContent = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unknown author';

        const cover = document.createElement('img');
        cover.src = book.volumeInfo.imageLinks?.thumbnail || 'image.png';
        cover.alt = book.volumeInfo.title || 'Book cover';

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';  
        
        const card = document.createElement('article');
        card.classList.add('book-card');
        
        card.appendChild(title);
        card.appendChild(cover);    
        card.appendChild(author);
        card.appendChild(addBtn);

        resultsContainer.appendChild(card);

        addBtn.addEventListener('click', () => {
            const bookObj = {
                id: book.id,
                title: book.volumeInfo.title || 'No title',
                author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unknown author',
                cover: book.volumeInfo.imageLinks?.thumbnail || 'image.png',
                status: 'to-read',
            };

            const savedBooks = getBooks();
            savedBooks.push(bookObj);
            saveBooks(savedBooks);
            renderBoardWithBooks();
        });

    });
}

//handle search button click and enter key press to trigger search
async function handleSearch(){
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
}

searchBtn.addEventListener('click', () => {
    handleSearch();
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
        handleSearch();
    }
});

//rendering board with books and their status (to-read, reading, finished) and delete button for each book in the board
function renderBoardWithBooks(){
    booksToReadCol.innerHTML = '';
    readingCol.innerHTML = '';
    finishedCol.innerHTML = '';

    const savedBooks = getBooks();

    savedBooks.forEach((book) => {
        const cover = document.createElement('img');
        cover.classList.add('board-book-cover');
        cover.src = book.cover || 'image.png';
        cover.alt = book.title || 'Book cover';
    
        const title = document.createElement('h4');
        title.textContent = book.title || 'No title';

        const author = document.createElement('p');
        author.textContent = book.author || 'Unknown author';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';

        const card = document.createElement('article');
        card.classList.add('book-card', 'board-book-card');    
        
        const info = document.createElement('div');
        info.classList.add('book-info');

        info.appendChild(title);
        info.appendChild(author);
        info.appendChild(deleteBtn);

        card.appendChild(cover);
        card.appendChild(info);

        deleteBtn.addEventListener('click', () => {
            const savedBooks = getBooks();
            const bookIndex = savedBooks.findIndex((item) => item.id === book.id); //return index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.
            if (bookIndex !== -1) {
                savedBooks.splice(bookIndex, 1);
                saveBooks(savedBooks);
                renderBoardWithBooks();
            }
        });

            if (book.status === 'to-read') {
                booksToReadCol.appendChild(card);
            } else { console.log('book not added to the board'); }
            // } else if (book.status === 'reading') {
            //     readingCol.appendChild(card);
            // } else if (book.status === 'finished') {
            //     finishedCol.appendChild(card);
            }
    );};


document.addEventListener("DOMContentLoaded", function () {
    renderBoardWithBooks();
});
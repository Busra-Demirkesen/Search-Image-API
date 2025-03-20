const formElement = document.querySelector('form');
const searchInput = document.getElementById('search-input');
const searchResults = document.querySelector('.search-results');
const showMoreButton = document.getElementById('show-more-button');

let inputData = '';
let page = 1;

async function searchImages() {
  inputData = searchInput.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

  const response = await fetch(url);
  const data = await response.json();

  const results = data.results;
  if (page === 1) {
    searchResults.innerHTML = '';
  }

  results.forEach((result) => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('search-result');

    const image = document.createElement('img');
    image.src = result.urls.small;
    image.alt = result.alt_description;
    image.dataset.id = result.id;
    image.dataset.largeImage = result.urls.full;

    const imageLink = document.createElement('a');
    imageLink.href = result.links.html;
    imageLink.target = '_blank';
    imageLink.textContent = result.alt_description;

    const photographer = document.createElement('p');
    const photographerLink = document.createElement('a');
    photographerLink.href = result.user.links.html;
    photographerLink.target = '_blank';
    photographerLink.textContent = `📸 ${result.user.name}`;
    photographer.appendChild(photographerLink);

    const likeButton = document.createElement('button');
    likeButton.textContent = '🤍';
    likeButton.classList.add('like-button');
    likeButton.dataset.id = result.id;

    const fullScreenButton = document.createElement('button');
    fullScreenButton.textContent = '⛶';
    fullScreenButton.classList.add('fullscreen-button');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('like-fullscreen-button-container');
    buttonContainer.appendChild(likeButton);
    buttonContainer.appendChild(fullScreenButton);

    imageContainer.appendChild(image);
    imageContainer.appendChild(buttonContainer);
    imageContainer.appendChild(imageLink);
    imageContainer.appendChild(photographer);
    searchResults.appendChild(imageContainer);
  });

  attachEventListeners();

  page++;
  if (page > 1) {
    showMoreButton.style.display = 'block';
  }
}

function toggleLike(event) {
  const button = event.target;
  const imageId = button.dataset.id;
  let likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];

  if (likedImages.includes(imageId)) {
    likedImages = likedImages.filter((id) => id !== imageId);
    button.textContent = '🤍';
    button.classList.remove('liked');
  } else {
    likedImages.push(imageId);
    button.textContent = '🖤';
    button.classList.add('liked');
  }

  localStorage.setItem('likedImages', JSON.stringify(likedImages));
}

function toggleFullScreen(event) {
  const imageElement = event.target.closest('.search-result').querySelector('img');
  if (!imageElement) return;

  const largeImageUrl = imageElement.dataset.largeImage || imageElement.src;


  const overlay = document.createElement('div');
  overlay.id = 'fullscreen-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; 
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '999';


  const fullScreenImage = document.createElement('img');
  fullScreenImage.id = 'fullscreen-image';
  fullScreenImage.src = largeImageUrl;
  fullScreenImage.style.maxWidth = '90vw';
  fullScreenImage.style.maxHeight = '90vh';
  fullScreenImage.style.borderRadius = '10px';
  fullScreenImage.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';


  overlay.addEventListener('click', closeFullScreen);
  fullScreenImage.addEventListener('click', (e) => e.stopPropagation());

  overlay.appendChild(fullScreenImage);
  document.body.appendChild(overlay);


  document.addEventListener('keydown', handleEscape);
}

function closeFullScreen() {
  const overlay = document.getElementById('fullscreen-overlay');
  if (overlay) {
    overlay.remove();
    document.removeEventListener('keydown', handleEscape);
  }
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    closeFullScreen();
  }
}



function attachEventListeners() {
  document.querySelectorAll('.like-button').forEach((button) => {
    button.removeEventListener('click', toggleLike);
    button.addEventListener('click', toggleLike);
  });

  document.querySelectorAll('.fullscreen-button').forEach((button) => {
    button.removeEventListener('click', toggleFullScreen);
    button.addEventListener('click', toggleFullScreen);
  });
}

formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
  searchInput.value = '';
});

showMoreButton.addEventListener('click', searchImages);

document.addEventListener('DOMContentLoaded', attachEventListeners);
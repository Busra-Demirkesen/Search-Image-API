

const formElement = document.querySelector('form');

const searchInput = document.getElementById('search-input');

const searchResults = document.querySelector('.search-results');
const showMoreButton = document.getElementById('show-more-button');


let inputData = "";
let page = 1;

async function searchImages(){
    inputData =searchInput.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;
    console.log(results);

    if(page ===1){
        searchResults.innerHTML = "";

    }

    results.map((result) =>{
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('search-result');
        const image = document.createElement('img');
        image.src = result.urls.small;
        image.alt = result.alt_description;

        const imageLink = document.createElement('a');
        imageLink.href = result.links.html;
        imageLink.target = '_blank';
        imageLink.textContent = result.alt_description;

        imageContainer.appendChild(image);
        imageContainer.appendChild(imageLink);
        searchResults.appendChild(imageContainer);


    });

    page++;
    if(page >1){
        showMoreButton.style.display='block';
    }
   
}

formElement.addEventListener('submit', (e)=>{
    e.preventDefault();
    page = 1;
    searchImages();

   
    
});  

showMoreButton.addEventListener('click', ()=>{
    searchImages();
});

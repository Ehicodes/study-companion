'use strict';

// Where the folder pills go, the "+ New folder" button
const folderList = document.querySelector('.folder-pills');
const btnNewFolder = document.querySelector('.materials__new-folder');
const folderModal = document.querySelector('#folder-modal')
const folderForm = document.querySelector('#folder-form')
const folderInput = document.querySelector('#folder-name')
const folderError = document.querySelector('#folder-error')
const folderCancelBtn = document.querySelector('#folder-cancel')

// The saved list of folder names (an empty list on the first visit)
const folders = load('allFolders', []);

// Draws ONE folder pill on the page
const generateMarkup = function (folderName) {
  const markup = `
    <li>
      <button class="folder-pill">
        ${folderName} <span class="folder-pill__count">0</span>
      </button>
    </li>
  `;
  folderList.insertAdjacentHTML('beforeend', markup);
};

// When "+ New folder" is clicked
btnNewFolder.addEventListener('click', function () {
     folderModal.showModal()
});

// On page load: draw every saved folder once
const renderPill = function () {
  folders.forEach(folderName => generateMarkup(folderName));
};

// Hide the error message and remove the red styling
const clearFolderError = function () {
  folderError.hidden = true;
  folderError.textContent = '';
  folderInput.removeAttribute('aria-invalid');
};

folderCancelBtn.addEventListener('click', function() {
    folderModal.close()
})

folderForm.addEventListener('submit', function(e) {
  e.preventDefault()
  const newName = folderInput.value
    
  // Remove extra spaces once, then use cleanName everywhere below
  const cleanName = newName.trim();

  // Stop if the name is blank
  if (cleanName === '') {
     folderError.textContent = 'Folder name cannot be blank'
     folderError.hidden = false
     folderInput.setAttribute('aria-invalid', 'true')
     return
  };

  // Is there already a folder with this name? (ignoring capital letters)
  const exists = folders.some(
    folder => folder.toLowerCase() === cleanName.toLowerCase()
  );

  if (exists) {
    folderError.textContent = 'Folder already exists!'
    folderError.hidden = false
    folderInput.setAttribute('aria-invalid', 'true')
    return;
  }

  folders.push(cleanName); // add it to the list
  save('allFolders', folders); // save the whole list
  generateMarkup(cleanName); // draw only the new pill
  folderModal.close() //Close modal
})

// Clear the error as soon as the user types
folderInput.addEventListener('input', clearFolderError);

folderModal.addEventListener('close', function() {
    clearFolderError()
    folderInput.value = '' //Clear input
})


renderPill();

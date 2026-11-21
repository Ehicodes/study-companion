'use strict';

// Where the folder pills go, and the "+ New folder" button
const folderList = document.querySelector('.folder-pills');
const btnNewFolder = document.querySelector('.materials__new-folder');

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
  const newName = prompt('What would you name your folder?');

  // Cancel gives null, so stop 
  if (newName === null) return;

  // Remove extra spaces once, then use cleanName everywhere below
  const cleanName = newName.trim();

  // Stop if the name is blank
  if (cleanName === '') return;

  // Is there already a folder with this name? (ignoring capital letters)
  const exists = folders.some(
    folder => folder.toLowerCase() === cleanName.toLowerCase()
  );

  if (exists) {
    alert('Folder already exists!');
    return;
  }

  folders.push(cleanName); // add it to the list
  save('allFolders', folders); // save the whole list
  generateMarkup(cleanName); // draw only the new pill
});

// On page load: draw every saved folder once
const renderPill = function () {
  folders.forEach(folderName => generateMarkup(folderName));
};

renderPill();
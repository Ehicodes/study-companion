"use strict";

// Where the folder pills go, the "+ New folder" button
const folderList = document.querySelector(".folder-pills");
const folderNewBtn = document.querySelector(".materials__new-folder");
const folderModal = document.querySelector("#folder-modal");
const folderForm = document.querySelector("#folder-form");
const folderInput = document.querySelector("#folder-name");
const folderError = document.querySelector("#folder-error");
const folderCancelBtn = document.querySelector("#folder-cancel");
const materialModal = document.querySelector("#material-modal");
const materialForm = document.querySelector("#material-form");
const materialType = document.querySelector("#material-type");
const materialFolder = document.querySelector("#material-folder");
const materialLink = document.querySelector("#material-link");
const materialNote = document.querySelector("#material-note");
const materialError = document.querySelector("#material-error");
const materialCancelBtn = document.querySelector("#material-cancel");
const materialTitle = document.querySelector("#material-title");
const addMaterialBtns = document.querySelectorAll(
  ".material__add, .material--add",
);
// const modalField = document.querySelector('.modal__field')

// The saved list of folder names (an empty list on the first visit)
const folders = load("allFolders", []);
const materials = load("materials", []);

// Draws ONE folder pill on the page
const generateMarkup = function (folderName) {
  const markup = `
    <li>
      <button class="folder-pill">
        ${folderName} <span class="folder-pill__count">0</span>
      </button>
    </li>
  `;
  folderList.insertAdjacentHTML("beforeend", markup);
};

// When "+ New folder" is clicked
folderNewBtn.addEventListener("click", function () {
  folderModal.showModal();
});

// On page load: draw every saved folder once
const renderPill = function () {
  folders.forEach((folderName) => generateMarkup(folderName));
};

// Hide the error message and remove the red styling
const clearFolderError = function () {
  folderError.hidden = true;
  folderError.textContent = "";
  folderInput.removeAttribute("aria-invalid");
};

folderCancelBtn.addEventListener("click", function () {
  folderModal.close();
});

folderForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newName = folderInput.value;

  // Remove extra spaces once, then use cleanName everywhere below
  const cleanName = newName.trim();

  // Stop if the name is blank
  if (cleanName === "") {
    folderError.textContent = "Folder name cannot be blank";
    folderError.hidden = false;
    folderInput.setAttribute("aria-invalid", "true");
    return;
  }

  // Is there already a folder with this name? (ignoring capital letters)
  const exists = folders.some(
    (folder) => folder.toLowerCase() === cleanName.toLowerCase(),
  );

  if (exists) {
    folderError.textContent = "Folder already exists!";
    folderError.hidden = false;
    folderInput.setAttribute("aria-invalid", "true");
    return;
  }

  folders.push(cleanName); // add it to the list
  save("allFolders", folders); // save the whole list
  generateMarkup(cleanName); // draw only the new pill
  folderModal.close(); //Close modal
});

// Clear the error as soon as the user types
folderInput.addEventListener("input", clearFolderError);

folderModal.addEventListener("close", function () {
  clearFolderError();
  folderInput.value = ""; //Clear input
});

renderPill();

const openMaterialModal = function () {
  materialFolder.textContent = "";

  if (folders.length === 0) {
    const markup = `<option disabled selected> Create a folder first</option>`;
    materialFolder.insertAdjacentHTML("beforeend", markup);
  }

  folders.forEach((folderName) => {
    const markup = `
          <option value="${folderName}">${folderName}</option>
        `;

    materialFolder.insertAdjacentHTML("beforeend", markup);
  });

  materialModal.showModal();
};

addMaterialBtns.forEach((btn) =>
  btn.addEventListener("click", openMaterialModal),
);

materialCancelBtn.addEventListener("click", function () {
  materialModal.close();
});

materialForm.addEventListener("submit", function (e) {
  e.preventDefault();
  clearMaterialError();

  if (folders.length === 0) {
    materialError.textContent = "Create a folder first.";
    materialError.hidden = false;
    return;
  }

  const title =  materialTitle.value.trim()
  const type = materialType.value
  const link = materialLink.value.trim()
  const note = materialNote.value.trim()
  const folder = materialFolder.value


  if(title === '') {
       materialError.textContent = "Please give your material a title";
       materialError.hidden = false;
       materialTitle.setAttribute("aria-invalid", "true");

       return
  }
  
  const material = {
    id: Date.now(),
    title: title,
    type: type,
    folder: folder,
    link: link,
    note: note,
    status: 'to study',  // always this for a new one; no variable needed
    addedAt: Date.now(),
 }

 materials.push(material)

 save('materials', materials)

 materialModal.close()

});

const clearMaterialError = function () {
  materialError.textContent = "";
  materialError.hidden = true;
  materialTitle.removeAttribute('aria-invalid')
};

materialModal.addEventListener("close", function () {
  materialForm.reset();
  clearMaterialError();
});

materialTitle.addEventListener("input", clearMaterialError);

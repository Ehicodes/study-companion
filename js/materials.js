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
const materialAdd = document.querySelector(".material--add");
const addMaterialBtns = document.querySelectorAll(".material__add, .material--add",);
const chips = document.querySelectorAll('.chip')
const searchInput = document.querySelector('.search')


// The saved list of folder names (an empty list on the first visit)
const folders = load("allFolders", []);

// The saved list of material objects (an empty list on the first visit)
const materials = load("materials", []);

const labels = {
  pdf: 'PDF',
  notes: 'Notes',
  slides: 'Slides',
  link: 'Link',
}

// Draws ONE folder pill on the page
const generateFolderMarkup = function (folderName) {
  const markup = `
    <li>
      <button class="folder-pill" data-folder="${folderName}">
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
  folders.forEach((folderName) => generateFolderMarkup(folderName));
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
  generateFolderMarkup(cleanName); // draw only the new pill
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

const generateMaterialMarkup  = function(material) {
  const markup = `
      <li class="material">
        <span class="material__type material__type--${material.type}">${labels[material.type]}</span>
        <h2 class="material__title">${material.title}</h2>
        <p class="material__folder">${material.folder}</p>
        <p class="material__meta"><span>${material.status}</span><span>${new Date(material.addedAt).toLocaleDateString()}</span></p>
      </li>
  `
  materialAdd.closest('li').insertAdjacentHTML('beforebegin', markup)
}

// On page load: draw every saved material once
// const renderMaterial = function () {
//   materials.forEach((material) => generateMaterialMarkup(material))
// };

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

//  generateMaterialMarkup(material)
 renderMaterials()

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

// State: what the user has chosen so far
let activeFolder = "" // '' means "All folders"
let activeType  = "all"
let searchText = ""

// Rebuild the cards on the page from the saved materials
const renderMaterials = function() {
  // 1. Keep only the materials that match all three choices
  const visible = materials.filter(material => {
    const folderMatch = activeFolder === "" || material.folder === activeFolder
    const typeMatch = activeType === "all" || material.type === activeType
    const searchMatch = material.title.toLowerCase().includes(searchText) || material.note.toLowerCase().includes(searchText)

    return folderMatch && typeMatch && searchMatch
  })


 // 2. Remove the cards on the page now (the dashed add card has no .material on its li)
document.querySelectorAll(".material-grid > li.material").forEach(card => {
  card.remove()
})

// 3. Draw each item that passed conditions
 visible.forEach(material => {
  generateMaterialMarkup(material)
 })

}

 // Type chips
 chips.forEach(chip => {
    chip.addEventListener('click', () => {
      activeType = chip.dataset.type

     chips.forEach(function (c) {
          c.classList.remove("chip--active");
    });
    chip.classList.add("chip--active");

    renderMaterials();

    })
 })

// Folder pills (event delegation: one listener on the list)
folderList.addEventListener('click', function(e) {
  const pill = e.target.closest('.folder-pill')
  if (!pill) return

  activeFolder = pill.dataset.folder

  folderList.querySelectorAll("folder-pill").forEach(p => {
    p.classList.remove('folder-pill--acive')
  })

    pill.classList.add('folder-pill--acive')

    renderMaterials()
})

// Search box
searchInput.addEventListener('input', function() {
   searchText = searchInput.value.trim().toLowerCase();
   renderMaterials();
})

// renderMaterial();
renderMaterials();
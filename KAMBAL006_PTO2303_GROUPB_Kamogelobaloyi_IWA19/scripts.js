if (!books && !Array.isArray(books)) throw new Error("Source required");
// if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

let css = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },

  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};

// Open Search Overlay
document.querySelector("[data-header-search]").onclick = function () {
  document.querySelector("[data-search-overlay]").setAttribute("open", true);
  document.querySelector("[data-search-title]").focus();
};
// Close Search Overlay
document.querySelector("[data-search-cancel]").onclick = function () {
  document.querySelector("[data-search-overlay]").removeAttribute("open");
};

// Open Settings Overlay
document.querySelector("[data-header-settings]").onclick = function () {
  document.querySelector("[data-settings-overlay]").setAttribute("open", true);
};
// Close Settings Overlay
document.querySelector("[data-settings-cancel]").onclick = function () {
  document.querySelector("[data-settings-overlay]").removeAttribute("open");
};

// Theme Setting
document.querySelector("[data-settings-form]").onsubmit = function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);

  document.documentElement.style.setProperty(
    "--color-dark",
    css[result.theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    css[result.theme].light
  );

  document.querySelector("[data-settings-overlay]").removeAttribute("open");
};

document.querySelector("[data-settings-theme]").value === window.matchMedia &&
window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "night"
  : "day";
v =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day";

document.documentElement.style.setProperty("--color-dark", css[v].dark);
document.documentElement.style.setProperty("--color-light", css[v].light);

// Extracting books
const extracted1 = books.slice(0, BOOKS_PER_PAGE);

// Preparing previews
let preview = "";
for (let i = 0; i < extracted1.length; i++) {
  preview += createPreview(extracted1[i]);
}

// Selecting and filling in all the previews
document.querySelector("[data-list-items]").innerHTML = preview;

// Binding each preview to open overlay
// document.querySelectorAll("[data-preview]").forEach(preview => {
//     preview.onclick = function(event) {
//         let id = event.target.dataset.id;
//     }
// })

// Creating preview
function createPreview(book) {
  let html = `
    <div class="preview" data-id="${book.id}" data-preview>
        <img src="${book.image}" alt="" class="preview__image">
        <div class="preview__info">
            <h3 class="preview__title">${book.title}</h3>
            <small class="preview__author">${authors[book.author]}</small>
        </div>
    </div>`;
  return html;
}

// Filling genres
let genresEl = document.querySelector("[data-search-genres]");
let genresElement = document.createElement("option");
genresElement.value = "any";
genresElement.innerText = "All Genres";
genresEl.appendChild(genresElement);

for (const [key, value] of Object.entries(genres)) {
  let genresElement = document.createElement("option");
  genresElement.value = key;
  genresElement.innerText = value;
  genresEl.appendChild(genresElement);
}

// Filling Authors
let authorsEl = document.querySelector("[data-search-authors]");
let authorsElement = document.createElement("option");
authorsElement.value = "any";
authorsElement.innerText = "All Authors";
authorsEl.appendChild(authorsElement);

for (const [key, value] of Object.entries(authors)) {
  let authorsElement = document.createElement("option");
  authorsElement.value = key;
  authorsElement.innerText = value;
  authorsEl.appendChild(authorsElement);
}

// Pagination
let matches = books;
let page = 1;

// Enabling and disabling the list button
document.querySelector("[data-list-button]").disabled = !(
  matches.length - [page * BOOKS_PER_PAGE] >
  0
);

document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> 
        (${
          matches.length - [page * BOOKS_PER_PAGE] > 0
            ? matches.length - [page * BOOKS_PER_PAGE]
            : 0
        })
    </span>`;

// Pagination load more functioning
document.querySelector("[data-list-button]").onclick = function () {
  let selection = books.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  );

  console.log(selection);

  for (let i = 0; i < selection.length; i++) {
    preview += createPreview(selection[i]);
  }

  // Selecting and filling in all the previews
  document.querySelector("[data-list-items]").innerHTML = preview;

  page = page + 1;

  document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> 
        (${
          matches.length - [page * BOOKS_PER_PAGE] > 0
            ? matches.length - [page * BOOKS_PER_PAGE]
            : 0
        })
    </span>`;

  // Enabling and disabling the list button
  document.querySelector("[data-list-button]").disabled = !(
    matches.length - [page * BOOKS_PER_PAGE] >
    0
  );
};

// Performing Search
document.querySelector("[data-search-form]").onsubmit = function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  console.log(filters);
  let result = [];

  for (let i = 0; i < books.length; i++) {
    titleMatch =
      filters.title.trim() == "" ||
      books[i].title.toLowerCase().includes(filters.title.toLowerCase());

    authorMatch = filters.author == "any" || books[i].author == filters.author;

    genreMatch = filters.genre == "any";

    for (let j = 0; j < books[i].genres.length; j++) {
      if (books[i].genres[j] == filters.genre) {
        genreMatch = true;
      }
    }

    if (titleMatch && authorMatch && genreMatch) {
      result.push(books[i]);
    }
  }

  if (result.length < 1) {
    document
      .querySelector("[data-list-message]")
      .classList.add("list__message_show");
  } else {
    document
      .querySelector("[data-list-message]")
      .classList.remove("list__message_show");
  }

  document.querySelector("[data-list-items]").innerHTML = "";
  console.log(result);

  let preview = "";
  for (let i = 0; i < result.length; i++) {
    preview += createPreview(result[i]);
  }

  document.querySelector("[data-list-items]").innerHTML = preview;

  // Pagination
  let matches = result;
  let page = 1;

  // Enabling and disabling the list button
  document.querySelector("[data-list-button]").disabled = !(
    matches.length - [page * BOOKS_PER_PAGE] >
    0
  );

  document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> 
        (${
          matches.length - [page * BOOKS_PER_PAGE] > 0
            ? matches.length - [page * BOOKS_PER_PAGE]
            : 0
        })
    </span>`;

  // Pagination load more functioning
  document.querySelector("[data-list-button]").onclick = function () {
    let selection = result.slice(
      page * BOOKS_PER_PAGE,
      (page + 1) * BOOKS_PER_PAGE
    );

    console.log(selection);

    for (let i = 0; i < selection.length; i++) {
      preview += createPreview(selection[i]);
    }

    // Selecting and filling in all the previews
    document.querySelector("[data-list-items]").innerHTML = preview;

    page = page + 1;

    document.querySelector("[data-list-button]").innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> 
          (${
            matches.length - [page * BOOKS_PER_PAGE] > 0
              ? matches.length - [page * BOOKS_PER_PAGE]
              : 0
          })
      </span>`;

    // Enabling and disabling the list button
    document.querySelector("[data-list-button]").disabled = !(
      matches.length - [page * BOOKS_PER_PAGE] >
      0
    );
  };

  window.scrollTo({ top: 0, behavior: "smooth" });

  // dataset.searchOverlay.open = false;
  document.querySelector("[data-search-overlay]").removeAttribute("open");
};

// Opening the preview active overlay
document.querySelector("[data-list-items]").onclick = function (event) {
  let pathArray = Array.from(event.path || event.composedPath());
  let active;

  for (let i = 0; i < pathArray.length; i++) {
    if (active) break;
    const previewId = pathArray[i]?.dataset?.id;

    for (const singleBook of books) {
      if (singleBook.id === previewId) {
        active = singleBook;
      }
    }
  }

  if (!active) return;

  document.querySelector("[data-list-active]").setAttribute("open", true);
  document.querySelector("[data-list-blur]").src = active.image;
  document.querySelector("[data-list-image]").src = active.image;
  document.querySelector("[data-list-title]").innerHTML = active.title;

  document.querySelector("[data-list-subtitle]").innerHTML = `${
    authors[active.author]
  } (${new Date(active.published).getFullYear()})`;

  document.querySelector("[data-list-description]").innerHTML =
    active.description;
};

// Closing the active overlay
document.querySelector("[data-list-close]").onclick = function () {
  document.querySelector("[data-list-active]").removeAttribute("open");
};

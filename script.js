import { BOOKS_PER_PAGE, authors, books } from "./components/data.js";
import { selectors, css, innerHTML } from "./components/utilities.js";
import { loadedTracker } from "./components/helper.js";

const previewLoading = loadedTracker(books);
let filteredBooks;
let filterLoading;
let formValues;

const loadBooks = (booksArray, loadingTracker) => {
  loadingTracker.increase();
  loadingTracker.checker();

  for (let i = loadingTracker.refValue(); i < loadingTracker.loaded(); i++) {
    if (i === booksArray.length) {
      selectors.loadMore.disabled = true;
      break;
    } else {
      let book = booksArray[i][0];
      let index = booksArray[i][1];
      selectors.list.appendChild(innerHTML(book, index));
    }
  }
};

const moreBooksHandler = (e) => {
  e.stopPropagation();
  loadBooks(books, previewLoading);
};

const filterMoreHandler = (e) => {
  if (!filteredBooks) {
    return;
  }

  loadBooks(filteredBooks, filterLoading);
};

const openOverlayHandler = (e) => {
  const overlay = selectors.previewOverlay.overlay;
  const bookPreview = e.target.closest(".preview");
  const index = bookPreview.dataset.index;

  selectors.previewOverlay.overlayBlur.src = books[index].image;
  selectors.previewOverlay.overlayImage.src = books[index].image;
  selectors.previewOverlay.titleOverlay.textContent = books[index].title;

  let dateOverlay = new Date(books[index].published).getFullYear();
  selectors.previewOverlay.dataOverlay.textContent = `${authors[books[index].author]} (${dateOverlay})`;
  selectors.previewOverlay.infoOverlay.textContent = books[index].description;

  overlay.show();
};

const themeManager = {
  toggleHandler: (e) => {
    const darkMode = getComputedStyle(document.body).backgroundColor === `rgb(${css.night.light})`;
    selectors.theme.themeSelect.value = darkMode ? "night" : "day";

    const overlay = selectors.theme.themeOverlay;
    const closeBtn = selectors.theme.themeCancelBtn;
    overlay.show();

    if (e.target === closeBtn) {
      overlay.close();
    }
  },

  submitHandler: (e) => {
    e.preventDefault();

    const overlay = selectors.theme.themeOverlay;
    const formData = new FormData(e.target);
    const themeChoice = Object.fromEntries(formData);
    const theme = themeChoice.theme;

    document.documentElement.style.setProperty("--color-dark", css[theme].dark);
    document.documentElement.style.setProperty("--color-light", css[theme].light);
    overlay.close();
  },
};

const searchToggleHandler = (e) => {
  const overlay = selectors.search.searchOverlay;
  const closeBtn = selectors.search.searchCancelBtn;
  overlay.show();

  if (formValues) {
    selectors.genresSelect.value = formValues.genre;
    selectors.authorSelect.value = formValues.author;
    selectors.title.value = formValues.title;
  }

  if (e.target === closeBtn) {
    overlay.close();
    selectors.search.searchForm.reset();
  }
};

const filterBooks = (filters) => {
  const result = [];

  books.forEach((book, index) => {
    const { title, author, genres } = book;
    const categories = [...genres];

    const genreMatch = categories.includes(filters.genre) || filters.genre === "All";
    const authorMatch = author === filters.author || filters.author === "All";
    const titleMatch = title.toLowerCase().includes(filters.title.toLowerCase()) || filters.title === "";

    if (authorMatch && genreMatch && titleMatch) {
      result.push([book, index]);
    }
  });

  return result;
};

const updateDOM = (booksArray) => {
  const previews = selectors.list.querySelectorAll(".preview");

  for (const book of previews) {
    book.remove();
  }

  if (booksArray.length === 0) {
    selectors.message.classList.add("list__message_show");
    selectors.loadMore.disabled = true;
    selectors.loadMore.querySelector(".list__remaining").textContent = "(0)";
  } else {
    selectors.message.classList.remove("list__message_show");
    selectors.loadMore.disabled = false;
  }

  if (booksArray.length < BOOKS_PER_PAGE) {
    for (let i = 0; i < booksArray.length; i++) {
      let book = booksArray[i][0];
      let index = booksArray[i][1];
      selectors.list.appendChild(innerHTML(book, index));
      selectors.loadMore.disabled = true;
      selectors.loadMore.querySelector(".list__remaining").textContent = "(0)";
    }
  } else {
    for (let i = 0; i < BOOKS_PER_PAGE; i++) {
      let book = booksArray[i][0];
      let index = booksArray[i][1];
      selectors.list.appendChild(innerHTML(book, index));
      selectors.loadMore.querySelector(".list__remaining").textContent = `(${booksArray.length - BOOKS_PER_PAGE})`;
      selectors.loadMore.removeEventListener("click", moreBooksHandler);
      filteredBooks = booksArray;
      filterLoading = loadedTracker(filteredBooks);
    }
  }
};

const searchSubmitHandler = (e) => {
  e.preventDefault();
  const overlay = selectors.search.searchOverlay;
  const formData = new FormData(e.target);
  const filters = Object.fromEntries(formData);

  const result = filterBooks(filters);
  updateDOM(result);

  overlay.close();
  window.scrollTo({ top: 0, behavior: "smooth" });
  formValues = filters;
};

selectors.loadMore.addEventListener("click", moreBooksHandler);
selectors.loadMore.addEventListener("click", filterMoreHandler);
selectors.list.addEventListener("click", openOverlayHandler);
selectors.previewOverlay.overlayBtn.addEventListener("click", () => {
  selectors.previewOverlay.overlay.close();
});

selectors.theme.themeBtn.addEventListener("click", themeManager.toggleHandler);
selectors.theme.themeCancelBtn.addEventListener("click", themeManager.toggleHandler);
selectors.theme.themeForm.addEventListener("submit", themeManager.submitHandler);
selectors.search.searchBtn.addEventListener("click", searchToggleHandler);
selectors.search.searchCancelBtn.addEventListener("click", searchToggleHandler);
selectors.search.searchForm.addEventListener("submit", searchSubmitHandler);

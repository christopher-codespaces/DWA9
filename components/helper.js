import { selectors, getHtmlElement } from "./utilities.js";
import { BOOKS_PER_PAGE } from "./data.js";

/**
 * Represents the web component for the book preview.
 */
class BookPreview extends HTMLElement {
  constructor() {
    super();
    // Initialize the component's state or properties
  }

  /**
   * Lifecycle method that is called when the component is added to the DOM.
   * Performs actions such as rendering the component and setting up event listeners.
   */
  connectedCallback() {
    this.render();
    // Add event listeners or perform other setup tasks
  }

  /**
   * Lifecycle method that is called when the component is removed from the DOM.
   * Cleans up resources such as event listeners.
   */
  disconnectedCallback() {
    // Clean up tasks when the component is removed from the DOM
    // Remove event listeners or other resources
  }

  /**
   * Renders the component by generating the HTML markup based on its state or properties.
   */
  render() {
    const booksLeft = this.prop.length - BOOKS_PER_PAGE - this.tracker;
    const btnText = booksLeft > 0 ? booksLeft : 0;

    this.innerHTML = `
      <button class="list__remaining" data-selector="${selectors.loadMore}">
        (${btnText})
      </button>
    `;
  }

  /**
   * Increases the tracker value and triggers a re-render of the component.
   */
  increase() {
    this.tracker += BOOKS_PER_PAGE;
    this.render();
  }

  /**
   * Returns the number of loaded books.
   * @returns {number} Number of loaded books.
   */
  loaded() {
    return BOOKS_PER_PAGE + this.tracker;
  }
}

// Register the 'book-preview' web component
customElements.define("book-preview", BookPreview);

/**
 * Represents the loaded tracker object.
 */
class LoadedTracker {
  /**
   * Constructs a new LoadedTracker object.
   * @param {Array} prop - Array of books.
   * @throws {Error} If prop is not an array.
   */
  constructor(prop) {
    if (typeof prop !== "object" || prop === null) {
      throw new Error(
        `Expected an array for 'prop', received ${typeof prop}.`
      );
    }

    this.prop = prop;
    this.tracker = 0;
  }

  /**
   * Increases the tracker value and triggers the increase of the associated button component.
   */
  increase() {
    this.tracker += BOOKS_PER_PAGE;
    const button = getHtmlElement(".list__remaining", selectors.loadMore);
    button.increase();
  }

  /**
   * Returns the number of loaded books.
   * @returns {number} Number of loaded books.
   */
  loaded() {
    return BOOKS_PER_PAGE + this.tracker;
  }
}

/**
 * Factory function for creating a loaded tracker object.
 * @param {Array} prop - Array of books.
 * @returns {LoadedTracker} Loaded tracker object.
 */
const loadedTracker = (prop) => {
  return new LoadedTracker(prop);
};

export { loadedTracker };

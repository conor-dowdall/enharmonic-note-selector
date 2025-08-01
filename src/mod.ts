/**
 * A custom HTML element that allows users to select an enharmonic note.
 *
 * This component displays a primary button which, when clicked, opens a modal
 * dialog. The dialog presents a list of all enharmonic equivalents for each
 * pitch class, allowing the user to select a specific note.
 *
 * Key Features:
 * - **Interactive Display:** Renders a clickable button displaying the
 * currently selected note (or a default symbol).
 * - **Enharmonic Selection Dialog:** Provides a comprehensive dialog for
 * choosing any enharmonic note from all available pitch classes.
 * - **Theming Support:** Allows customization of note-specific colors
 * (e.g., for underlines) via CSS custom properties.
 * - **Event-Driven:** Dispatches a custom event when a note is successfully
 * selected, providing the note name and its corresponding note integer.
 * - **Programmatic Control:** Exposes public properties for getting/setting
 * the selected note's name and note integer.
 * - **Attribute Synchronization:** Supports setting the initial selected note
 * via an HTML attribute.
 * - **Random Selection:** Includes a public method to programmatically select a
 * random note, useful for demonstrations or practice applications.
 *
 * @example
 * ```html
 * <enharmonic-note-selector selected-note-name="C"></enharmonic-note-selector>
 * ```
 *
 * @example
 * ```css
 * <style>
 *   enharmonic-note-selector {
 *     --note-color-0: #FF0000;
 *     --note-color-1: #FFA500;
 *     ...
 *   }
 * </style>
 * ```
 *
 * @module EnharmonicNoteSelector
 * @element enharmonic-note-selector
 * @fires EnharmonicNoteSelectedEvent
 * @attr {string} selected-note-name - The name of the currently selected note (e.g., "C", "D♯", "E♭").
 * @cssprop {<length>} [--enharmonic-note-selector-padding=0] - Controls the padding inside the primary note selection button,
 * which is included in its clickable area. The padding property may be specified using one, two, three, or four values.
 * Each value is a <length> or a <percentage>. Negative values are invalid.
 * @cssprop {<color>} [--note-color-0=transparent] - Color for note integer 0 (C, B♯, D𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-1=transparent] - Color for note integer 1 (C♯, D♭). Used for underline color.
 * @cssprop {<color>} [--note-color-2=transparent] - Color for note integer 2 (D, C𝄪, E𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-3=transparent] - Color for note integer 3 (D♯, E♭). Used for underline color.
 * @cssprop {<color>} [--note-color-4=transparent] - Color for note integer 4 (E, F♭, D𝄪). Used for underline color.
 * @cssprop {<color>} [--note-color-5=transparent] - Color for note integer 5 (F, E♯). Used for underline color.
 * @cssprop {<color>} [--note-color-6=transparent] - Color for note integer 6 (F♯, G♭). Used for underline color.
 * @cssprop {<color>} [--note-color-7=transparent] - Color for note integer 7 (G, F𝄪, A𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-8=transparent] - Color for note integer 8 (G♯, A♭). Used for underline color.
 * @cssprop {<color>} [--note-color-9=transparent] - Color for note integer 9 (A, G𝄪, 𝄫♭). Used for underline color.
 * @cssprop {<color>} [--note-color-10=transparent] - Color for note integer 10 (A♯, 𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-11=transparent] - Color for note integer 11 (B, C♭, A𝄪). Used for underline color.
 */

import {
  enharmonicNoteNameGroups,
  type NoteColorGroup,
  type NoteInteger,
  type NoteName,
} from "@musodojo/music-theory-data";

/**
 * HTML template for the `enharmonic-note-selector` custom element.
 * @private
 * @type {HTMLTemplateElement}
 */
const enharmonicNoteSelectorTemplate = document.createElement("template");
enharmonicNoteSelectorTemplate.innerHTML = /* HTML */ `
  <style>
    :host {
      /* This custom property is used to pass user-defined padding from the light DOM
         into the Shadow DOM, specifically for the interactive button. */
      --_enharmonic-note-selector-padding: var(
        --enharmonic-note-selector-padding,
        0
      );

      /* Internal CSS custom properties for note colors, falling back to transparent.
         These are used to style the underline of notes based on their note integer. */
      --_note-color-0: var(--note-color-0, transparent);
      --_note-color-1: var(--note-color-1, transparent);
      --_note-color-2: var(--note-color-2, transparent);
      --_note-color-3: var(--note-color-3, transparent);
      --_note-color-4: var(--note-color-4, transparent);
      --_note-color-5: var(--note-color-5, transparent);
      --_note-color-6: var(--note-color-6, transparent);
      --_note-color-7: var(--note-color-7, transparent);
      --_note-color-8: var(--note-color-8, transparent);
      --_note-color-9: var(--note-color-9, transparent);
      --_note-color-10: var(--note-color-10, transparent);
      --_note-color-11: var(--note-color-11, transparent);

      /* Default display and font properties for the host element */
      display: inline-block;
      font-size: inherit;
    }

    /**
     * Base styles for all buttons within the component.
     * Ensures consistent font inheritance, removes default margins,
     * padding, background, and borders to allow for custom styling.
     */
    button {
      font: inherit;
      margin: 0;
      padding: 0;
      cursor: pointer;
      background: none;
      border: none;
    }

    /**
     * Styles for the main note selection button, which expands to fill the
     * host's content area. Its padding is controlled by the custom property
     * allowing external styling to define the clickable area.
     */
    #note-selector-button {
      width: 100%;
      height: 100%;
      padding: var(--_enharmonic-note-selector-padding);
    }

    /**
     * Styles for the main note selector button and the enharmonic note
     * buttons within the dialog.
     * Applies a default transparent underline, with the color dynamically
     * set based on the data-note-integer attribute using CSS custom properties.
     */
    #note-selector-button,
    .enharmonic-note-button {
      /* Default transparent underline */
      text-decoration: transparent underline solid 0.1em;

      /* Apply note-specific underline color based on data-note-integer */
      &[data-note-integer="0"] {
        text-decoration-color: var(--_note-color-0);
      }
      &[data-note-integer="1"] {
        text-decoration-color: var(--_note-color-1);
      }
      &[data-note-integer="2"] {
        text-decoration-color: var(--_note-color-2);
      }
      &[data-note-integer="3"] {
        text-decoration-color: var(--_note-color-3);
      }
      &[data-note-integer="4"] {
        text-decoration-color: var(--_note-color-4);
      }
      &[data-note-integer="5"] {
        text-decoration-color: var(--_note-color-5);
      }
      &[data-note-integer="6"] {
        text-decoration-color: var(--_note-color-6);
      }
      &[data-note-integer="7"] {
        text-decoration-color: var(--_note-color-7);
      }
      &[data-note-integer="8"] {
        text-decoration-color: var(--_note-color-8);
      }
      &[data-note-integer="9"] {
        text-decoration-color: var(--_note-color-9);
      }
      &[data-note-integer="10"] {
        text-decoration-color: var(--_note-color-10);
      }
      &[data-note-integer="11"] {
        text-decoration-color: var(--_note-color-11);
      }
    }

    /**
     * Styles for the "close dialog" button within the modal.
     */
    #close-dialog-button {
      display: block;
      padding: 0.1em 0.5em;
      border: none;
      margin-inline-start: auto; /* Aligns button to the right */
    }

    /**
    * Styles for the native HTML <dialog> element.
      */
    dialog {
      font-size: 1.2em;
      padding: 0.5em;
    }

    /**
     * Styles for the dialog's backdrop (the overlay behind the modal).
     */
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    /**
     * Styles for the container holding all enharmonic note buttons.
     */
    #enharmonic-note-buttons-div {
      text-align: center;
    }

    /**
     * Styles for individual enharmonic note selection buttons within the dialog.
     */
    .enharmonic-note-button {
      min-width: 4ch;
      height: 4ch;
    }

    /**
     * Styles for horizontal rules separating pitch classes in the dialog.
     */
    hr {
      margin: 0;
    }
  </style>

  <button id="note-selector-button"></button>

  <dialog id="note-selector-dialog">
    <button id="close-dialog-button">×</button>

    <div id="enharmonic-note-buttons-div">
      ${
  enharmonicNoteNameGroups
    .map((notes, index) =>
      notes
        .map(
          (note) =>
            /* HTML */ `<button
                class="enharmonic-note-button"
                data-note-name="${note}"
                data-note-integer="${index}"
              >
                ${note}
              </button>`,
        )
        .join("")
    )
    .join(/* HTML */ `<hr />`)
}
    </div>
  </dialog>
`;

/**
 * Interface representing the detail payload for the 'enharmonic-note-selected' custom event.
 */
export interface EnharmonicNoteSelectedEventDetail {
  /**
   * The selected note's name (e.g., "C", "D♭", "G♯").
   * @type {string}
   */
  noteName: string;
  /**
   * The selected note's note integer (0-11).
   * @type {NoteInteger}
   */
  noteInteger: NoteInteger;
}

/**
 * Represents a custom HTML element for selecting enharmonic notes.
 *
 * @class EnharmonicNoteSelector
 * @extends HTMLElement
 * @property {string | null} selectedNoteName - Gets or sets the currently selected note's name.
 * @property {NoteInteger | null} selectedNoteInteger - Gets the note integer of the currently selected note.
 * @property {NoteColorGroup | null} noteColorGroup - Gets or sets the thematic color group for notes. Setting this property updates the `--note-color-*` CSS custom properties on the host.
 * @attr {string} selected-note-name - The initial note name to display when the component loads.
 */
export class EnharmonicNoteSelector extends HTMLElement {
  /**
   * The Shadow DOM root for this custom element.
   * @private
   * @type {ShadowRoot}
   */
  #shadowRoot: ShadowRoot;
  /**
   * Reference to the main note selection button element within the Shadow DOM.
   * @private
   * @type {HTMLButtonElement | null}
   */
  #noteSelectorButton: HTMLButtonElement | null = null;
  /**
   * Reference to the dialog element that contains the enharmonic note buttons.
   * @private
   * @type {HTMLDialogElement | null}
   */
  #noteSelectorDialog: HTMLDialogElement | null = null;
  /**
   * An AbortController instance to manage event listeners and cleanup.
   * @private
   * @type {AbortController | null}
   */
  #abortController: AbortController | null = null;
  /**
   * The currently selected note's name.
   * @private
   * @type {string | null}
   */
  #selectedNoteName: string | null = null;
  /**
   * The note integer corresponding to the selected note.
   * @private
   * @type {NoteInteger | null}
   */
  #selectedNoteInteger: NoteInteger | null = null;
  /**
   * The color group for notes, used to style the underline colors.
   * @private
   * @type {NoteColorGroup | null}
   */
  #noteColorGroup: NoteColorGroup | null = null;

  static get observedAttributes(): string[] {
    return ["selected-note-name"];
  }

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#shadowRoot.appendChild(
      enharmonicNoteSelectorTemplate.content.cloneNode(true),
    );

    this.#noteSelectorButton = this.#shadowRoot.querySelector<
      HTMLButtonElement
    >(
      "#note-selector-button",
    );

    this.#noteSelectorDialog = this.#shadowRoot.querySelector<
      HTMLDialogElement
    >(
      "#note-selector-dialog",
    );
  }

  connectedCallback() {
    this.#abortController = new AbortController();
    const { signal } = this.#abortController;

    if (this.#noteSelectorButton && this.#noteSelectorDialog) {
      this.#noteSelectorButton.addEventListener(
        "click",
        () => {
          this.#noteSelectorDialog!.showModal();
        },
        { signal },
      );

      const enharmonicNoteButtons = this.#shadowRoot.querySelectorAll(
        ".enharmonic-note-button",
      ) as NodeListOf<HTMLButtonElement>;

      enharmonicNoteButtons.forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            this.#selectedNoteName = button.dataset.noteName || null;
            this.#selectedNoteInteger = button.dataset.noteInteger
              ? (parseInt(button.dataset.noteInteger, 10) as NoteInteger)
              : null;
            this.#updateNoteSelectorButtonText();
            this.#updateSelectedNoteAttribute();
            this.#noteSelectorDialog!.close();
          },
          { signal },
        );
      });

      const closeDialogButton = this.#shadowRoot.getElementById(
        "close-dialog-button",
      ) as HTMLButtonElement;
      closeDialogButton.addEventListener(
        "click",
        () => {
          this.#noteSelectorDialog!.close();
        },
        { signal },
      );

      this.#updateNoteSelectorButtonText();
      this.#updateSelectedNoteAttribute();
    } else {
      console.error(
        "Failed to find note-selector button element or dialog element",
      );
    }
  }

  /**
   * Cleans up event listeners to prevent memory leaks.
   */
  disconnectedCallback() {
    this.#abortController?.abort();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) return;
    if (name === "selected-note-name") {
      this.selectedNoteName = newValue;
      this.#dispatchNoteSelectedEvent();
    }
  }

  /**
   * Updates the text content and `data-note-integer` attribute of the
   * main note selector button based on the currently selected note.
   * Also updates the `aria-label` for accessibility.
   * @private
   */
  #updateNoteSelectorButtonText() {
    // Set button text to selected note name or a default symbol
    this.#noteSelectorButton!.textContent = this.#selectedNoteName
      ? this.#selectedNoteName
      : "𝅘𝅥𝄙"; // Musical symbol to represent a note choice input

    // Set data-note-integer attribute for styling, etc.
    this.#selectedNoteInteger === null
      ? this.#noteSelectorButton?.removeAttribute("data-note-integer")
      : this.#noteSelectorButton?.setAttribute(
        "data-note-integer",
        this.#selectedNoteInteger.toString(),
      );

    // Update aria-label for screen readers
    this.#noteSelectorButton!.ariaLabel = this.#selectedNoteName
      ? `${this.#selectedNoteName} selected`
      : "Select Note";
  }

  /**
   * Synchronizes the `selected-note-name` attribute on the host element
   * with the component's internal state.
   * @private
   */
  #updateSelectedNoteAttribute() {
    if (this.#selectedNoteName) {
      this.setAttribute("selected-note-name", this.#selectedNoteName);
    } else {
      this.removeAttribute("selected-note-name");
    }
  }

  /**
   * Dispatches a custom event named 'enharmonic-note-selected' when a note is chosen.
   * The event bubbles and composes, carrying details about the selected note.
   * @private
   * @fires EnharmonicNoteSelectedEvent
   */
  #dispatchNoteSelectedEvent() {
    if (
      this.#selectedNoteName !== null &&
      this.#selectedNoteInteger !== null
    ) {
      this.dispatchEvent(
        new CustomEvent<EnharmonicNoteSelectedEventDetail>(
          "enharmonic-note-selected",
          {
            detail: {
              noteName: this.#selectedNoteName,
              noteInteger: this.#selectedNoteInteger,
            },
            bubbles: true,
            composed: true, // Allows event to cross Shadow DOM boundary
          },
        ),
      );
    } else {
      console.warn(
        "attempted to dispatch enharmonic-note-selected event with null data",
      );
    }
  }

  /**
   * Gets the name of the currently selected note.
   * @prop {string | null} selectedNoteName
   * @returns {string | null} The note name (e.g., "C", "E♭", "C♯") or `null` if no note is selected.
   */
  get selectedNoteName(): string | null {
    return this.#selectedNoteName;
  }

  /**
   * Sets the currently selected note by its name.
   * If the provided note name is valid and found among enharmonic notes,
   * the component's state and display will update accordingly.
   * Invalid note names will result in the selection being cleared.
   * Must be one of the enharmonic notes defined in `enharmonicNoteNameGroups`, which does not
   * include ascii accidentals like "C#" or "Db". Use "C♯", "D♭", etc.
   * @param {string | null} newNote - The new note name to set (e.g., "A", "B♭", "G♯").
   * @prop {string | null} selectedNoteName
   */
  set selectedNoteName(newNote: string | null) {
    // Reset values until proven valid
    this.#selectedNoteName = null;
    this.#selectedNoteInteger = null;

    if (newNote !== null) {
      // Find the note integer for the given note name
      for (let i = 0; i < enharmonicNoteNameGroups.length; i++) {
        if (enharmonicNoteNameGroups[i].includes(newNote as NoteName)) {
          this.#selectedNoteInteger = i as NoteInteger;
          break; // Exit loop once found
        }
      }
      // If newNote is not found, selectedNoteName will remain null
      if (this.#selectedNoteInteger !== null) this.#selectedNoteName = newNote;
    }

    this.#updateNoteSelectorButtonText();
    this.#updateSelectedNoteAttribute();
  }

  setRandomNote() {
    // Select a random note from the enharmonic note groups
    const randomIndex = Math.floor(
      Math.random() * enharmonicNoteNameGroups.length,
    );
    const randomNote = enharmonicNoteNameGroups[randomIndex][
      Math.floor(Math.random() * enharmonicNoteNameGroups[randomIndex].length)
    ];
    this.selectedNoteName = randomNote;
  }

  /**
   * Gets the note integer (0-11) of the currently selected note.
   * This value is derived from `selectedNoteName`.
   * @prop {NoteInteger | null} selectedNoteInteger
   * @returns {NoteInteger | null} The note integer or `null` if no note is selected.
   * @readonly
   */
  get selectedNoteInteger(): NoteInteger | null {
    return this.#selectedNoteInteger;
  }

  /**
   * Gets the currently applied note color group.
   * @prop {NoteColorGroup | null} noteColorGroup
   * @returns {NoteColorGroup | null} The active color group, or `null` if none is set.
   */
  get noteColorGroup(): NoteColorGroup | null {
    return this.#noteColorGroup;
  }

  /**
   * Sets a new note color group.
   * This updates the internal `--note-color-*` CSS custom properties on the
   * host element, which in turn affects the underline colors of the notes.
   * @param {NoteColorGroup | null} noteColorGroup - The new color group to apply.
   * @prop {NoteColorGroup | null} noteColorGroup
   */

  set noteColorGroup(noteColorGroup: NoteColorGroup | null) {
    if (noteColorGroup) {
      this.#noteColorGroup = noteColorGroup;
      for (let i = 0; i < 12; i++) {
        this.style.setProperty(`--note-color-${i}`, noteColorGroup[i]);
      }
    } else {
      this.#noteColorGroup = null;
      // Clear the custom properties if no color group is set
      for (let i = 0; i < 12; i++) {
        this.style.setProperty(`--note-color-${i}`, null);
      }
    }
  }
}

/**
 * Defines the custom element 'enharmonic-note-selector' in the browser.
 * This makes the element available for use in HTML.
 */
customElements.define("enharmonic-note-selector", EnharmonicNoteSelector);

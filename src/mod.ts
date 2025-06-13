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
 * selected, providing the note name and its corresponding pitch integer.
 * - **Programmatic Control:** Exposes public properties for getting/setting
 * the selected note's name and pitch integer.
 * - **Attribute Synchronization:** Supports setting the initial selected note
 * via an HTML attribute.
 *
 * @example
 * ```html
 * <enharmonic-note-selector selected-note-name="C"></enharmonic-note-selector>
 * ```
 *
 * @example
 * ```css
 * <style>
 * enharmonic-note-selector {
 *   --note-color-0: #FF0000;
 *   --note-color-1: #FFA500;
 *   ...
 * }
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
 * @cssprop {<color>} [--note-color-0=transparent] - Color for pitch integer 0 (C, B♯, D𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-1=transparent] - Color for pitch integer 1 (C♯, D♭). Used for underline color.
 * @cssprop {<color>} [--note-color-2=transparent] - Color for pitch integer 2 (D, C𝄪, E𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-3=transparent] - Color for pitch integer 3 (D♯, E♭). Used for underline color.
 * @cssprop {<color>} [--note-color-4=transparent] - Color for pitch integer 4 (E, F♭, D𝄪). Used for underline color.
 * @cssprop {<color>} [--note-color-5=transparent] - Color for pitch integer 5 (F, E♯). Used for underline color.
 * @cssprop {<color>} [--note-color-6=transparent] - Color for pitch integer 6 (F♯, G♭). Used for underline color.
 * @cssprop {<color>} [--note-color-7=transparent] - Color for pitch integer 7 (G, F𝄪, A𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-8=transparent] - Color for pitch integer 8 (G♯, A♭). Used for underline color.
 * @cssprop {<color>} [--note-color-9=transparent] - Color for pitch integer 9 (A, G𝄪, 𝄫♭). Used for underline color.
 * @cssprop {<color>} [--note-color-10=transparent] - Color for pitch integer 10 (A♯, 𝄫). Used for underline color.
 * @cssprop {<color>} [--note-color-11=transparent] - Color for pitch integer 11 (B, C♭, A𝄪). Used for underline color.
 */

import {
  enharmonicNotes,
  type PitchInteger,
} from "@musodojo/music-theory-data";
import type { NoteColorGroup } from "@musodojo/note-colors-data";

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
         These are used to style the underline of notes based on their pitch integer. */
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
     * set based on the data-pitch-integer attribute using CSS custom properties.
     */
    #note-selector-button,
    .enharmonic-note-button {
      /* Default transparent underline */
      text-decoration: transparent underline solid 0.1em;

      /* Apply note-specific underline color based on data-pitch-integer */
      &[data-pitch-integer="0"] {
        text-decoration-color: var(--_note-color-0);
      }
      &[data-pitch-integer="1"] {
        text-decoration-color: var(--_note-color-1);
      }
      &[data-pitch-integer="2"] {
        text-decoration-color: var(--_note-color-2);
      }
      &[data-pitch-integer="3"] {
        text-decoration-color: var(--_note-color-3);
      }
      &[data-pitch-integer="4"] {
        text-decoration-color: var(--_note-color-4);
      }
      &[data-pitch-integer="5"] {
        text-decoration-color: var(--_note-color-5);
      }
      &[data-pitch-integer="6"] {
        text-decoration-color: var(--_note-color-6);
      }
      &[data-pitch-integer="7"] {
        text-decoration-color: var(--_note-color-7);
      }
      &[data-pitch-integer="8"] {
        text-decoration-color: var(--_note-color-8);
      }
      &[data-pitch-integer="9"] {
        text-decoration-color: var(--_note-color-9);
      }
      &[data-pitch-integer="10"] {
        text-decoration-color: var(--_note-color-10);
      }
      &[data-pitch-integer="11"] {
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
      min-width: 3.5ch;
    }

    /**
     * Styles for horizontal rules separating pitch classes in the dialog.
     */
    hr {
      margin-block: 0.2em;
    }
  </style>

  <button id="note-selector-button"></button>

  <dialog id="note-selector-dialog">
    <button id="close-dialog-button">×</button>

    <div id="enharmonic-note-buttons-div">
      ${
  enharmonicNotes
    .map((notes, index) =>
      notes
        .map(
          (note) =>
            /* HTML */ `<button
                class="enharmonic-note-button"
                data-note-name="${note}"
                data-pitch-integer="${index}"
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
   * @type {string | null}
   */
  noteName: string | null;
  /**
   * The selected note's pitch integer (0-11).
   * @type {PitchInteger | null}
   */
  pitchInteger: PitchInteger | null;
}

/**
 * Represents a custom HTML element for selecting enharmonic notes.
 *
 * @class EnharmonicNoteSelector
 * @extends HTMLElement
 * @property {string | null} selectedNoteName - Gets or sets the currently selected note's name.
 * @property {PitchInteger | null} selectedPitchInteger - Gets the pitch integer of the currently selected note.
 * @property {NoteColorGroup | null} noteColorGroup - Gets or sets the thematic color group for notes. Setting this property updates the `--note-color-*` CSS custom properties on the host.
 * @attr {string} selected-note-name - The initial note name to display when the component loads.
 */
class EnharmonicNoteSelector extends HTMLElement {
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
   * The pitch integer corresponding to the selected note.
   * @private
   * @type {PitchInteger | null}
   */
  #selectedPitchInteger: PitchInteger | null = null;
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
            this.#selectedPitchInteger = button.dataset.pitchInteger
              ? (parseInt(button.dataset.pitchInteger, 10) as PitchInteger)
              : null;
            this.#updateNoteSelectorButtonText();
            this.#updateSelectedNoteAttribute();
            this.#noteSelectorDialog!.close();
            this.#dispatchNoteSelectedEvent();
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
    if (name === "selected-note-name") this.selectedNoteName = newValue;
  }

  /**
   * Updates the text content and `data-pitch-integer` attribute of the
   * main note selector button based on the currently selected note.
   * Also updates the `aria-label` for accessibility.
   * @private
   */
  #updateNoteSelectorButtonText() {
    // Set button text to selected note name or a default symbol
    this.#noteSelectorButton!.textContent = this.#selectedNoteName
      ? this.#selectedNoteName
      : "𝅘𝅥𝄙"; // Musical symbol to represent a note choice input

    // Set data-pitch-integer attribute for styling, etc.
    this.#selectedPitchInteger === null
      ? this.#noteSelectorButton?.removeAttribute("data-pitch-integer")
      : this.#noteSelectorButton?.setAttribute(
        "data-pitch-integer",
        this.#selectedPitchInteger.toString(),
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
    this.dispatchEvent(
      new CustomEvent<EnharmonicNoteSelectedEventDetail>(
        "enharmonic-note-selected",
        {
          detail: {
            noteName: this.#selectedNoteName,
            pitchInteger: this.#selectedPitchInteger,
          },
          bubbles: true,
          composed: true, // Allows event to cross Shadow DOM boundary
        },
      ),
    );
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
   * @param {string | null} newNote - The new note name to set (e.g., "A", "B♭", "G♯").
   * @prop {string | null} selectedNoteName
   */
  set selectedNoteName(newNote: string | null) {
    // Reset values until proven valid
    this.#selectedNoteName = null;
    this.#selectedPitchInteger = null;

    if (newNote !== null) {
      // Find the pitch integer for the given note name
      for (let i = 0; i < enharmonicNotes.length; i++) {
        if (enharmonicNotes[i].includes(newNote)) {
          this.#selectedPitchInteger = i as PitchInteger;
          break; // Exit loop once found
        }
      }
      // If newNote is not found, selectedNoteName will remain null
      if (this.#selectedPitchInteger !== null) this.#selectedNoteName = newNote;
    }

    this.#updateNoteSelectorButtonText();
    this.#updateSelectedNoteAttribute();
  }

  /**
   * Gets the pitch integer (0-11) of the currently selected note.
   * This value is derived from `selectedNoteName`.
   * @prop {PitchInteger | null} selectedPitchInteger
   * @returns {PitchInteger | null} The pitch integer or `null` if no note is selected.
   * @readonly
   */
  get selectedPitchInteger(): PitchInteger | null {
    return this.#selectedPitchInteger;
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

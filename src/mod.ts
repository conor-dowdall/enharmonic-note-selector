/**
 * @module
 * @example
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 *   <head>
 *     <meta charset="UTF-8" />
 *     <title>Simple Enharmonic Note Selector Example</title>
 *     <script type="module" src="../dist/bundle.js"></script>
 *   </head>
 *   <body>
 *     <h1>Enharmonic Note Selector</h1>
 *     <enharmonic-note-selector selected-note-name="C♯"></enharmonic-note-selector>
 *
 *     <script type="module">
 *       const selector = document.querySelector("enharmonic-note-selector");
 *
 *       selector.addEventListener("enharmonic-note-selected", (e) => {
 *         console.log("Note selected:", e.detail.noteName);
 *         console.log("Note integer:", e.detail.noteInteger);
 *       });
 *     </script>
 *   </body>
 * </html>
 * ```
 */

import {
  type ColorGroup,
  enharmonicNoteNameGroups,
  enharmonicRootNoteGroups,
  getContrastColor,
  type NoteName,
  type RootNoteInteger,
} from "@musodojo/music-theory-data";

const enharmonicNoteSelectorTemplate = document.createElement("template");
enharmonicNoteSelectorTemplate.innerHTML = /* HTML */ `
  <style>
    :host {
      --_main-icon-size: var(--main-icon-size, 2.5ch);
      --_close-dialog-icon-size: var(--close-dialog-icon-size, 2ch);

      --_dialog-backdrop-background: var(
        --dialog-backdrop-background,
        light-dark(rgb(255 255 255 / 50%), rgb(0 0 0 / 50%))
      );

      --_default-spacing: var(--default-spacing, 0.5em);

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

      /* Text colors are calculated in JS for high contrast */
      --_note-text-color-0: var(--note-text-color-0, currentColor);
      --_note-text-color-1: var(--note-text-color-1, currentColor);
      --_note-text-color-2: var(--note-text-color-2, currentColor);
      --_note-text-color-3: var(--note-text-color-3, currentColor);
      --_note-text-color-4: var(--note-text-color-4, currentColor);
      --_note-text-color-5: var(--note-text-color-5, currentColor);
      --_note-text-color-6: var(--note-text-color-6, currentColor);
      --_note-text-color-7: var(--note-text-color-7, currentColor);
      --_note-text-color-8: var(--note-text-color-8, currentColor);
      --_note-text-color-9: var(--note-text-color-9, currentColor);
      --_note-text-color-10: var(--note-text-color-10, currentColor);
      --_note-text-color-11: var(--note-text-color-11, currentColor);

      display: inline-block;
      font-size: inherit;
    }

    button {
      font: inherit;
      margin: 0;
      padding: 0;
      cursor: pointer;
      background: none;
      border: none;
    }

    svg {
      fill: currentColor;
    }

    [part="main-button"] {
      display: grid;
      place-items: center;

      min-width: var(--_main-icon-size);

      > #selected-note-name-span {
        grid-area: 1 / 1;
      }

      > slot {
        height: var(--_main-icon-size);
      }

      ::slotted(svg),
      ::slotted(img),
      > slot > svg {
        grid-area: 1 / 1;
        width: var(--_main-icon-size);
        height: var(--_main-icon-size);
      }
    }

    [part="main-button"],
    [part="note-button"] {
      &[data-note-integer="0"] {
        background-color: var(--_note-color-0);
        color: var(--_note-text-color-0);
      }
      &[data-note-integer="1"] {
        background-color: var(--_note-color-1);
        color: var(--_note-text-color-1);
      }
      &[data-note-integer="2"] {
        background-color: var(--_note-color-2);
        color: var(--_note-text-color-2);
      }
      &[data-note-integer="3"] {
        background-color: var(--_note-color-3);
        color: var(--_note-text-color-3);
      }
      &[data-note-integer="4"] {
        background-color: var(--_note-color-4);
        color: var(--_note-text-color-4);
      }
      &[data-note-integer="5"] {
        background-color: var(--_note-color-5);
        color: var(--_note-text-color-5);
      }
      &[data-note-integer="6"] {
        background-color: var(--_note-color-6);
        color: var(--_note-text-color-6);
      }
      &[data-note-integer="7"] {
        background-color: var(--_note-color-7);
        color: var(--_note-text-color-7);
      }
      &[data-note-integer="8"] {
        background-color: var(--_note-color-8);
        color: var(--_note-text-color-8);
      }
      &[data-note-integer="9"] {
        background-color: var(--_note-color-9);
        color: var(--_note-text-color-9);
      }
      &[data-note-integer="10"] {
        background-color: var(--_note-color-10);
        color: var(--_note-text-color-10);
      }
      &[data-note-integer="11"] {
        background-color: var(--_note-color-11);
        color: var(--_note-text-color-11);
      }

      &[data-note-integer] {
        border-color: transparent;
      }
    }

    [part="dialog"] {
      padding: var(--_default-spacing);

      > [part="close-dialog-button"] {
        display: grid;
        place-items: center;
        padding: var(--_default-spacing);
        border: none;
        margin-inline-start: auto;
        margin-block-end: var(--_default-spacing);

        /* Size icons, but let text content flow naturally */
        ::slotted(svg),
        ::slotted(img),
        > slot[name="close-dialog-icon"] > svg {
          width: var(--_close-dialog-icon-size);
          height: var(--_close-dialog-icon-size);
          /* Ensure icons are on the same grid cell if multiple are slotted */
          grid-area: 1 / 1;
        }
      }

      > #enharmonic-note-buttons-div {
        display: flex;
        flex-direction: column;
        gap: var(--_default-spacing);

        > .note-group {
          display: flex;
          flex-wrap: nowrap;
          gap: var(--_default-spacing);

          > [part="note-button"] {
            width: 7ch;
            height: 3.5ch;
            border: 1px solid
              light-dark(rgb(0 0 0 / 50%), rgb(255 255 255 / 50%));
            corner-shape: squircle;
            border-radius: 0.5em;
          }
        }
      }
    }

    [part="dialog"]::backdrop {
      background: var(--_dialog-backdrop-background);
    }

    .visually-hidden {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
  </style>

  <button part="main-button">
    <span id="selected-note-name-span" style="display: none;"></span>
    <slot>
      <!-- Default icon when no note is selected. Can be overridden by the user. This
      SVG is part of the project and is licensed under CC0 1.0 Universal. -->
      <svg viewBox="0 -960 960 960">
        <path
          d="m679.37-879.99h39.405v557.69h-39.405zm24.782 497.94a158.9 237.09 59.29 0 1-125.94 257.49 158.9 237.09 59.29 0 1-283.56-18.475 158.9 237.09 59.29 0 1 125.92-257.5 158.9 237.09 59.29 0 1 283.57 18.458l-204.74 119.52z"
        />
      </svg>
    </slot>
  </button>

  <dialog part="dialog" aria-labelledby="dialog-heading">
    <button part="close-dialog-button">
      <slot name="close-dialog-icon">
        <!-- Default icon when no note is selected. Can be overridden by the user. 
         This SVG is part of the project and is licensed under CC0 1.0 Universal. -->
        <svg viewBox="0 -960 960 960">
          <path
            transform="rotate(-45)"
            d="m638.82-400h80v800h-80zm-360 360h800v80h-800z"
          />
        </svg>
      </slot>
    </button>

    <h2 id="dialog-heading" class="visually-hidden">Select a Note</h2>

    <div id="enharmonic-note-buttons-div">
      <!-- the buttons in here are dynamically generated 
       each with an attribute of part="note-button" -->
    </div>
  </dialog>
`;

/**
 * The detail object dispatched with the `enharmonic-note-selected` event.
 */
export interface EnharmonicNoteSelectedEventDetail {
  /** The string name of the selected note (e.g., "C♯", "D♭"). */
  noteName: string;
  /** The integer representation of the note's pitch (0-11), where C=0. */
  noteInteger: RootNoteInteger;
}

/**
 * A web component for selecting a musical note from its enharmonic equivalents.
 * @fires enharmonic-note-selected - Dispatched when a note is selected by the user.
 */
export class EnharmonicNoteSelector extends HTMLElement {
  #shadowRoot!: ShadowRoot;

  // cache these critical elements in the constructor with #cacheDomElements()
  // and throw an error if they are not found
  #mainButton!: HTMLButtonElement;
  #mainButtonSlot!: HTMLSlotElement;
  #dialog!: HTMLDialogElement;
  #closeDialogButton!: HTMLButtonElement;
  #enharmonicNoteButtonsDiv!: HTMLDivElement;
  #selectedNoteNameSpan!: HTMLSpanElement;

  #abortController: AbortController | null = null;
  #selectedNoteName: string | null = null;
  #selectedNoteInteger: RootNoteInteger | null = null;
  #noteColorGroup: ColorGroup | null = null;

  static get observedAttributes(): string[] {
    return ["selected-note-name", "root-notes-only"];
  }

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#shadowRoot.appendChild(
      enharmonicNoteSelectorTemplate.content.cloneNode(true),
    );
    this.#cacheDomElements();
  }

  connectedCallback() {
    this.#populateEnharmonicNoteButtonsDiv();
    this.#addEventListeners();
    this.#updateNoteSelectorButton();
    this.#syncSelectedNoteAttribute();
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (oldValue === newValue) return;
    switch (name) {
      case "selected-note-name":
        if (newValue !== this.selectedNoteName) {
          this.selectedNoteName = newValue;
        }
        break;
      case "root-notes-only":
        this.#populateEnharmonicNoteButtonsDiv();
        break;
    }
  }

  #cacheDomElements() {
    const mainButton = this.#shadowRoot.querySelector<HTMLButtonElement>(
      '[part="main-button"]',
    );

    const mainButtonSlot = mainButton?.querySelector<HTMLSlotElement>("slot");

    const dialog = this.#shadowRoot.querySelector<HTMLDialogElement>(
      '[part="dialog"]',
    );

    const closeDialogButton = this.#shadowRoot.querySelector<HTMLButtonElement>(
      '[part="close-dialog-button"]',
    );

    const enharmonicNoteButtonsDiv = this.#shadowRoot.querySelector<
      HTMLDivElement
    >(
      "#enharmonic-note-buttons-div",
    );

    const selectedNoteNameSpan = this.#shadowRoot.querySelector<
      HTMLSpanElement
    >(
      "#selected-note-name-span",
    );

    if (
      !mainButton ||
      !mainButtonSlot ||
      !dialog ||
      !closeDialogButton ||
      !enharmonicNoteButtonsDiv ||
      !selectedNoteNameSpan
    ) {
      throw new Error(
        "EnharmonicNoteSelector: Critical elements not found in shadow DOM.",
      );
    }

    this.#mainButton = mainButton;
    this.#mainButtonSlot = mainButtonSlot;
    this.#dialog = dialog;
    this.#closeDialogButton = closeDialogButton;
    this.#enharmonicNoteButtonsDiv = enharmonicNoteButtonsDiv;
    this.#selectedNoteNameSpan = selectedNoteNameSpan;
  }

  #populateEnharmonicNoteButtonsDiv() {
    const noteGroups = this.rootNotesOnly
      ? enharmonicRootNoteGroups
      : enharmonicNoteNameGroups;

    const frag = document.createDocumentFragment();

    noteGroups.forEach((notes, index) => {
      const group = document.createElement("div");
      group.className = "note-group";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", `Pitch ${index}`);

      notes.forEach((note) => {
        const btn = document.createElement("button");
        btn.setAttribute("part", "note-button");
        btn.dataset.noteName = note;
        btn.dataset.noteInteger = String(index);
        btn.textContent = note;
        group.appendChild(btn);
      });

      frag.appendChild(group);
    });

    this.#enharmonicNoteButtonsDiv.replaceChildren(frag);
  }

  #addEventListeners() {
    // abort any previous controllers before creating a new one
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    const { signal } = this.#abortController;

    this.#mainButton.addEventListener(
      "click",
      () => {
        this.#dialog.showModal();
      },
      { signal },
    );

    this.#enharmonicNoteButtonsDiv.addEventListener(
      "click",
      (event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
          '[part="note-button"]',
        );
        if (button) {
          this.#selectedNoteName = button.dataset.noteName || null;
          this.#selectedNoteInteger = button.dataset.noteInteger
            ? (parseInt(button.dataset.noteInteger, 10) as RootNoteInteger)
            : null;
          this.#updateNoteSelectorButton();
          this.#syncSelectedNoteAttribute();
          this.#dialog.close();
          this.#dispatchNoteSelectedEvent();
        }
      },
      { signal },
    );

    this.#closeDialogButton.addEventListener(
      "click",
      () => this.#dialog.close(),
      { signal },
    );
  }

  #updateNoteSelectorButton() {
    if (this.#selectedNoteName !== null && this.#selectedNoteInteger !== null) {
      // State when a note is selected
      this.#selectedNoteNameSpan.textContent = this.#selectedNoteName;
      this.#selectedNoteNameSpan.style.display = "initial";
      this.#mainButtonSlot.style.display = "none";
      this.#mainButton.setAttribute(
        "data-note-integer",
        this.#selectedNoteInteger.toString(),
      );
      this.#mainButton.ariaLabel = `${this.#selectedNoteName} selected`;
    } else {
      // Default state when no note is selected
      this.#selectedNoteNameSpan.style.display = "none";
      this.#mainButtonSlot.style.display = "initial";
      this.#mainButton.removeAttribute("data-note-integer");

      this.#mainButton.ariaLabel = "Select Note";
    }
  }

  #syncSelectedNoteAttribute() {
    if (this.#selectedNoteName) {
      this.setAttribute("selected-note-name", this.#selectedNoteName);
    } else {
      this.removeAttribute("selected-note-name");
    }
  }

  #dispatchNoteSelectedEvent() {
    if (this.#selectedNoteName !== null && this.#selectedNoteInteger !== null) {
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
   * Gets the currently selected note name (e.g., "C♯", "D♭").
   * @returns {string | null} The selected note name or null if no note is selected.
   */
  get selectedNoteName(): string | null {
    return this.#selectedNoteName;
  }

  set selectedNoteName(newNote: string | null) {
    if (this.#selectedNoteName === newNote) return;

    // Reset values until proven valid
    this.#selectedNoteName = null;
    this.#selectedNoteInteger = null;

    if (newNote !== null) {
      const noteGroups = this.rootNotesOnly
        ? enharmonicRootNoteGroups
        : enharmonicNoteNameGroups;

      const noteIndex = noteGroups.findIndex((group) =>
        group.includes(newNote as NoteName)
      );

      if (noteIndex !== -1) {
        this.#selectedNoteInteger = noteIndex as RootNoteInteger;
        this.#selectedNoteName = newNote;
      }
    }

    // Only update the button and attribute if the component is connected to the DOM
    if (this.isConnected) {
      this.#updateNoteSelectorButton();
      this.#syncSelectedNoteAttribute();
    }

    this.#dispatchNoteSelectedEvent();
  }

  /**
   * Gets whether the selector is restricted to common root notes.
   * @returns {boolean} True if only root notes are shown.
   */
  get rootNotesOnly(): boolean {
    return this.hasAttribute("root-notes-only");
  }

  /**
   * Sets whether the selector should be restricted to common root notes.
   * @param {boolean} value - Set to true to show only root notes.
   */
  set rootNotesOnly(value: boolean) {
    this.toggleAttribute("root-notes-only", value);
  }

  /**
   * Selects a new, random note from the available options.
   * Ensures the newly selected note is different from the current one.
   */
  setRandomNote() {
    const noteGroups = this.rootNotesOnly
      ? enharmonicRootNoteGroups
      : enharmonicNoteNameGroups;

    let randomNote: string;

    // Keep selecting a random note until it's different from the current one.
    do {
      const randomIndex = Math.floor(Math.random() * noteGroups.length);
      const randomNoteGroup = noteGroups[randomIndex];
      randomNote =
        randomNoteGroup[Math.floor(Math.random() * randomNoteGroup.length)];
    } while (randomNote === this.selectedNoteName);

    this.selectedNoteName = randomNote;
  }

  /**
   * Gets the integer representation (0-11) of the selected note.
   * @returns {RootNoteInteger | null} The note integer or null if no note is selected.
   */
  get selectedNoteInteger(): RootNoteInteger | null {
    return this.#selectedNoteInteger;
  }

  /**
   * Gets the currently configured color group for note pitches.
   * @returns {ColorGroup | null} An array of 12 CSS color strings, or null.
   */
  get noteColorGroup(): ColorGroup | null {
    return this.#noteColorGroup;
  }

  /**
   * Sets the color group for note pitches. This will automatically calculate and apply high-contrast text colors for each background.
   * @param {ColorGroup | null} noteColorGroup - An array of 12 CSS color strings.
   */
  set noteColorGroup(noteColorGroup: ColorGroup | null) {
    if (noteColorGroup) {
      this.#noteColorGroup = noteColorGroup;
      noteColorGroup.forEach((color, i) => {
        const textColor = color ? getContrastColor(color) : null;
        this.style.setProperty(`--note-color-${i}`, color);
        this.style.setProperty(`--note-text-color-${i}`, textColor);
      });
    } else {
      this.#noteColorGroup = null;
      // Clear the custom properties if no color group is set
      for (let i = 0; i < 12; i++) {
        this.style.setProperty(`--note-color-${i}`, null);
        this.style.setProperty(`--note-text-color-${i}`, null);
      }
    }
  }
}

customElements.define("enharmonic-note-selector", EnharmonicNoteSelector);

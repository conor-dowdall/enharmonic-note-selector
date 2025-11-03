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

    dialog {
      padding: 0.5em;

      > [part="close-dialog-button"] {
        display: grid;
        place-items: center;
        padding: 0.5em 0.5em;
        border: none;
        margin-inline-start: auto;

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

      &::backdrop {
        background: var(--_dialog-backdrop-background);
      }
    }

    #enharmonic-note-buttons-div {
      display: flex;
      flex-direction: column;
      gap: 0.4em;

      > .note-group {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.4em;

        > [part="note-button"] {
          width: 7ch;
          height: 3.5ch;
          border: 1px solid
            color-mix(in srgb, currentColor 50%, transparent 50%);
          corner-shape: squircle;
          border-radius: 0.5em;
        }
      }
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
  #shadowRoot: ShadowRoot;

  #mainButton: HTMLButtonElement;
  #noteSelectorDialog: HTMLDialogElement;
  #closeDialogButton: HTMLButtonElement;
  #enharmonicNoteButtonsDiv: HTMLDivElement;
  #selectedNoteNameSpan: HTMLSpanElement;

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

    const mainButton = this.#shadowRoot.querySelector<HTMLButtonElement>(
      '[part="main-button"]',
    );

    const noteSelectorDialog = this.#shadowRoot.querySelector<
      HTMLDialogElement
    >('[part="dialog"]');

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
      !noteSelectorDialog ||
      !closeDialogButton ||
      !enharmonicNoteButtonsDiv ||
      !selectedNoteNameSpan
    ) {
      throw new Error(
        "EnharmonicNoteSelector: Critical elements not found in shadow DOM.",
      );
    }

    this.#mainButton = mainButton;
    this.#noteSelectorDialog = noteSelectorDialog;
    this.#closeDialogButton = closeDialogButton;
    this.#enharmonicNoteButtonsDiv = enharmonicNoteButtonsDiv;
    this.#selectedNoteNameSpan = selectedNoteNameSpan;
  }

  connectedCallback() {
    this.#buildNoteButtons();

    // abort any previous controllers before creating a new one
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    const { signal } = this.#abortController;

    this.#mainButton.addEventListener(
      "click",
      () => {
        this.#noteSelectorDialog.showModal();
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
          this.#noteSelectorDialog.close();
          this.#dispatchNoteSelectedEvent();
        }
      },
      { signal },
    );

    this.#closeDialogButton.addEventListener(
      "click",
      () => this.#noteSelectorDialog.close(),
      { signal },
    );

    this.#updateNoteSelectorButton();
    this.#syncSelectedNoteAttribute();
  }

  #buildNoteButtons() {
    const noteGroups = this.hasAttribute("root-notes-only")
      ? enharmonicRootNoteGroups
      : enharmonicNoteNameGroups;

    const buttonsHtml = noteGroups
      .map(
        (notes, index) =>
          /* HTML */ `<div
          class="note-group"
          role="group"
          aria-label="Pitch ${index}"
        >
          ${
            notes
              .map(
                (note) =>
                  /* HTML */ `<button
                part="note-button"
                data-note-name="${note}"
                data-note-integer="${index}"
              >
                ${note}
              </button>`,
              )
              .join("")
          }
        </div>`,
      )
      .join("");

    this.#enharmonicNoteButtonsDiv.innerHTML = buttonsHtml;
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
        this.#buildNoteButtons();
        break;
    }
  }

  #updateNoteSelectorButton() {
    if (this.#selectedNoteName && this.#selectedNoteInteger !== null) {
      // State when a note is selected
      this.#selectedNoteNameSpan.textContent = this.#selectedNoteName;
      this.#selectedNoteNameSpan.style.display = "initial";
      this.#mainButton.querySelector("slot")!.style.display = "none";
      this.#mainButton.setAttribute(
        "data-note-integer",
        this.#selectedNoteInteger.toString(),
      );
      this.#mainButton.ariaLabel = `${this.#selectedNoteName} selected`;
    } else {
      // Default state when no note is selected
      this.#selectedNoteNameSpan.style.display = "none";
      this.#mainButton.querySelector("slot")!.style.display = "initial";
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
    const noteGroups = this.hasAttribute("root-notes-only")
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
        const textColor = color ? this.#getContrastColor(color) : null;
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

  /**
   * Calculates whether black or white text has a better contrast ratio against a given background color.
   * @param {string} color - The background color in a CSS-compatible format (e.g., hex, rgb).
   * @returns {'black' | 'white'} - The color that provides better contrast.
   */
  #getContrastColor(color: string): "black" | "white" {
    // Create a temporary element to resolve the color to RGB
    const tempDiv = document.createElement("div");
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);

    // Get the computed RGB value
    const computedColor = globalThis.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    const rgbMatch = computedColor.match(/\d+/g);
    if (!rgbMatch) {
      return "black"; // Default to black if color parsing fails
    }

    const [r, g, b] = rgbMatch.map(Number);

    // Formula for relative luminance (from WCAG)
    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const getLuminance = (c: number) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    };

    const luminance = 0.2126 * getLuminance(r) +
      0.7152 * getLuminance(g) +
      0.0722 * getLuminance(b);

    // Use a threshold of 0.179 as recommended by WCAG for contrast
    return luminance > 0.179 ? "black" : "white";
  }
}

customElements.define("enharmonic-note-selector", EnharmonicNoteSelector);

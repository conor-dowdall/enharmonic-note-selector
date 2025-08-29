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
  type NoteInteger,
  type NoteName,
  rootNotes,
} from "@musodojo/music-theory-data";

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

    #note-selector-button {
      width: 100%;
      height: 100%;
      padding: var(--_enharmonic-note-selector-padding);
    }

    #note-selector-button,
    .enharmonic-note-button {
      text-decoration: transparent underline solid 0.1em;

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

    #close-dialog-button {
      display: block;
      padding: 0.1em 0.5em;
      border: none;
      margin-inline-start: auto;
    }

    dialog {
      font-size: 1.2em;
      padding: 0.5em;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    #enharmonic-note-buttons-div {
      text-align: center;
    }

    .enharmonic-note-button {
      min-width: 4ch;
      height: 4ch;
    }

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
        .filter((note) => (rootNotes as readonly string[]).includes(note))
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

export interface EnharmonicNoteSelectedEventDetail {
  noteName: string;
  noteInteger: NoteInteger;
}

export class EnharmonicNoteSelector extends HTMLElement {
  #shadowRoot: ShadowRoot;
  #noteSelectorButton: HTMLButtonElement | null = null;
  #noteSelectorDialog: HTMLDialogElement | null = null;
  #abortController: AbortController | null = null;
  #selectedNoteName: string | null = null;
  #selectedNoteInteger: NoteInteger | null = null;
  #noteColorGroup: ColorGroup | null = null;

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

  #updateSelectedNoteAttribute() {
    if (this.#selectedNoteName) {
      this.setAttribute("selected-note-name", this.#selectedNoteName);
    } else {
      this.removeAttribute("selected-note-name");
    }
  }

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

  get selectedNoteName(): string | null {
    return this.#selectedNoteName;
  }

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

  get selectedNoteInteger(): NoteInteger | null {
    return this.#selectedNoteInteger;
  }

  get noteColorGroup(): ColorGroup | null {
    return this.#noteColorGroup;
  }

  set noteColorGroup(noteColorGroup: ColorGroup | null) {
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

customElements.define("enharmonic-note-selector", EnharmonicNoteSelector);

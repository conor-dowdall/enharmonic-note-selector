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

    svg {
      fill: currentColor;
    }

    #main-button {
      display: grid;
      place-items: center;

      > slot {
        height: 2.5ch;
      }

      ::slotted(svg),
      ::slotted(img),
      > slot > svg {
        grid-area: 1 / 1;
        width: 2.5ch; /* Sizing for icons */
        height: 2.5ch; /* Sizing for icons */
      }
    }

    #main-button,
    .enharmonic-note-button {
      text-decoration: transparent underline solid 0.12em;

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

    dialog {
      padding: 0.5em;

      > #close-dialog-button {
        display: block;
        padding: 0.1em 0.5em;
        border: none;
        margin-inline-start: auto;

        > slot > svg,
        > slot > img {
          width: 2ch;
          height: 2ch;
        }
      }
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
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

    #enharmonic-note-buttons-div {
      display: flex;
      flex-direction: column;
      gap: 0.4em;

      > .note-group {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.4em;

        > .enharmonic-note-button {
          min-width: 7ch;
          height: 3.5ch;
          border: 1px solid
            color-mix(in srgb, currentColor 50%, transparent 50%);
          border-radius: 0.5em;
        }
      }
    }
  </style>

  <button id="main-button" part="main-button">
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

  <dialog id="note-selector-dialog" aria-labelledby="dialog-heading">
    <button id="close-dialog-button">
      <slot name="close-icon">
        <!-- Default icon when no note is selected. Can be overridden by the user. This
      SVG is part of the project and is licensed under CC0 1.0 Universal. -->
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
      <!-- the buttons in here are dynamically generated -->
    </div>
  </dialog>
`;

export interface EnharmonicNoteSelectedEventDetail {
  noteName: string;
  noteInteger: RootNoteInteger;
}

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
      "#main-button",
    );

    const noteSelectorDialog = this.#shadowRoot.querySelector<
      HTMLDialogElement
    >(
      "#note-selector-dialog",
    );

    const closeDialogButton = this.#shadowRoot.querySelector<HTMLButtonElement>(
      "#close-dialog-button",
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
          ".enharmonic-note-button",
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
                class="enharmonic-note-button"
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

  get rootNotesOnly(): boolean {
    return this.hasAttribute("root-notes-only");
  }

  set rootNotesOnly(value: boolean) {
    this.toggleAttribute("root-notes-only", value);
  }

  setRandomNote() {
    const noteGroups = this.hasAttribute("root-notes-only")
      ? enharmonicRootNoteGroups
      : enharmonicNoteNameGroups;

    const randomIndex = Math.floor(Math.random() * noteGroups.length);
    const randomNote = noteGroups[randomIndex][
      Math.floor(Math.random() * noteGroups[randomIndex].length)
    ];
    this.selectedNoteName = randomNote;
  }

  get selectedNoteInteger(): RootNoteInteger | null {
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

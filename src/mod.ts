/**
 * A custom HTML element that allows users to select an enharmonic note.
 *
 * Features:
 * - Displays a button that, when clicked, opens a dialog.
 * - The dialog shows all enharmonic equivalents for each pitch class.
 * - Supports setting a note color theme via CSS custom properties.
 * - Dispatches a custom event ('enharmonic-note-selected') when a note is selected.
 * - Exposes 'selectedNoteName' and 'selectedPitchInteger' properties.
 * - Supports setting the selected note via the 'selected-note-name' attribute on the element.
 * - Uses CSS custom properties for theming.
 *
 * @example
 * See examples/ directory for usage examples.
 *
 * @module
 */

import {
  enharmonicNotes,
  type PitchInteger,
} from "@musodojo/music-theory-data";
import type { NoteColorGroup } from "@musodojo/note-colors-data";

const enharmonicNoteSelectorTemplate = document.createElement("template");
enharmonicNoteSelectorTemplate.innerHTML = /* HTML */ `
  <style>
    :host {
      --_note-color-0: var(--note-color-0, currentColor);
      --_note-color-1: var(--note-color-1, currentColor);
      --_note-color-2: var(--note-color-2, currentColor);
      --_note-color-3: var(--note-color-3, currentColor);
      --_note-color-4: var(--note-color-4, currentColor);
      --_note-color-5: var(--note-color-5, currentColor);
      --_note-color-6: var(--note-color-6, currentColor);
      --_note-color-7: var(--note-color-7, currentColor);
      --_note-color-8: var(--note-color-8, currentColor);
      --_note-color-9: var(--note-color-9, currentColor);
      --_note-color-10: var(--note-color-10, currentColor);
      --_note-color-11: var(--note-color-11, currentColor);

      display: inline-block;
      font-size: inherit;
    }

    button {
      font: inherit;
      margin: 0;
      padding: 0;
      padding-inline: 0.5ch;
      min-width: 4ch;
      cursor: pointer;
      background: none;
      border-radius: 0.5em;
      border-width: 0.05em;
      border-style: solid;
      border-color: currentColor;

      &[data-pitch-integer="0"] {
        border-color: var(--_note-color-0);
      }
      &[data-pitch-integer="1"] {
        border-color: var(--_note-color-1);
      }
      &[data-pitch-integer="2"] {
        border-color: var(--_note-color-2);
      }
      &[data-pitch-integer="3"] {
        border-color: var(--_note-color-3);
      }
      &[data-pitch-integer="4"] {
        border-color: var(--_note-color-4);
      }
      &[data-pitch-integer="5"] {
        border-color: var(--_note-color-5);
      }
      &[data-pitch-integer="6"] {
        border-color: var(--_note-color-6);
      }
      &[data-pitch-integer="7"] {
        border-color: var(--_note-color-7);
      }
      &[data-pitch-integer="8"] {
        border-color: var(--_note-color-8);
      }
      &[data-pitch-integer="9"] {
        border-color: var(--_note-color-9);
      }
      &[data-pitch-integer="10"] {
        border-color: var(--_note-color-10);
      }
      &[data-pitch-integer="11"] {
        border-color: var(--_note-color-11);
      }
    }

    #note-selector-button {
    }

    #close-dialog-button {
      display: block;
      padding: 0.1em 0.5em;
      border: none;
      margin-inline-start: auto;
    }

    dialog {
      padding: 0.5em;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    #enharmonic-note-buttons-div {
      text-align: center;
    }

    .enharmonic-note-button {
      margin-inline: 0.2em;
    }

    hr {
      margin-block: 0.2em;
    }
  </style>

  <button id="note-selector-button"></button>

  <dialog id="note-selector-dialog">
    <button id="close-dialog-button">×</button>

    <div id="enharmonic-note-buttons-div">
      ${enharmonicNotes
        .map((notes, index) =>
          notes
            .map(
              (note) => /* HTML */ `<button
                class="enharmonic-note-button"
                data-note-name="${note}"
                data-pitch-integer="${index}"
              >
                ${note}
              </button>`
            )
            .join("")
        )
        .join(/* HTML */ `<hr />`)}
    </div>
  </dialog>
`;

export interface EnharmonicNoteSelectedEventDetail {
  noteName: string | null;
  pitchInteger: PitchInteger | null;
}

class EnharmonicNoteSelector extends HTMLElement {
  #shadowRoot: ShadowRoot;
  #noteSelectorButton: HTMLButtonElement | null = null;
  #noteSelectorDialog: HTMLDialogElement | null = null;
  #abortController: AbortController | null = null;
  #selectedNoteName: string | null = null;
  #selectedPitchInteger: PitchInteger | null = null;
  #noteColorGroup: NoteColorGroup | null = null;

  static get observedAttributes(): string[] {
    return ["selected-note-name"];
  }

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#shadowRoot.appendChild(
      enharmonicNoteSelectorTemplate.content.cloneNode(true)
    );

    this.#noteSelectorButton =
      this.#shadowRoot.querySelector<HTMLButtonElement>(
        "#note-selector-button"
      );

    this.#noteSelectorDialog =
      this.#shadowRoot.querySelector<HTMLDialogElement>(
        "#note-selector-dialog"
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
        { signal }
      );

      const enharmonicNoteButtons = this.#shadowRoot.querySelectorAll(
        ".enharmonic-note-button"
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
          { signal }
        );
      });

      const closeDialogButton = this.#shadowRoot.getElementById(
        "close-dialog-button"
      ) as HTMLButtonElement;
      closeDialogButton.addEventListener(
        "click",
        () => {
          this.#noteSelectorDialog!.close();
        },
        { signal }
      );

      this.#updateNoteSelectorButtonText();
      this.#updateSelectedNoteAttribute();
    } else {
      console.error(
        "Failed to find note-selector button element or dialog element"
      );
    }
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue === newValue) return;
    if (name === "selected-note-name") this.selectedNoteName = newValue;
  }

  #updateNoteSelectorButtonText() {
    this.#noteSelectorButton!.textContent = this.#selectedNoteName
      ? this.#selectedNoteName
      : "𝅘𝅥𝄙";
    this.#selectedPitchInteger === null
      ? this.#noteSelectorButton?.removeAttribute("data-pitch-integer")
      : this.#noteSelectorButton?.setAttribute(
          "data-pitch-integer",
          this.#selectedPitchInteger.toString()
        );
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
    this.dispatchEvent(
      new CustomEvent<EnharmonicNoteSelectedEventDetail>(
        "enharmonic-note-selected",
        {
          detail: {
            noteName: this.#selectedNoteName,
            pitchInteger: this.#selectedPitchInteger,
          },
          bubbles: true,
          composed: true,
        }
      )
    );
  }

  get selectedNoteName(): string | null {
    return this.#selectedNoteName;
  }

  set selectedNoteName(newNote: string | null) {
    // reset values until proven valid
    this.#selectedNoteName = null;
    this.#selectedPitchInteger = null;

    if (newNote !== null) {
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

  get selectedPitchInteger(): PitchInteger | null {
    return this.#selectedPitchInteger;
  }

  get noteColorGroup(): NoteColorGroup | null {
    return this.#noteColorGroup;
  }

  set noteColorGroup(noteColorGroup: NoteColorGroup | null) {
    if (noteColorGroup) {
      this.#noteColorGroup = noteColorGroup;
      for (let i = 0; i < 12; i++) {
        this.style.setProperty(`--note-color-${i}`, noteColorGroup[i]);
      }
    } else {
      this.#noteColorGroup = null;
      for (let i = 0; i < 12; i++) {
        this.style.setProperty(`--note-color-${i}`, null);
      }
    }
  }
}

customElements.define("enharmonic-note-selector", EnharmonicNoteSelector);

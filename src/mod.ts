import {
  enharmonicNotes,
  type PitchInteger,
} from "@musodojo/music-theory-data";

const enharmonicNoteSelectorTemplate = document.createElement("template");
enharmonicNoteSelectorTemplate.innerHTML = /* HTML */ `
  <style>
    button {
      cursor: pointer;
      font: inherit;
    }

    dialog {
      text-align: center;
    }

    .note-button {
      margin-inline: 0.5em;
    }

    #cancelBtn {
      margin-top: 1em;
    }

    #selectNoteButton {
      border: none;
      background-color: transparent;
    }
  </style>

  <button id="selectNoteButton"></button>

  <dialog id="selectNoteDialog">
    <div>
      ${enharmonicNotes
        .map((notes, index) =>
          notes
            .map(
              (note) => `<button
                class="note-button"
                data-note-name="${note}"
                data-pitch-integer="${index}">${note}</button>`
            )
            .join("")
        )
        .join("<hr>")}
    </div>

    <button id="cancelBtn">Cancel</button>
  </dialog>
`;

interface EnharmonicNoteSelectedEventDetail {
  noteName: string | null;
  pitchInteger: PitchInteger | null;
}

class EnharmonicNoteSelector extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["selected-note"];
  }

  #shadowRoot: ShadowRoot;
  #selectedNoteName: string | null = null;
  #selectedPitchInteger: PitchInteger | null = null;
  #selectNoteButton: HTMLButtonElement | null = null;
  #selectNoteDialog: HTMLDialogElement | null = null;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#shadowRoot.appendChild(
      enharmonicNoteSelectorTemplate.content.cloneNode(true)
    );

    this.#selectNoteButton = this.#shadowRoot.getElementById(
      "selectNoteButton"
    ) as HTMLButtonElement;

    this.#selectNoteDialog = this.#shadowRoot.getElementById(
      "selectNoteDialog"
    ) as HTMLDialogElement;
  }

  connectedCallback() {
    if (this.#selectNoteButton && this.#selectNoteDialog) {
      this.#selectNoteButton.addEventListener("click", () => {
        this.#selectNoteDialog?.showModal();
      });

      const noteButtons = this.#shadowRoot.querySelectorAll(
        ".note-button"
      ) as NodeListOf<HTMLButtonElement>;

      noteButtons.forEach((button) => {
        button.addEventListener("click", () => {
          this.#selectedNoteName = button.dataset.noteName || null;

          this.#selectedPitchInteger = button.dataset.pitchInteger
            ? (parseInt(button.dataset.pitchInteger, 10) as PitchInteger)
            : null;

          this.#updateSelectNoteButtonText();
          this.#updateAttribute();
          this.#selectNoteDialog?.close();
          this.#dispatchNoteSelectedEvent();
        });
      });

      const cancelButton = this.#shadowRoot.getElementById(
        "cancelBtn"
      ) as HTMLButtonElement;
      cancelButton.addEventListener("click", () => {
        this.#selectNoteDialog?.close();
      });

      this.#updateSelectNoteButtonText();
      this.#updateAttribute();
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (name === "selected-note" && oldValue !== newValue) {
      this.selectedNoteName = newValue;
    }
  }

  #updateSelectNoteButtonText() {
    if (this.#selectNoteButton) {
      this.#selectNoteButton.textContent = this.#selectedNoteName
        ? this.#selectedNoteName
        : "-";
    }
  }

  #updateAttribute() {
    if (this.#selectedNoteName) {
      this.setAttribute("selected-note", this.#selectedNoteName);
    } else {
      this.removeAttribute("selected-note");
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

    enharmonicNotes.forEach((group, index) => {
      if (group.includes(newNote as string)) {
        this.#selectedPitchInteger = index as PitchInteger;
      }
    });

    if (this.#selectedPitchInteger !== null) this.#selectedNoteName = newNote;

    this.#updateSelectNoteButtonText();
    this.#updateAttribute();
  }

  get selectedPitchInteger(): PitchInteger | null {
    return this.#selectedPitchInteger;
  }
}

customElements.define("enharmonic-note-selector", EnharmonicNoteSelector);

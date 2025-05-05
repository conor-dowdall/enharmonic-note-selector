import {
  enharmonicNotes,
  type PitchInteger,
} from "@musodojo/music-theory-data";

const enharmonicNoteSelectorTemplate = document.createElement("template");
enharmonicNoteSelectorTemplate.innerHTML = /* HTML */ `
  <style>
    :host {
      display: inline-block;
      font-size: inherit;
    }

    button {
      width: 2em;
      height: 2em;
      margin: 0;
      padding: 0;
      cursor: pointer;
      font: inherit;
      border: none;
      background: none;
    }

    #close-dialog-button {
      display: block;
      padding: 0.1em 0.5em;
      margin-inline-start: auto;
    }

    dialog {
      padding: 0.2em;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    #enharmonic-note-buttons-div {
      text-align: center;
    }

    hr {
      margin-block: 0.1em;
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
  #noteSelectorButton: HTMLButtonElement | null = null;
  #noteSelectorDialog: HTMLDialogElement | null = null;
  #abortController: AbortController | null = null;

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

      enharmonicNoteButtons.forEach(
        (button) => {
          button.addEventListener("click", () => {
            this.#selectedNoteName = button.dataset.noteName || null;
            this.#selectedPitchInteger = button.dataset.pitchInteger
              ? (parseInt(button.dataset.pitchInteger, 10) as PitchInteger)
              : null;
            this.#updateNoteSelectorButtonText();
            this.#updateSelectedNoteAttribute();
            this.#noteSelectorDialog!.close();
            this.#dispatchNoteSelectedEvent();
          });
        },
        { signal }
      );

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
    if (name === "selected-note" && oldValue !== newValue) {
      this.selectedNoteName = newValue;
    }
  }

  #updateNoteSelectorButtonText() {
    this.#noteSelectorButton!.textContent = this.#selectedNoteName
      ? this.#selectedNoteName
      : "𝅘𝅥𝄙";
    this.#noteSelectorButton!.ariaLabel = this.#selectedNoteName
      ? `${this.#selectedNoteName} selected`
      : "Select Note";
  }

  #updateSelectedNoteAttribute() {
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
}

customElements.define("enharmonic-note-selector", EnharmonicNoteSelector);

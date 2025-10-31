# Enharmonic Note Selector Web Component

`enharmonic-note-selector` is a custom HTML element that allows users to select
a musical note (e.g., "C", "B♯", "D♯", "E♭") from a dialog and dispatch a custom
event.

- displays a button which opens a dialog containing all enharmonic equivalents
  for each pitch, including up to double sharps and flats.
- ability to limit choice to common root notes only.
- dispatches an event with the note name and note integer in the details.

[![npm version](https://img.shields.io/npm/v/@musodojo/enharmonic-note-selector.svg)](https://www.npmjs.com/package/@musodojo/enharmonic-note-selector)
[![npm downloads](https://img.shields.io/npm/dw/@musodojo/enharmonic-note-selector.svg)](https://www.npmjs.com/package/@musodojo/enharmonic-note-selector)
[![JSR score](https://jsr.io/badges/@musodojo/enharmonic-note-selector)](https://jsr.io/@musodojo/enharmonic-note-selector)

## Bundle

Create the `dist/bundle.js` file for the example

### Deno

```bash
deno task bundle
```

### Node

```bash
npm run bundle
```

**See examples/example1.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Simple Enharmonic Note Selector Example</title>
    <script type="module" src="../dist/bundle.js"></script>
  </head>
  <body>
    <h1>Enharmonic Note Selector</h1>
    <enharmonic-note-selector
      selected-note-name="C♯"
    ></enharmonic-note-selector>

    <script type="module">
      const selector = document.querySelector(
        "enharmonic-note-selector",
      );

      selector.addEventListener("enharmonic-note-selected", (e) => {
        console.log("Note name:", e.detail.noteName);
        console.log("Note integer:", e.detail.noteInteger);
      });
    </script>
  </body>
</html>
```

## Features

- **Enharmonic Note Selection:** Provides a user-friendly interface for choosing
  a specific enharmonic spelling.
- **Customizable Appearance:** Supports theming via CSS custom properties,
  allowing you to control the colors underlining each note / pitch-class.
- **Event Handling:** Dispatches an `enharmonic-note-selected` event when the
  user makes a selection, providing the selected note name and note integer.
- **Attributes and Properties:**
  - `selected-note-name` attribute: Sets the initially selected note name.
  - `selectedNoteName` property: Gets or sets the selected note name.
  - `selectedNoteInteger` property (read-only): Gets the integer representation
    of the selected note (0-11).
  - `noteColorGroup` property: Sets an array of 12 color strings for theming.
  - `root-notes-only` attribute: A boolean attribute that, when present,
    restricts the selection to only standard root notes.
- **Random Selection:** Includes a public method to programmatically select a
  random note.

## Styling with CSS Custom Properties

The component's appearance can be customized in several ways.

### Customizing Icons with Slots

You can replace the default icons for the main button and the close button using
HTML slots.

- **Main Button Icon:** Provide an element (like an `<img>` or `<svg>` or even
  `<p>Choose A Note</p>`) directly inside the `<enharmonic-note-selector>` tag.
  This will replace the default musical note icon that appears when no note is
  selected.

- **Close Button Icon:** To replace the 'X' icon in the dialog, add an element
  with the attribute `slot="close-dialog-icon"`.

```html
<enharmonic-note-selector>
  <!-- This SVG replaces the default main button icon -->
  <svg><!-- your custom svg --></svg>

  <!-- This SVG replaces the default close icon in the dialog -->
  <svg slot="close-dialog-icon"><!-- your custom svg --></svg>
</enharmonic-note-selector>
```

### Sizing and Padding using `::part()`

The main button inside the component is exposed via a shadow part named
`main-button`. This allows you to directly style its padding, font, and other
properties from your global stylesheet. This is the recommended way to control
the component's size and internal spacing.

```css
enharmonic-note-selector::part(main-button) {
  border: 1px solid currentColor;
  border-radius: 0.6em;
  padding: 0.3em 1em;
}

enharmonic-note-selector::part(main-button):hover {
  background-color: color-mix(in srgb, currentColor 20%, transparent 80%);
}
```

### Adding Note Colors

- `--note-color-0`: Color for pitch 0 (C)
- `--note-color-1`: Color for pitch 1 (C#/Db)
- `--note-color-2`: Color for pitch 2 (D)
- `--note-color-3`: Color for pitch 3 (D#/Eb)
- `--note-color-4`: Color for pitch 4 (E)
- `--note-color-5`: Color for pitch 5 (F)
- `--note-color-6`: Color for pitch 6 (F#/Gb)
- `--note-color-7`: Color for pitch 7 (G)
- `--note-color-8`: Color for pitch 8 (G#/Ab)
- `--note-color-9`: Color for pitch 9 (A)
- `--note-color-10`: Color for pitch 10 (A#/Bb)
- `--note-color-11`: Color for pitch 11 (B)

You can set these properties in your CSS to override the default colors. For
example, to use a custom color scheme:

```css
enharmonic-note-selector {
  --note-color-0: #ff0000; /* Red for C */
  --note-color-1: #ff7f00; /* Orange for C# */
  --note-color-2: #ffff00; /* Yellow for D */
  --note-color-3: #7fff00; /* Chartreuse for D# */
  --note-color-4: #00ff00; /* Green for E */
  --note-color-5: #00ff7f; /* Spring Green for F */
  --note-color-6: #00ffff; /* Cyan for F# */
  --note-color-7: #007fff; /* Azure for G */
  --note-color-8: #0000ff; /* Blue for G# */
  --note-color-9: #7f00ff; /* Violet for A */
  --note-color-10: #ff00ff; /* Magenta for A# */
  --note-color-11: #ff007f; /* Rose for B */
}
```

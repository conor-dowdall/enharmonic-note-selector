# Enharmonic Note Selector Web Component

`enharmonic-note-selector` is a custom HTML element that allows users to select
a musical note (e.g., "C", "B♯", "D♯", "E♭") from a dialog and dispatch a custom
event.

- displays a button which opens a dialog containing all enharmonic equivalents
  for each pitch, including up to double sharps and flats.
- ability to limit choice to common root notes only.
- dispatches an event with the note name and note integer in the details.

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
- **Customizable Appearance:** Supports theming via CSS custom properties and
  slots. You can set a background color for each note pitch, and the component
  will automatically calculate a high-contrast text color.
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

- **Main Button Icon:** Provide an element (e.g., `<img>`, `<svg>`,
  `<p>Choose A Note</p>`, `Any Text`) directly inside the
  `<enharmonic-note-selector>` tag. This will replace the default musical note
  icon that appears when no note is selected.

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

### Styling using `::part()`

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

Style the dialog part using `::part(dialog)`

```css
enharmonic-note-selector::part(dialog) {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.5em;
  padding: 1em;
}

enharmonic-note-selector::part(dialog)::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
```

Style each note button part using `::part(note-button)`

```css
enharmonic-note-selector::part(note-button) {
  border-radius: 0.5em;
  border: 0.2em solid white;
  box-shadow: 0 0 0.5em black;
}
```

Style the "Clear Selection" button part using `::part(clear-button)`

```css
enharmonic-note-selector::part(clear-button) {
  border-radius: 0.5em;
  border: 0.2em solid white;
  box-shadow: 0 0 0.5em black;
}
```

The CSS Custom properties `--dialog-backdrop-background` and `--default-spacing`
are also provided.

### Adding Note Colors

You can set a background color for each of the 12 note pitches using CSS custom
properties or the `noteColorGroup` JavaScript property. The component will
automatically calculate and apply a high-contrast text color (`black` or
`white`) to ensure readability.

The available properties are `--note-color-0` through `--note-color-11`.

- `--note-color-0`: Color for pitch 0 (C, B♯, D♭♭)
- `--note-color-1`: Color for pitch 1 (C♯, D♭)
- ...and so on for all 12 pitches.

You can set these in your CSS:

```css
enharmonic-note-selector {
  --note-color-0: #ff0000; /* Red for C */
  --note-color-1: #ff7f00; /* Orange for C# */
  --note-color-2: #ffff00; /* Yellow for D */
  /* ... etc. */
}
```

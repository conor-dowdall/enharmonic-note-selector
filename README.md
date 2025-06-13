# Enharmonic Note Selector Web Component

## Description

The `enharmonic-note-selector` is a custom HTML element that allows users to
select an enharmonic note (e.g., "C", "D♯", "E♭"). It displays a button which,
when clicked, opens a dialog containing all possible enharmonic equivalents for
each pitch.

## Features

- **Enharmonic Note Selection:** Provides a user-friendly interface for choosing
  a specific enharmonic spelling.
- **Customizable Appearance:** Supports theming via CSS custom properties,
  allowing you to control the colors of the note buttons.
- **Event Handling:** Dispatches a `enharmonic-note-selected` event when the
  user makes a selection, providing the selected note name and pitch integer.
- **Attributes and Properties:**
  - `selected-note-name` attribute: Sets the initially selected note name.
  - `selectedNoteName` property: Gets or sets the selected note name.
  - `selectedPitchInteger` property: Gets the integer representation of the
    selected pitch (0-11).
  - `noteColorTheme` property: Sets a predefined color theme.
- **Random Selection:** Includes a public method to programmatically select a
  random note, useful for demonstrations or practice applications.

## Styling with CSS Custom Properties

The component uses CSS custom properties to allow you to easily customize the
colors of the note buttons. The following custom properties are available:

### Padding

- `--enharmonic-note-selector-padding`: Padding to be applied to the element.
  Required so the inner button element remains clickable out to the edges of the
  outer element.

```css
enharmonic-note-selector {
  font-size: 2em;
  --enharmonic-note-selector-padding: 0.3em 1em;
  border: 1px solid currentColor;
  border-radius: 0.7em;
  &:hover {
    background-color: color-mix(in srgb, currentColor 20%, transparent 80%);
  }
}
```

### Note Colors

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

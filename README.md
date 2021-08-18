# `react-svg-favicon`

`react-svg-favicon` is a simple package for using dynamically generated "favicons" in your React app with the power of SVG. You just supply the SVG as regular React components and `react-svg-favicon` handles the rest.

## Installation

```sh
npm install react-svg-favicon
```

## Example usage

```js
import { useState } from "react";
import SVGIcon from "react-svg-favicon";

export function App() {
  var [notifications, setNotifications] = useState(0);

  return (
    <>
      <button onClick={() => setNotifications((n) => n + 1)}>
        Add notification
      </button>

      <SVGIcon>
        <svg viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={45} fill="orange" />
          <path
            d="M25 65 L40 50 L25 35 L35 25 L50 40 L65 25 L75 35 L60 50 L75 65 L65 75 L50 60 L35 75 Z"
            fill="black"
          />

          {notifications > 0 && (
            <>
              <circle cx={70} cy={70} r={30} fill="red" />
              <text
                x={70}
                y={85}
                fontSize={50}
                fontFamily="monospace"
                textAnchor="middle"
              >
                {notifications}
              </text>
            </>
          )}
        </svg>
      </SVGIcon>
    </>
  );
}
```

## Caveats

In some browsers, the custom icon won't override static icons specified in the html template.

The `SVGIcon` component adds a new `link[rel=icon]` element at the very end of the document head. It also has a `sizes="any"` attribute by default.

The browser _should_ always select the last icon specified, _unless_ it considers another icon better based on the `type`, `sizes`, and `media` attributes.

Since `"any"` should match every size possible, the new icon should always win, which it does in Firefox. Chromium, however, [doesn't follow the specification quite correctly](https://bugs.chromium.org/p/chromium/issues/detail?id=1162276).

To make it work in Chrome, you can either specify the same _one_ numerical size or `any` for both the dynamic and static icon, like this:

```html
<link rel="icon" type="image/x-icon" sizes="32x32" href="favicon.ico" />
<SVGIcon sizes="32x32">{/* Your code */}</SVGIcon>
```
or like this: ("any" is the default)
```html
<link rel="icon" type="image/x-icon" sizes="any" href="favicon.ico" />
<SVGIcon>{/* Your code */}</SVGIcon>
```

Alternatively, you can remove all old icons uppon page load by adding this script to index.js:

```js
for (var icon of document.querySelectorAll("link[rel=icon]")) {
  icon.parentElement.removeChild(icon);
}
```

This method is pretty much guaranteed to work.

## API

The package provides a single export:

### SVGIcon

This component renders its children to a `link[rel=icon]` element it appends to the document head.

In addition to the children property, it also accepts the `type`, `sizes`, and `media` attributes, which are passed to the link element.

Example with all attributes:

```html
<SVGIcon sizes="32x32" type="image/svg+xml" media="print">
  <svg viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={50} fill="red" />
  </svg>
</SVGIcon>
```

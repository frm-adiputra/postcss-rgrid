# PostCSS RGrid [![Build Status][ci-img]][ci]
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ffrm-adiputra%2Fpostcss-rgrid.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Ffrm-adiputra%2Fpostcss-rgrid?ref=badge_shield)

Languages: English | [Indonesian](README.id.md)

[PostCSS] plugin for simple and responsive grid.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/frm-adiputra/postcss-rgrid.svg
[ci]:      https://travis-ci.org/frm-adiputra/postcss-rgrid

## Features

- Implemented using CSS flexbox.
- Adjustable grid columns in media queries.
- Adjustable grid gutter and margin in media queries.


## Elements hierarchy

The **grid** element is a container that applies the grid rules.
Direct descendants of a grid element are called **row** elements.
The **row** element will wraps its direct descendants (**cell** elements)
according to the grid rules.

```html
<!-- you can use any class for the grid, row, and cell -->
<div class="grid">
  <div class="row">
    <div class="cell-1"></div>
    <div class="cell-2"></div>
  </div>
</div>
```


## Usage

```js
postcss([ require('postcss-rgrid') ])
```

### Usage examples

#### Creating a grid

First, you have to create a grid definition.
To create a new grid definition, use `@define-grid` at-rule.
In the following example the grid will be named `mygrid`.

```css
@define-grid mygrid {
  gutter: 24px;
  margin: 24px;
  columns: 12;
}
```

Inside the grid definition you can setup media queries to change the grid properties when those queries are matched.
For example in the following definition `mygrid` have two media queries named `phone` and `tablet`.
`mygrid` will change its columns, gutter, and margin when those queries are matched.

```css
@define-grid mygrid {
  gutter: 24px;
  margin: 24px;
  columns: 12;

  @define-media phone screen and (max-width: 480px) {
    gutter: 8px;
    margin: 16px;
    columns: 4;
  }

  @define-media tablet screen and (min-width: 481px) and (max-width: 840px) {
    gutter: 16px;
    margin: 16px;
    columns: 8;
  }
}
```

To actually use the grid you must apply it to some elements.
In the following example `.grid` will be the the grid container and `.row` will be the grid's row.

```css
/* CSS */

.grid {
  grid: mygrid;
}

.row {
  grid-row: mygrid;
}
```
```html
<!-- HTML -->

<div class="grid">
  <div class="row">
    ...
  </div>
</div>
```


#### Grid width

By default the grid is fluid, you can limit its width by setting `max-width` on grid container.


#### Styling grid's cell

Use `@grid-cell` to apply cell styles, and `@grid-cell-media` for the media breakpoints.
In the following example, `.cell-1` will have 10 columns span, but on `phone` (media query defined in `mygrid`) it will have 2 columns span.

Take a note that on `tablet` media query, `.cell-1` will automatically have 8 columns span instead of 10. This is because if the cell's columns span is larger than the grid's, then the grid's will be used.

```css
/* CSS */

.cell-1 {
  @grid-cell mygrid {
    grid-cell-span-columns: 10;

    @grid-media phone {
      grid-cell-span-columns: 2;
    }
  }
}
```
```html
<!-- HTML -->

<div class="grid">
 <div class="row">
  <div class="cell-1"></div>
 </div>
</div>
```


#### Cell's offset

Cells can have two different offsets, before the cell, and after the cell.

```css
.cell-1 {
  @grid-cell mygrid {

    /* 2 columns offset before the cell */
    grid-cell-span-columns: 10 2;
  }
}

.cell-2 {
  @grid-cell mygrid {

    /* 2 columns offset before the cell and 4 columns after the cell*/
    grid-cell-span-columns: 10 2 4;
  }
}
```


#### Aligning cells

The grid are implemented using flexbox, so to align all cells in a row you can use `align-items` property on the row elements. To align individual cell you can use `align-self` property.

```css
.row {
  align-items: center;
  grid-row: mygrid;
}

.cell-1 {
  align-self: flex-start;
  @grid-cell mygrid { ... }
}
```


#### Cell ordering

The grid are implemented using flexbox, so to manipulate cell ordering you can use flexbox properties `order`.

```css
.cell-1 {
  order: 2;
  @grid-cell mygrid { ... }
}
.cell-2 {
  order: 1;
  @grid-cell mygrid { ... }
}
```

## At-rules and properties

### `@define-grid`

`@define-grid` defines a new grid and gives a name to it.

Usage:

```css
@define-grid <grid-name> { ... }
```

Properties that are available to be used inside `@define-grid` rules are:

- `columns` (default: 12): the number of grid's columns.
- `gutter` (default: 16px): width of the grid's gutter.
- `margin` (default: 16px): width of the margin between each grid's cells.


### `@define-media`

`@define-media` defines media breakpoint to change the grid properties.
`@define-media` can only be used inside `@define-grid`.
`@define-media` used the same set of properties as `@define-grid`

Usage:

```css
@define-grid <grid-name> {

  @define-media <media-name> <media-queries> {
    /* change the grid properties */
  }
}
```

`@define-media` parameters:

- `media-name`: name to be used to reference this media breakpoints.
- `media-queries`: the media queries.


### `grid`

Use the `grid` property to apply grid's container rules.

Usage:

```css
.myGrid {
  /* ... */

  grid: <grid-name>;

  /* ... */
}
```


### `grid-row`

Use the `grid-row` property to apply grid's row rules.

Usage:

```css
.myGridRow {
  /* ... */

  grid-row: <grid-name>;

  /* ... */
}
```


### `@grid-cell`

Use the `@grid-cell` at-rule inside CSS selector to apply grid's cell rules to
the selector.

Usage:

```css
.myGridCell {
  @grid-cell <grid-name> { /* ... */ }
}
```

Inside the `@grid-cell` rule, you must set the `grid-cell-span-columns` property
to configure the grid's cell.


### `grid-cell-span-columns`

Use the `grid-cell-span-columns` property to configure a grid's cell.

Usage:

```css
.myGridCell {
  @grid-cell <grid-name> {
    grid-cell-span-columns: <cell-columns> [offset-before] [offset-after];
  }
}
```

Property values:

- `cell-columns`: number of columns for the cell.
- `offset-before`: number of columns for the offset before the cell.
- `offset-after`: number of columns for the offset after the cell.


### `@grid-cell-media`

Inside `@grid-cell`, you can use `@grid-cell-media` at-rule to modify cell's property at the grid's media
breakpoint.
This rule can only be used inside `@grid-cell` at-rule.

Usage:

```css
.myGridCell {
  @grid-cell <grid-name> {

    @grid-cell-media <media-name> {
      /* Change the cell's properties */
    }
  }
}
```

Parameters:

- `media-name`: the name of media queries defined in grid's definition.

This rule is basically just a CSS media queries, so inside this rule you're not
limited to only alter the `grid-cell-span-columns` property, but you can also
alter any other properties.


### `@grid-media`

When not inside a cell elements, you can use `@grid-media` at-rule to use media
queries defined in a grid definition.

Usage:

```css
.mySelector {
  @grid-media <grid-name> <media-name> {
    /* ... */
  }
}
```

Parameters:

- `grid-name`: the name of grid definition.
- `media-name`: the name of media query defined in the specified grid definition.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ffrm-adiputra%2Fpostcss-rgrid.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Ffrm-adiputra%2Fpostcss-rgrid?ref=badge_large)
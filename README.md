# PostCSS Mdgrid [![Build Status][ci-img]][ci]

[PostCSS] plugin for simple and responsive grid.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/frm-adiputra/postcss-mdgrid.svg
[ci]:      https://travis-ci.org/frm-adiputra/postcss-mdgrid

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-mdgrid') ])
```

```css
@define-grid mygrid {

  columns: 12; /* default value = 12 */
  gutter: 16px; /* default value = 16px */
  margin: 20px; /* default value = 16px */

  @define-media phone (max-width: 40px) {
    columns: 4;
    gutter: 8px;
  }
}

.grid {
  grid: mygrid;
}

.row {
  grid-row: mygrid;

  /* Use align-items property to align cells */
}

.cell {
  @grid-cell mygrid {

    /* span 2 columns without offset */
    col-span: 2;

    /* Use align-self property to align individual cell */
    /* Use order property to specify cell ordering */

    @grid-media phone { /* must not include grid name */

      /* span 2 columns with 1 column offset before the cell */
      col-span: 2 1;
    }

    @grid-media tablet { /* must not include grid name */

      /* span 2 columns with 1 column offset before and 3 column offset after the cell */
      col-span: 2 1 3;
    }
  }
}

.any {
  @grid-media mygrid phone { /* must include grid name */
    display: none;
  }
}
```

### Define grid

### Property options

#### grid

#### grid-row

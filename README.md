# PostCSS Mdgrid [![Build Status][ci-img]][ci]

[PostCSS] plugin Material Design Grid.

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

```
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
}

.cell {
  @grid-cell mygrid {
    span: 2;
    offset-before: 3;
    offset-after: 1;

    @grid-media phone { /* must not include grid name */
      span: 2;
      offset-before: 3;
      offset-after: 1;
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

```css
/*
 * sets margin and gutter to be the same size (16px) on phone, tablet,
 * and desktop
 */
@define-md-grid mygrid 16px;

/*
 * sets gutter to 16px and margin to 24px on phone, tablet, and desktop
 */
@define-md-grid mygrid 16px 24px;

/*
 * phone   gutter=16px margin=24px
 * tablet  gutter=8px  margin=16px
 * desktop gutter=24px margin=40px
 */
@define-md-grid mygrid 16px 24px 8px 16px 24px 40px;
```
### Property options

#### md-grid

#### md-cell

```css
/*
 * If offset values are not specified for a screen size then it will be
 * defaulted to 0.
 */
.cell {
  md-cell: mygrid 4 4 4 phone(2 3 6) tablet(4 5 2);
  md-cell-phone: mygrid 2 2 5;
}
```

See [PostCSS] docs for examples for your environment.

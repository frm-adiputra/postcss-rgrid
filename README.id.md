# Petunjuk Penggunaan PostCSS RGrid

Pilihan bahasa: [Inggris](README.md) | Indonesia

## Pendahuluan

PostCSS RGrid adalah _plug-in_ PostCSS untuk membuat _grid layout_ pada halaman _web_. Berbeda dengan plug-in untuk membuat _grid layout_ lainnya, konfigurasi PostCSS RGrid sangat sederhana namun bila diperlukan dapat pula menangani _layout_ yang kompleks. Selain itu PostCSS RGrid juga menyediakan fitur untuk membuat layout yang responsive dengan lebih mudah.

- PostCSS RGrid adalah _open source software_. Repositori kode program PostCSS RGrid dapat diakses pada https://github.com/frm-adiputra/postcss-rg
- PostCSS RGrid didistribusikan sebagai NPM _package_. Halaman NPM _package_ untuk PostCSS RGrid dapat diakses pada https://www.npmjs.com/package/postcss-rgrid

## Fitur

- PostCSS RGrid diimplementasikan menggunakan CSS Flexbox.
- Jumlah kolom yang dapat diatur dalam _media queries_.
- Gutter dan margin yang dapat diatur dalam _media queries_.

## Instalasi

PostCSS RGrid didistribusikan melalui NPM. NPM adalah _software registry_ untuk perangkat-perangkat lunak yang berhubungan dengan pengembangan web. Untuk melakukan instalasi PostCSS RGrid, pada direktori proyek anda jalankan perintah berikut

```shell
npm install postcss-rgrid
```

Untuk menggunakan PostCSS RGrid sebagai _plug-in_ dari PostCSS, pada kode program anda tambahkan kode program berikut ini

```javascript
postcss([require("postcss-rgrid")]);
```

## Penggunaan

### Konsep dan Hirarki Elemen dalam Grid

Terdapat tiga macam elemen yang digunakan oleh PostCSS RGrid, yaitu:

- grid: kontainer yang dikenai konfigurasi grid.
- row: elemen yang berada langsung di dalam elemen grid. Row merepresentasikan sebaris elemen dalam grid.
- cell: elemen yang berada langsung di dalam elemen row.

Grid, row, dan cell hanyalah konsep. Penamaan kelas dari elemen tidak harus grid, row, dan cell. Hirarki dari elemen-elemen tersebut dapat digambarkan pada contoh dalam halaman HTML berikut ini

```html
<!--
  Anda dapat menggunakan nama apa saja untuk
  grid, row, dan cell
-->
<div class="grid">
  <div class="row">
    <div class="cell-1"></div>
    <div class="cell-2"></div>
  </div>
</div>
```

### Contoh

#### Membuat grid

Sebelum menggunakan grid pada elemen, Anda harus mendefinisikannya terlebih dahulu. _At-rule_ @define-grid digunakan untuk mendefinisikan grid. Pada contoh berikut, didefinisikan grid dengan nama mygrid. Grid mygrid memiliki gutter dan margin sebesar 24px serta jumlah kolom di dalamnya sebanyak 12 kolom.

```css
/* CSS (PostCSS) */

@define-grid mygrid {
  gutter: 24px;
  margin: 24px;
  columns: 12;
}
```

Setelah grid didefinisikan, konfigurasi tersebut dapat diterapkan pada elemen-elemen yang diinginkan seperti berikut ini

```css
/* CSS (PostCSS) */

@define-grid mygrid {
  gutter: 24px;
  margin: 24px;
  columns: 12;
}

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

  </div>
</div>
```

Untuk mengimplementasikan desain responsif, dalam definisi grid anda dapat menentukan konfigurasi grid untuk berbagai media. Pada contoh berikut ini, grid memiliki dua buah media query yang diberi nama phone dan tablet. Bila mygrid ditampilkan pada media phone atau tablet, maka mygrid akan menggunakan konfigurasi yang bersesuaian. Namun bila tidak ditampilkan pada media yang tidak sesuai dengan phone atau tablet maka akan menggunakan konfigurasi default (konfigurasi yang tidak berada dalam media query).

```css
/* CSS (PostCSS) */

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

#### Konfigurasi cell pada grid

Gunakan @grid-cell untuk menentukan _default_ _style_ pada cell dan @grid-cell-media untuk menentukan _style_ cell pada media tertentu. Pada contoh berikut ini secara default .cell-1 akan menempati 10 kolom, namun pada media phone (media yang ditentukan dalam mygrid) .cell-1 akan menempati 2 kolom.

```css
/* CSS (PostCSS) */

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

Perlu diketahui pula bahwa untuk contoh di atas, saat ditampilkan pada media tablet, .cell-1 bukan menempati 10 kolom melainkan hanya 8 kolom. Hal tersebut terjadi karena mygrid bila ditampilkan pada media tablet hanya memiliki 8 kolom.

#### Menambahkan offset pada cell

Setiap cell dapat memiliki dua macam offset, yaitu sebelum dan sesudahnya. Pada contoh berikut sebelum .cell-1 dan .cell-2 akan terdapat offset sebesar 2 kolom. Setelah .cell-2 terdapat offset sebesar 4 kolom.

```css
/* CSS (PostCSS) */

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

#### Mengatur perataan horizontal pada cell

PostCSS RGrid diimplementasikan menggunakan CSS Felxbox. Oleh karena itu untuk mengatur perataan horizontal untuk seluruh cell dalam row dapat digunakan properti CSS align-items. Bila hanya ingin mengatur perataan horizontal untuk sebuah cell, dapat digunakan properti CSS align-self.

```css
/* CSS (PostCSS) */

.row {
  align-items: center;
  grid-row: mygrid;
}

.cell-1 {
  align-self: flex-start;
  @grid-cell mygrid { ... }
}
```

#### Urutan penempatan cell

PostCSS RGrid diimplementasikan menggunakan CSS Felxbox. Oleh karena itu untuk mengatur urutan penempatan cell, dapat digunakan properti CSS order seperti contoh berikut ini

```css
/* CSS (PostCSS) */

.cell-1 {
  order: 2;
  @grid-cell mygrid { ... }
}
.cell-2 {
  order: 1;
  @grid-cell mygrid { ... }
}
```

#### Lebar grid

Secara default, grid adalah fluid, yaitu lebar grid akan mengikuti lebar halaman. Untuk membatasi lebar grid, tambahkan properti CSS max-width.

## Properti dan At-rules

### @define-grid

Mendefinisikan grid baru. Sintaksis penggunaannya adalah

```
@define-grid <grid-name> { ... }
```

Properti yang dapat digunakan dalam @define-grid adalah

- columns: jumlah kolom dalam grid (default: 12).
- gutter: lebar jarak di samping kanan dan kiri grid (default: 16px).
- margin: lebar jarak antar cell (default: 16px).

### @define-media

Mendefinisikan _media breakpoints_ yang mengganti konfigurasi grid. @define-media hanya dapat digunakan dalam @define-grid. Properti yang dapat digunakan dalam @define-media sama dengan properti yang dapat digunakan dalam @define-grid. Sintaksis penggunaannya adalah sebagai berikut

```
@define-grid <grid-name> {

  @define-media <media-name> <media-queries> {

    /* tuliskan properti grid yang akan diganti */

  }
}
```

Parameter-parameter:

- media-name: nama yang akan digunakan untuk mereferensi _media breakpoint_ ini.
- media-queries: _media query_ yang akan mengaktifkan konfigurasi ini.

### grid

Properti grid digunakan untuk menerapkan konfigurasi kontainer grid pada CSS _selector_. Sintaksis penggunaannya adalah

```
<selector> {
	grid: <grid_name>;
}
```

### grid-row

Properti grid digunakan untuk menerapkan konfigurasi kontainer grid pada CSS _selector_. Sintaksis penggunaannya adalah

```
<selector> {
	grid-row: <grid_name>;
}
```

### @grid-cell

Digunakan untuk menerapkan konfigurasi cell pada CSS _selector_. Sintaksis penggunaannya adalah

```
<selector> {
	@grid-cell <grid-name> {
		/* … */
	}
}
```

Di dalam @grid-cell anda dapat menggunakan grid-cell-span-columns dan @grid-cell-media untuk mengkonfigurasi cell.

### grid-cell-span-columns

Properti ini digunakan untuk mengatur cell. Sintaksis penggunaannya adalah

```
<selector> {
  @grid-cell <grid-name> {
    grid-cell-span-columns: <cell-columns> [offset-before] [offset-after];
  }
}
```

Nilai-nilai properti:

- cell-columns: jumlah kolom yang dialokasikan untuk cell.
- offset-before: jumlah kolom offset yang ditempatkan sebelum cell (default: 0).
- offset-after: jumlah kolom offset yang ditempatkan setelah cell (default: 0).

### @grid-cell-media

@grid-cell-media hanya dapat digunakan di dalam @grid-cell. @grid-cell-media digunakan untuk memodifikasi konfigurasi cell pada media tertentu. Sintaksis penggunaannya adalah sebagai berikut

```
<selector> {

  @grid-cell <grid-name> {

    @grid-cell-media <media-name> {
      /*
      Tuliskan properti cell yang
      akan dimodifikasi
      */
    }
  }
}
```

Parameter:

- media-name: nama media query yang telah didefinisikan pada grid.

_Rule_ ini pada dasarnya hanya CSS _media query_ biasa, oleh karena itu dalam _rule_ ini Anda dapat memodifikasi properti CSS apapun. Tidak terbatas hanya pada grid-cell-span-columns.

### @grid-media

@grid-media serupa dengan @grid-cell-media. Hanya saja @grid-media digunakan di luar kalang @grid-cell. Sintaksis penggunaannya adalah sebagai berikut

```
<selector> {
  @grid-media <grid-name> <media-name> {
    /* ... */
  }
}
```

Parameter-parameter

- grid-name: nama dari definisi grid yang akan digunakan.
- media-name: nama dari _media query_ yang akan digunakan dan telah didefinisikan pada grid.

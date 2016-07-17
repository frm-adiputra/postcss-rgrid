import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

// function execPlugin(input, onResolved, onRejected, opts = {}) {
//     postcss([ plugin(opts) ]).process(input).then();
// }
//
// function handleRejected(t, input, onRejected, opts = {}) {
//     execPlugin(input, function () {
//         t.fail();
//     }, onRejected, opts);
// }
//
// function handleResolved(t, input, onResolved, opts = {}) {
//     execPlugin(input, onResolved, function () {
//         t.fail();
//     }, opts);
// }

function deepEqual(t, input, output, opts = {}) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

function processCSS(input, opts = {}) {
    return postcss([ plugin(opts) ]).process(input);
}

test('@define-grid invalid parameter', t => {
    var input = '@define-grid mygrid1 { @define-media phone {} }';

    t.throws(processCSS(input), /.*invalid parameter.*/);
});

test('@define-grid grid media redeclaration', t => {
    var input = '@define-grid mygrid2 { ' +
        '@define-media phone (min-width: 100px) {} ' +
        '@define-media phone (min-width: 100px) {} }';

    t.throws(processCSS(input), /.*grid media redeclaration.*/);
});

test('@define-grid remove after processing', t => {
    var input = '@define-grid mygrid3 { ' +
        '@define-media phone (min-width: 100px) {} }';

    return deepEqual(t, input, '');
});

test('@grid-media', t => {
    var input = '@define-grid mygrid4 { ' +
        '@define-media phone (min-width: 100px) {} } ' +
        'a { @grid-media mygrid4 phone { display: none; } }';

    return deepEqual(t, input,
        'a { }\n@media (min-width: 100px) {\n    ' +
        'a {\n        display: none\n    }\n}');
});

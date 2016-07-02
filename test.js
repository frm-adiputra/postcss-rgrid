import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function execPlugin(input, onResolved, onRejected, opts = {}) {
    postcss([ plugin(opts) ]).process(input).then();
}

function handleRejected(t, input, onRejected, opts = {}) {
    execPlugin(input, function () {
        t.fail();
    }, onRejected, opts);
}

function handleResolved(t, input, onResolved, opts = {}) {
    execPlugin(input, onResolved, function () {
        t.fail();
    }, opts);
}

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
    var input = '@define-grid mygrid { @define-media phone {} }';

    t.throws(processCSS(input), /.*invalid parameter.*/);
});

test('@define-grid grid media redeclaration', t => {
    var input = '@define-grid mygrid { ' +
        '@define-media phone (min-width: 100px) {} ' +
        '@define-media phone (min-width: 100px) {} }';

    t.throws(processCSS(input), /.*grid media redeclaration.*/);
});

test('@define-grid remove after processing', t => {
    var input = '@define-grid mygrid { ' +
        '@define-media phone (min-width: 100px) {} }';

    deepEqual(t, input, '');
});

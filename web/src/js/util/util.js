'use strict';

const SVGInjector = require('svg-injector');

/**
 * Replaces all the svg images tags with inline svgs.
 *
 * @return a Promise.
 */
export function svgInjectionPromise() {
    return new Promise(resolve => {
        SVGInjector(document.querySelectorAll('img.svg-inject'), { pngFallback: '/assets/images' }, resolve);
    });
}

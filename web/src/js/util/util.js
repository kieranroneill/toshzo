'use strict';

const Q = require('q');
const SVGInjector = require('svg-injector');

/**
 * Replaces all the svg images tags with inline svgs.
 *
 * @return a Promise.
 */
export function svgInjectionPromise() {
    const deferred = Q.defer();

    SVGInjector(document.querySelectorAll('img.svg-inject'), { pngFallback: '/assets/images' }, deferred.resolve);

    return deferred.promise;
}

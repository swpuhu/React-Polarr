!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s=0)}([function(e,t){onmessage=function(e){let[t,r]=e.data,n=((e,t)=>{let r=new Array(256).fill(0),n=new Array(256).fill(0),o=new Array(256).fill(0),u=0;for(let l=0;l<e.length;l+=4)r[e[l]]++,n[e[l+1]]++,o[e[l+2]]++,u=Math.max(u,r[e[l]],n[e[l+1]],n[e[l+2]]);for(let l=0;l<256;l++)r[l]=~~(t/u*r[l]),n[l]=~~(t/u*n[l]),o[l]=~~(t/u*o[l]);return[r,n,o]})(t,r);postMessage(n)}}]);
//# sourceMappingURL=8b5bcab159e1c917e266.worker.js.map
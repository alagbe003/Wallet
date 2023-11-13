/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../content/node_modules/uuid/dist/esm-browser/native.js":
/*!***************************************************************!*\
  !*** ../content/node_modules/uuid/dist/esm-browser/native.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  randomUUID
});

/***/ }),

/***/ "../content/node_modules/uuid/dist/esm-browser/regex.js":
/*!**************************************************************!*\
  !*** ../content/node_modules/uuid/dist/esm-browser/regex.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "../content/node_modules/uuid/dist/esm-browser/rng.js":
/*!************************************************************!*\
  !*** ../content/node_modules/uuid/dist/esm-browser/rng.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "../content/node_modules/uuid/dist/esm-browser/stringify.js":
/*!******************************************************************!*\
  !*** ../content/node_modules/uuid/dist/esm-browser/stringify.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "unsafeStringify": () => (/* binding */ unsafeStringify)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "../content/node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "../content/node_modules/uuid/dist/esm-browser/v4.js":
/*!***********************************************************!*\
  !*** ../content/node_modules/uuid/dist/esm-browser/v4.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ "../content/node_modules/uuid/dist/esm-browser/native.js");
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ "../content/node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ "../content/node_modules/uuid/dist/esm-browser/stringify.js");




function v4(options, buf, offset) {
  if (_native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID && !buf && !options) {
    return _native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "../content/node_modules/uuid/dist/esm-browser/validate.js":
/*!*****************************************************************!*\
  !*** ../content/node_modules/uuid/dist/esm-browser/validate.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "../content/node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "../content/src/initIFrameProviderConnection.ts":
/*!******************************************************!*\
  !*** ../content/src/initIFrameProviderConnection.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initIFrameProviderConnection": () => (/* binding */ initIFrameProviderConnection),
/* harmony export */   "parseIFrameToParentHandshake": () => (/* binding */ parseIFrameToParentHandshake)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ "../content/node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _injectInpageScript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./injectInpageScript */ "../content/src/injectInpageScript.ts");


const parseIFrameToParentHandshake = (msg) => {
    if (msg &&
        typeof msg === 'object' &&
        'type' in msg &&
        typeof msg.type === 'string' &&
        msg.type === 'iframe-to-parent-handshake' &&
        'id' in msg &&
        typeof msg.id === 'string') {
        return {
            type: 'iframe-to-parent-handshake',
            id: msg.id,
        };
    }
    return null;
};
const parseParentToIFrameHandshake = (msg) => {
    if (msg &&
        typeof msg === 'object' &&
        'type' in msg &&
        typeof msg.type === 'string' &&
        msg.type === 'parent-to-iframe-handshake' &&
        'parentId' in msg &&
        typeof msg.parentId === 'string' &&
        'childId' in msg &&
        typeof msg.childId === 'string') {
        return {
            type: 'parent-to-iframe-handshake',
            childId: msg.childId,
            parentId: msg.parentId,
        };
    }
    return null;
};
const findRootWindow = (current) => {
    if (current.parent === current) {
        return current;
    }
    return findRootWindow(current.parent);
};
const initIFrameProviderConnection = ({ window }) => {
    const auxId = (0,uuid__WEBPACK_IMPORTED_MODULE_1__["default"])();
    const rootWindow = findRootWindow(window);
    const initListener = (message) => {
        if (message.origin === rootWindow.origin) {
            const parentMessage = parseParentToIFrameHandshake(message.data);
            if (parentMessage && parentMessage.childId === auxId) {
                window.removeEventListener('message', initListener);
                (0,_injectInpageScript__WEBPACK_IMPORTED_MODULE_0__.injectInpageScript)({ window, id: parentMessage.parentId });
            }
        }
    };
    window.addEventListener('message', initListener);
    rootWindow.postMessage({
        type: 'iframe-to-parent-handshake',
        id: auxId,
    });
};


/***/ }),

/***/ "../content/src/injectInpageScript.ts":
/*!********************************************!*\
  !*** ../content/src/injectInpageScript.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "injectInpageScript": () => (/* binding */ injectInpageScript)
/* harmony export */ });
const injectInpageScript = ({ id, window, }) => {
    const { document } = window;
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(`inpage.js?instanceId=${id}&iframe=true`);
    const elementToInsertTo = document.head || document.documentElement;
    elementToInsertTo.prepend(script);
    elementToInsertTo.removeChild(script);
    return script;
};


/***/ }),

/***/ "../content/src/notReachable.ts":
/*!**************************************!*\
  !*** ../content/src/notReachable.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "notReachable": () => (/* binding */ notReachable)
/* harmony export */ });
const notReachable = (_) => {
    // eslint-disable-next-line no-console
    console.error(_);
    throw new Error(`should never be reached ${_}`);
};


/***/ }),

/***/ "../content/src/provider-connection.ts":
/*!*********************************************!*\
  !*** ../content/src/provider-connection.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initProviderConnection": () => (/* binding */ initProviderConnection)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuid */ "../content/node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _initIFrameProviderConnection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./initIFrameProviderConnection */ "../content/src/initIFrameProviderConnection.ts");
/* harmony import */ var _notReachable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notReachable */ "../content/src/notReachable.ts");
/* harmony import */ var _injectInpageScript__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./injectInpageScript */ "../content/src/injectInpageScript.ts");




const initProviderConnection = () => {
    const LS_KEY = 'zeal_widget';
    const savedState = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    const id = (0,uuid__WEBPACK_IMPORTED_MODULE_3__["default"])();
    let port = null;
    let messageBufferUntilReady = [];
    const bcm = new BroadcastChannel(id);
    // TODO :: re define types to support generic
    bcm.addEventListener('message', (e) => {
        if (e.origin === window.location.origin) {
            const message = e.data;
            if (port) {
                port.postMessage(message);
            }
            else {
                messageBufferUntilReady.push(message);
            }
        }
    });
    (0,_injectInpageScript__WEBPACK_IMPORTED_MODULE_2__.injectInpageScript)({ id, window });
    const iframe = document.createElement('iframe');
    const query = new URLSearchParams();
    query.append('dAppUrl', window.location.hostname);
    query.append('instanceId', id);
    query.append('type', 'zwidget');
    iframe.allow = 'clipboard-write; hid';
    iframe.src = chrome.runtime.getURL(`index.html?${query.toString()}`);
    iframe.width = '0px';
    iframe.height = '0px';
    iframe.setAttribute('style', `display: block !important;
     z-index: 10000000000 !important;
     border: none !important;
     position: fixed !important;
     box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;
     border-radius: 12px !important;
     pointer-events: auto !important;
`.trim());
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.top = `${savedState.top || 100}px`;
    iframe.style.right = `${savedState.right ? window.innerWidth - savedState.right : 24}px`;
    window.addEventListener('message', (message) => {
        if (message.source === iframe.contentWindow) {
            if (message.data?.type === 'ready') {
                port = chrome.runtime.connect(undefined, { name: id });
                messageBufferUntilReady.forEach((msg) => {
                    port.postMessage(msg);
                });
                messageBufferUntilReady = [];
                port.onMessage.addListener((msg) => {
                    switch (msg.type) {
                        case 'disconnect':
                        case 'account_change':
                        case 'rpc_response':
                        case 'network_change':
                        case 'init_provider':
                            bcm.postMessage(msg);
                            break;
                        case 'drag':
                            iframe.style.top = `${parseInt(iframe.style.top, 10) +
                                msg.movement.y}px`;
                            iframe.style.right = `${parseInt(iframe.style.right, 10) -
                                msg.movement.x}px`;
                            keepIframeInView(iframe);
                            localStorage.setItem(LS_KEY, JSON.stringify(iframe.getBoundingClientRect()));
                            break;
                        case 'change_iframe_size':
                            let size = {
                                width: iframe.width,
                                height: iframe.height,
                            };
                            switch (msg.size) {
                                case 'icon':
                                    size.width = '36px';
                                    size.height = '36px';
                                    break;
                                case 'small':
                                    size.width = '360px';
                                    size.height = '200px';
                                    break;
                                case 'large':
                                    size.width = '360px';
                                    size.height = '600px';
                                    break;
                                /* istanbul ignore next */
                                default:
                                    return (0,_notReachable__WEBPACK_IMPORTED_MODULE_1__.notReachable)(msg.size);
                            }
                            iframe.width = size.width;
                            iframe.height = size.height;
                            iframe.style.width = size.width;
                            iframe.style.height = size.height;
                            keepIframeInView(iframe);
                            break;
                        /* istanbul ignore next */
                        default:
                            return (0,_notReachable__WEBPACK_IMPORTED_MODULE_1__.notReachable)(msg);
                    }
                });
            }
        }
        else {
            const parentMessge = (0,_initIFrameProviderConnection__WEBPACK_IMPORTED_MODULE_0__.parseIFrameToParentHandshake)(message.data);
            if (parentMessge) {
                const source = message.source;
                const childId = parentMessge.id;
                if (source) {
                    source.postMessage({
                        type: 'parent-to-iframe-handshake',
                        childId,
                        parentId: id,
                    });
                }
            }
        }
    });
    const keepIframeInView = (iframe) => {
        const rect = iframe.getBoundingClientRect();
        if (rect.left < 0) {
            iframe.style.right = `${parseInt(iframe.style.right, 10) + rect.left - 20}px`;
        }
        if (rect.bottom >= window.innerHeight) {
            iframe.style.top = `${parseInt(iframe.style.top, 10) -
                (rect.bottom - window.innerHeight) -
                20}px`;
        }
        if (rect.top < 0) {
            iframe.style.top = '20px';
        }
        if (rect.right >= window.innerWidth) {
            iframe.style.right = '20px';
        }
    };
    const observer = new MutationObserver(function () {
        // While we need to insert script asap to compete for window.ethereum object
        // we want to insert iframe to body to have proper rendering
        if (document.body) {
            // It exists now
            document.body.append(iframe);
            keepIframeInView(iframe);
            observer.disconnect();
            // Create new observer for guarding
            if (window.location.href.match(/quickswap.exchange/gi)) {
                const guardObserver = new MutationObserver((mutations) => {
                    const added = mutations
                        .map((mutation) => Array.from(mutation.addedNodes))
                        .flat();
                    const quickSwapModal = added
                        .filter((item) => item instanceof HTMLDivElement)
                        .map((div) => div.querySelector('.MuiBox-root[tabindex="-1"]'))
                        .find(Boolean);
                    if (quickSwapModal) {
                        quickSwapModal.removeAttribute('tabindex');
                    }
                });
                guardObserver.observe(document.body, { childList: true });
            }
        }
    });
    observer.observe(document.documentElement, { childList: true });
};


/***/ }),

/***/ "../content/src/trezor-popup.ts":
/*!**************************************!*\
  !*** ../content/src/trezor-popup.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initTrezorConnection": () => (/* binding */ initTrezorConnection)
/* harmony export */ });
const initTrezorConnection = () => {
    let trPort = chrome.runtime.connect(undefined, {
        name: 'trezor-connect',
    });
    trPort.onMessage.addListener((message) => {
        window.postMessage(message, window.location.origin);
    });
    trPort.onDisconnect.addListener(() => {
        trPort = null;
    });
    window.addEventListener('message', (event) => {
        if (trPort && event.source === window && event.data) {
            trPort.postMessage({ data: event.data });
        }
    });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ../content/src/index.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _notReachable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notReachable */ "../content/src/notReachable.ts");
/* harmony import */ var _provider_connection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./provider-connection */ "../content/src/provider-connection.ts");
/* harmony import */ var _trezor_popup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./trezor-popup */ "../content/src/trezor-popup.ts");
/* harmony import */ var _initIFrameProviderConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./initIFrameProviderConnection */ "../content/src/initIFrameProviderConnection.ts");




const calculateScriptType = (url) => {
    const urlObject = new URL(url);
    const ignoredHosts = new Set(['www.meiamaratonadoporto.com']);
    if (ignoredHosts.has(urlObject.host)) {
        return { type: 'ignored' };
    }
    if (!!url.match(/^https:\/\/connect\.trezor\.io\/\d\/popup\.html/gim)) {
        return { type: 'trezor-popup' };
    }
    else if (window.parent !== window) {
        return { type: 'iframe-content-script' };
    }
    else {
        return { type: 'generic' };
    }
};
const scriptType = calculateScriptType(window.location.href);
switch (scriptType.type) {
    case 'generic':
        (0,_provider_connection__WEBPACK_IMPORTED_MODULE_1__.initProviderConnection)();
        break;
    case 'trezor-popup':
        (0,_trezor_popup__WEBPACK_IMPORTED_MODULE_2__.initTrezorConnection)();
        break;
    case 'ignored':
        // if site is ignored - we do nothing
        break;
    case 'iframe-content-script':
        (0,_initIFrameProviderConnection__WEBPACK_IMPORTED_MODULE_3__.initIFrameProviderConnection)({ window: window });
        break;
    default:
        (0,_notReachable__WEBPACK_IMPORTED_MODULE_0__.notReachable)(scriptType);
}

})();

/******/ })()
;
//# sourceMappingURL=content_script.js.map
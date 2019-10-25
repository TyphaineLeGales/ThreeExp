let undef;

const _prefixes = 'Webkit Moz O ms'.split(' ');
const _dummyStyle = document.createElement('div').style;
const _win = window;
const _doc = document;
const _ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

export const videoFormat = _testMediaFormat('video', ['video/mp4', 'video/ogv']);
export const audioFormat = _testMediaFormat('audio', ['audio/mp3', 'audio/ogg']);
export const isIFrame = _win.self !== _win.top;
export const isRetina = _win.devicePixelRatio && _win.devicePixelRatio >= 1.5;
export const isSupportOpacity = _dummyStyle.opacity !== undef;
export const cpuCoreCount = navigator.hardwareConcurrency || 1;

export const isEdge = _ua.indexOf('edge') > -1;
export const isIE = _ua.indexOf('msie') > -1;
export const isFirefox = _ua.indexOf('firefox') > -1;
export const isChrome = isEdge ? false : _ua.indexOf('chrome') > -1;
export const isSafari = isEdge || isChrome ? false : _ua.indexOf('safari') > -1;

export const isMobile = /(iPad|iPhone|Android)/i.test(_ua);
export const isIOS = /(iPad|iPhone)/i.test(_ua);

export const filterStyle = isIE ? undef : _getStyleName('filter');
export const transitionStyle = _getStyleName('transition');
export const transformStyle = _getStyleName('transform');
export const transform3dStyle = _getStyleName('transform', 'perspective');
export const transformPerspectiveStyle = _getStyleName('perspective');
export const transformOriginStyle = _getStyleName('transformOrigin');
export const WebAudioContext = _win.AudioContext || _win.webkitAudioContext;
export const baseUrl = document.location.origin;
export const seedRandom = require('seed-random')('AZ0xEIu9WazVHT');

function _testMediaFormat (type, orders) {
  let dom;
  try {
    switch (type) {
      case 'video':
        dom = new _win.Video();
        break;
      case 'audio':
        dom = new _win.Audio();
        break;
    }
  } catch (e) {
    dom = _doc.createElement(type);
  }
  let format;
  for (let i = 0, len = orders.length; i < len; i++) {
    if (dom.canPlayType && dom.canPlayType(orders[i])) {
      format = orders[i].substr(orders[i].indexOf('/') + 1);
      break;
    }
  }
  return format;
}

function _getStyleName (prop, refProp) {
  return _getPropFromIndex(prop, _getPropIndex(refProp || prop));
}

function _getPropIndex (prop) {
  let ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  let i = _prefixes.length;
  while (i--) {
    if (_dummyStyle[_prefixes[i] + ucProp] !== undef) {
      return i + 2;
    }
  }
  if (_dummyStyle[prop] !== undef) {
    return 1;
  }
  return 0;
}

function _getPropFromIndex (prop, index) {
  return index > 1 ? _prefixes[index - 2] + prop.charAt(0).toUpperCase() + prop.slice(1) : index === 1 ? prop : false;
}

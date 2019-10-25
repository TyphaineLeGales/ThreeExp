exports.createElements = createElements;
exports.createElement = createElement;
exports.removeSelf = removeSelf;
exports.clone = clone;
exports.filterByClass = filterByClass;

var _wrapper;

function createElements(html) {
    _wrapper = _wrapper || document.createElement('div');
    _wrapper.innerHTML = html;
    var childNodes = _wrapper.childNodes;
    var children = [];
    var i = childNodes.length;
    var item;
    while (i--) {
        item = childNodes[i];
        if (item.nodeType === 1) {
            children.unshift(item);
            _wrapper.removeChild(item);
        }
    }
    _wrapper.innerHTML = '';
    return children;
}

function createElement(html) {
    return createElements(html)[0];
}

function removeSelf(dom) {
    if (dom.parentNode) {
        dom.parentNode.removeChild(dom);
    }
    return dom;
}

function clone(dom) {
    return createElements(dom.outerHTML)[0];
}

function filterByClass(doms, className, firstOnly) {
    var list = [];
    for (var i = 0, len = doms.length; i < len; i++) {
        if (doms[i].classList.contains(className)) {
            if (firstOnly) {
                return doms[i];
            } else {
                list.push(doms[i]);
            }
        }
    }
    return firstOnly ? null : list;
}

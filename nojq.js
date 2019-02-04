//======CLASS
if (!Element.prototype._clss_has)
    Element.prototype._clss_has = function(clss){
        return new RegExp('(\\s|^)' + clss + '(\\s|$)').test(this.className)
    }
if (!Element.prototype._clss_add)
    Element.prototype._clss_add = function(clss){
        if(!this._clss_has(clss))
            this.className += ' ' + clss;
        return this;
    }
if (!Element.prototype._clss_remove)
    Element.prototype._clss_remove = function(clss){
        var classes = this.className.split(" ");
        this.className = "";
        for (var i = 0; i < classes.length; i++)
            if (classes[i] !== clss)
                this.className += classes[i] + " ";
        this.className = this.className.trim();
        return this;
    }

//======HTML
if (!Element.prototype._html_get)
    Element.prototype._html_get = function(){
        return this.innerHTML;
    }
if (!Element.prototype._html_set)
    Element.prototype._html_set = function(html){
        this.innerHTML = html;
        return this;
    }

//======ATTRIBUTES
if (!Element.prototype._attr_get)
    Element.prototype._attr_get = function(attr){
        return this.getAttribute(attr);
    }
if (!Element.prototype._attr_set)
    Element.prototype._attr_set = function(key, val){
        this.setAttribute(key, val);
        return this;
    }
if (!Element.prototype._attr_remove)
    Element.prototype._attr_remove = function(attr){
        this.removeAttribute(attr);
        return this;
    }

//======DATA
if (!Element.prototype._data_get)
    Element.prototype._data_get = function(itm){
        itm = itm || false;
        if(itm && this.data.hasOwnProperty(itm))
            return this.data.itm;
        return this.data;
    }
if (!Element.prototype._data_set)
    Element.prototype._data_set = function(key, val){
        var value = val || key;
        var hasData = this.hasOwnProperty('data');
        if (typeof key === 'object' && key === value){
            if (hasData)
                for (var k in value)
                    this.data[k] = value[k];
            else
                this.data = value;
        }else{
            if (hasData){
                this.data[key] = value;
            } else {
                this.data = {};
                this.data[key] = value
            }
        }
        return this;
    }

//======ELEMENT
if (!Element.prototype._el_appnd)
    Element.prototype._el_appnd = function(el){
        this.appendChild(el);
        return this;
    }
if (!Element.prototype._el_prpnd)
    Element.prototype._el_prpnd = function(el){
        this.insertBefore(el, this.firstChild)
        return this;
    }
if (!Element.prototype._el_mtch)
    Element.prototype._el_mtch = function(selector){
        return (this.matches || this.matchesSelector || this.msMatchesSelector || this.mozMatchesSelector || this.webkitMatchesSelector || this.oMatchesSelector).call(this, selector);
    }
if (!Element.prototype._el_sblngs)
    Element.prototype._el_sblngs = function(){
		return Array.prototype.filter.call(this.parentNode.children, function(child){
			return child !== this;
		});
    }
if (!Element.prototype._el_fade)
    Element.prototype._el_fade = function(action, duration){
        duration = duration || 400;
        var _this = this, n = action == 'in', t = action == 'out';
        _this.style.opacity = (n ? 0 : 1);
        if(n) _this.style.display = 'block';
        var last = +new Date();
        var tick = function() {
            _this.style.opacity = (n ? +_this.style.opacity + (new Date() - last) / duration : +_this.style.opacity - (new Date() - last) / duration);
            last = +new Date();
            if ((n && +_this.style.opacity < 1) || (t && +_this.style.opacity > 0))
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            else
                _this.style.opacity = (n ? 1 : 0);
        };
        tick();
        return _this;
    }
if (!Element.prototype._el_shw)
    Element.prototype._el_shw = function(){
        this.style.display = '';
        return this;
    }
if (!Element.prototype._el_hde)
    Element.prototype._el_hde = function(){
        this.style.display = 'none';
        return this;
    }

//======FUNCTIONS
var q_ = (function () {

    var createElement = function (tagName, options) {
        tagName = tagName || 'div';
        options = options || {};
        var el = document.createElement(tagName);

        for (var key in options)
            if (key === 'data' || key === 'className')
                el[key] = options[key]
            else if (key === 'html')
                el.innerHTML = options[key]
            else
                el.setAttribute(key, options[key])

        return el;
    }

    var getElement = function (selector, el) {
        if(selector.startsWith('#'))
            return document.getElementById(selector.substring(1));
        el = el || document;
        var els = el.querySelectorAll(selector);
        return (els.length < 1 ? false : els);
    }

    var removeElement = function (el) {
        if (!NodeList.prototype.isPrototypeOf(el))
            el.parentElement.removeChild(el);
        else
            for (var i = 0; i < el.length; i++)
                el[i].parentElement.removeChild(el[i]);
    }

    var post = function(url, data){
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(data);
    }

    var get = function(url, cb){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400)
                    cb(this.responseText)
                else
                    console.log('AjxGetError');
            }
        };
        request.send();
        request = null;
    }

    var loop = function (d, c) {
        if (Array.isArray(d) || NodeList.prototype.isPrototypeOf(d)) {
            for (var i = 0; i < d.length; i++)
                if (c(i, d[i]) === false)
                    break;
        } else {
            for (var i in d)
                if (c(i, d[i]) === false)
                    break;
        }
    }

    var extend = function () {
        var out = {}, i = 0, key;
        for (i = 0; i < arguments.length; i++) {
            if (!arguments[i])
                continue;
            for (key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    if (typeof arguments[i][key] === 'object')
                        out[key] = deepExtend(out[key], arguments[i][key]);
                    else
                        out[key] = arguments[i][key];
                }
            }
        }
        return out;
    }

    return {
        create: createElement,
        get: getElement,
        remove: removeElement,
        request: {
            post: post,
            get: get
        },
        loop: loop,
        extend: extend
    }

})();

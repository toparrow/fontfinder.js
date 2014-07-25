/**
 * fontfinder.js
 * Copyright (c) 2014, toparrow. (MIT Licensed)
 * https://github.com/toparrow/fontfinder.js
 */

(function (window) {
    function FontFinder(options) {
        if (!options) {
            options = {};
        }
        var defaultFont    = options.default        ? options.default        : 'デフォルト';
        var presetFontList = options.presetFontList ? options.presetFontList : [];
        this.checkString   = options.string         ? options.string         : '0aAあア亜';
        this.size          = options.size           ? options.size           : 16;

        this.setFont = function (font) {
            this.context.textBaseline = 'middle';
            this.context.font = this.size + 'px "' + font + '"';
        };
        this.getWidth = function () {
            return this.context.measureText(this.checkString).width;
        };
        this.write = function (text) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillText(text, 0, this.size / 2);
        };
        this.getData = function () {
            return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        };

        this.fontList = [defaultFont];
        this.canvas = window.document.createElement('canvas');
        this.canvas.height = this.size;
        this.context = this.canvas.getContext('2d');

        this.setFont(defaultFont);
        this.defaultWidth = this.getWidth();
        this.canvas.width = this.defaultWidth;
        this.setFont(defaultFont);
        this.write(this.checkString);
        this.defaultData = this.getData();
        for (var i in presetFontList) {
            var font = presetFontList[i];
            if (this.hasFont(font)) {
                this.fontList.push(font);
            }
        }

    }

    FontFinder.prototype.getFontList = function () {
        return this.fontList;
    };

    FontFinder.prototype.hasFont = function (font) {
        this.setFont(font);
        var width = this.getWidth();
        if (this.defaultWidth != width) {
            return true;
        }
        this.canvas.width = width;
        this.setFont(font);
        this.write(this.checkString);
        var data = this.getData();
        for (var i in data) {
            if (data[i] != this.defaultData[i]) {
                return true;
            }
        }
        return false;
    };


    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = FontFinder;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return FontFinder; });
    } else {
        window.FontFinder = FontFinder;
    }
})(window);

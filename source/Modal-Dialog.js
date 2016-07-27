define(['jquery', 'jQuery+'],  function ($) {

    var BOM = self,  DOM = self.document;

/* ---------- DOM 遮罩层  v0.2 ---------- */

    var $_DOM = $(DOM).ready(function () {
            $.cssRule({
                '.ShadowCover': {
                    position:      'absolute',
                    top:           0,
                    left:          0,
                    width:         '100%',
                    height:        '100%',
                    background:    'rgba(0, 0, 0, 0.7)',
                    display:       'table'
                },
                '.ShadowCover > *': {
                    display:             'table-cell',
                    'vertical-align':    'middle',
                    'text-align':        'center'
                }
            });
        }),
        _Instance_ = [ ];

    function Shade($_Container, iContent, CSS_Rule) {
        var _This_ = this;

        this.$_Cover = $('<div class="ShadowCover"><div /></div>');

        if (iContent)  $(this.$_Cover[0].firstChild).append(iContent);

        this.$_Cover.appendTo($_Container).zIndex('+');

        if ( $.isPlainObject(CSS_Rule) )
            this.$_Cover.cssRule(CSS_Rule,  function () {
                _This_.$_Style = $(arguments[0].ownerNode);
            });
        _Instance_.push(this);
    }

    Shade.prototype.close = function () {
        this.$_Cover.remove();
        if (this.$_Style)  this.$_Style.remove();

        _Instance_.splice(_Instance_.indexOf(this), 1);
    };

    Shade.clear = function () {
        for (var i = _Instance_.length - 1;  i > -1;  i--)
            _Instance_[i].close();
    };

    $.fn.shade = function () {
        var iArgs = $.makeArray(arguments).reverse();

        var More_Logic = (typeof iArgs[0] == 'function')  &&  iArgs.shift();
        var CSS_Rule = $.isPlainObject(iArgs[0]) && iArgs.shift();
        var iContent = iArgs[0];

        for (var i = 0, iCover;  i < this.length;  i++) {
            iCover = new Shade($(this[i]), iContent, CSS_Rule);

            if (More_Logic)  More_Logic.call(this[i], iCover);
        }
        return this;
    };

    $.shade = Shade;


/* ---------- DOM/BOM 模态框  v0.4 ---------- */

    var $_BOM = $(BOM);

    BOM.ModalWindow = function (iContent, iStyle, closeCB) {
        arguments.callee.lastInstance = $.extend(this, {
            opener:      BOM,
            self:        this,
            closed:      false,
            onunload:    closeCB,
            frames:      [ ],
            document:    { },
            locked:      ($.Type(iContent) == 'Window')
        });

        var _This_ = this;

        $('body').shade(this.locked ? null : iContent,  iStyle,  function () {
            _This_.__Shade__ = arguments[0];

            _This_.document.body = arguments[0].$_Cover.click(function () {
                if (! _This_.locked) {
                    if (arguments[0].target.parentNode === this)
                        _This_.close();
                } else
                    _This_.frames[0].focus();
            }).height( $_BOM.height() )[0];
        });
        if (! this.locked)  return;

        //  模态框 (BOM)
        this.frames[0] = iContent;

        $.every(0.2,  function () {
            if (iContent.closed) {
                _This_.close();
                return false;
            }
        });
        $_BOM.bind('unload',  function () {
            iContent.close();
        });
    };

    BOM.ModalWindow.prototype.close = function () {
        if (this.closed)  return;

        this.__Shade__.close();
        this.closed = true;

        if (typeof this.onunload == 'function')
            this.onunload.call(this.document.body);

        this.constructor.lastInstance = null;
    };

    $_DOM.keydown(function () {
        var _Instance_ = BOM.ModalWindow.lastInstance;
        if (! _Instance_)  return;

        if (! _Instance_.locked) {
            if (arguments[0].which == 27)
                _Instance_.close();
        } else
            _Instance_.frames[0].focus();
    });

    /* ----- 通用新窗口 ----- */

    function iOpen(iURL, Scale, iCallback) {
        Scale = (Scale > 0)  ?  Scale  :  3;
        var Size = {
            height:    BOM.screen.height / Scale,
            width:     BOM.screen.width / Scale
        };
        var Top = (BOM.screen.height - Size.height) / 2,
            Left = (BOM.screen.width - Size.width) / 2;

        BOM.alert("请留意本网页浏览器的“弹出窗口拦截”提示，当被禁止时请点选【允许】，然后可能需要重做之前的操作。");
        var new_Window = BOM.open(iURL, '_blank', [
                'top=' + Top,               'left=' + Left,
                'height=' + Size.height,    'width=' + Size.width,
                [
                    'resizable',  'scrollbars',
                    'menubar',    'toolbar',     'location',  'status'
                ].join('=no,').slice(0, -1)
            ].join(','));

        BOM.new_Window_Fix.call(new_Window, function () {
            $('link[rel~="shortcut"], link[rel~="icon"], link[rel~="bookmark"]')
                .add('<base target="_self" />')
                .appendTo(this.document.head);

            $(this.document).keydown(function (iEvent) {
                var iKeyCode = iEvent.which;

                if (
                    (iKeyCode == 122) ||                       //  F11
                    (iKeyCode == 116) ||                       //  (Ctrl + )F5
                    (iEvent.ctrlKey && (iKeyCode == 82)) ||    //  Ctrl + R
                    (iEvent.ctrlKey && (iKeyCode == 78)) ||    //  Ctrl + N
                    (iEvent.shiftKey && (iKeyCode == 121))     //  Shift + F10
                )
                    return false;
            }).mousedown(function () {
                if (arguments[0].which == 3)
                    return false;
            }).bind('contextmenu', false);
        });

        if (iCallback)
            $.every(0.2, function () {
                if (new_Window.closed) {
                    iCallback.call(BOM, new_Window);
                    return false;
                }
            });
        return new_Window;
    }

    /* ----- showModalDialog 扩展 ----- */

    var old_MD = BOM.showModalDialog;

    BOM.showModalDialog = function () {
        if (! arguments.length)
            throw 'A URL Argument is needed unless...';
        else if (BOM.ModalWindow.lastInstance)
            throw 'A ModalWindow Instance is running... (Please close it first.)';

        var iArgs = $.makeArray(arguments);

        var iContent = iArgs.shift();
        var iScale = (typeof iArgs[0] == 'number') && iArgs.shift();
        var iStyle = $.isPlainObject(iArgs[0]) && iArgs.shift();
        var CloseBack = (typeof iArgs[0] == 'function') && iArgs.shift();

        if (typeof iArgs[0] == 'string')
            return  (old_MD || BOM.open).apply(BOM, arguments);

        if (typeof iContent == 'string') {
            if (! iContent.match(/^(\w+:)?\/\/[\w\d\.:@]+/)) {
                var iTitle = iContent;
                iContent = 'about:blank';
            }
            iContent = new ModalWindow(
                iOpen(iContent, iScale, CloseBack)
            );
            BOM.new_Window_Fix.call(iContent.frames[0], function () {
                this.iTime = {
                    _Root_:    this,
                    now:       $.now,
                    every:     $.every,
                    wait:      $.wait
                };

                this.iTime.every(0.2, function () {
                    if (! this.opener) {
                        this.close();
                        return false;
                    }
                });
                if (iTitle)
                    $('<title />', {text:  iTitle}).appendTo(this.document.head);
            });
        } else
            iContent = new ModalWindow(iContent, iStyle, CloseBack);

        return iContent;
    };

});
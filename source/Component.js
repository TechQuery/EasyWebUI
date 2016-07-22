/* ---------- UI 组件 ---------- */

define(['jquery', 'DOM_Patch'],  function ($) {

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

/* ---------- 密码确认插件  v0.3 ---------- */

    //  By 魏如松

    var $_Hint = $('<div class="Hint" />').css({
            position:         'absolute',
            width:            '0.625em',
            'font-weight':    'bold'
        });

    function showHint() {
        var iPosition = this.position();

        $_Hint.clone().text( arguments[0] ).css({
            color:    arguments[1],
            left:     (iPosition.left + this.width() - $_Hint.width()) + 'px',
            top:      (iPosition.top + this.height() * 0.2) + 'px'
        }).appendTo(
            this.parent()
        );
    }

    $.fn.pwConfirm = function () {
        var pwGroup = { },
            $_passwordAll = this.find('input[type="password"][name]');

        //  密码明文查看
        var $_visible = $('<div class="visible" />').css({
                position:       'absolute',
                right:          '5%',
                top:            '8%',
                'z-index':      1000000,
                'font-size':    '26px',
                cursor:         'pointer'
            });
        $_passwordAll.parent().css('position', 'relative').append( $_visible.clone() )
            .find('.visible').html('&#10002;').click(function(){
                var $_this = $(this);

                if($_this.text() == '✒')
                    $_this.html('&#10001;').siblings('input').attr('type', 'text');
                else
                    $_this.html('&#10002;').siblings('input').attr('type', 'password');
            });

        //  密码输入验证
        $_passwordAll.each(function (){
            if (! pwGroup[this.name])
                pwGroup[this.name] = $_passwordAll.filter('[name="' + this.name + '"]');
            else
                return;

            var $_password = pwGroup[this.name],
                _Complete_ = 0;

            if ($_password.length < 2)  return;

            $_password.blur(function () {
                var $_this = $(this);

                $_this.parent().find('.Hint').remove();

                if (! this.value) return;

                if (! this.checkValidity())
                    showHint.call($_this, '×', 'red');
                else if (++_Complete_ == 2) {
                    var $_other = $_password.not(this);

                    showHint.apply(
                        $_this,
                        (this.value == $_other[0].value)  ?  ['√', 'green']  :  ['×', 'red']
                    );

                    _Complete_ = 0;
                } else
                    showHint.call($_this, '√', 'green');
            });
        });

        return this;
    };

/* ---------- 面板控件  v0.1 ---------- */

    $.fn.iPanel = function () {
        var $_This = this.is('.Panel') ? this : this.find('.Panel');

        return  $_This.each(function () {
            var $_Body = $(this).children('.Body');

            if (! ($_Body.length && $_Body.height()))
                $(this).addClass('closed');
        }).children('.Head').dblclick(function () {
            var $_Head = $(this);
            var $_Panel = $_Head.parent();

            var $_Head_Height = parseFloat( $_Head.css('height') )
                    + parseFloat( $_Head.css('margin-top') )
                    + parseFloat( $_Head.css('margin-bottom') )
                    + parseFloat( $_Panel.css('padding-top') ) * 2;

            if (! $_Panel.hasClass('closed')) {
                $_Panel.data('height', $_Panel.height());
                $_Panel.stop().animate({height:  $_Head_Height});
                $_Panel.addClass('closed');
            } else {
                $_Panel.stop().animate({height:  $_Panel.data('height')});
                $_Panel.removeClass('closed');
            }
        });
    };

/* ---------- 滚动悬停  v0.1 ---------- */

    var Fixed_List = [ ];

    $_DOM.scroll(function () {
        for (var i = 0, $_Fixed;  Fixed_List[i];  i++) {
            $_Fixed = $( Fixed_List[i] );

            if (
                (! $_Fixed.inViewport())  &&
                ($_Fixed.css('position') != 'fixed')
            )
                $_Fixed.css({
                    position:     'fixed',
                    top:          0,
                    'z-index':    100
                });
        }
    });

    $.fn.scrollFixed = function () {
        $.merge(Fixed_List, this);

        return this;
    };

/* ---------- 数据表 控件  v0.1 ---------- */

    var Sort_Class = {
            '':            'SortDown',
            'SortUp':      'SortDown',
            'SortDown':    'SortUp'
        };

    $.fn.iTable = function () {
        return  this.each(function () {
            var iLV = $.ListView( $('tbody', this) );

            $('th', $(this).children('thead')[0]).click(function () {
                var $_This = $(this);

                var iClass = ($_This.attr('class') || '').match(
                        /\s?(Sort(Up|Down))\s?/
                    );
                iClass = iClass ? iClass[1] : '';

                $_This.removeClass(iClass).addClass( Sort_Class[iClass] );

                var iNO = (Sort_Class[iClass] == 'SortUp')  ?  0.5  :  -0.5,
                    Index = $_This.index();

                iLV.sort(function () {
                    var A = $( arguments[2.5 - iNO][0].children[Index] ).text(),
                        B = $( arguments[2.5 + iNO][0].children[Index] ).text();

                    return  isNaN(parseFloat( A ))  ?
                        A.localeCompare( B )  :  (parseFloat(A) - parseFloat(B));
                });
            });
        });
    };

/* ---------- 标签页 控件  v0.5 ---------- */

    var Tab_Type = ['Point', 'Button', 'Monitor'];

    function Tab_Active() {
        var $_Label = this.children('label').not(arguments[0]);
        var $_Active = $_Label.filter('.active');

        $_Active = $_Active.length ? $_Active : $_Label;

        if ($_Active.length)  $_Active[0].click();
    }

    $.fn.iTab = function () {
        if (! $.browser.modern)
            this.on('click',  'input[type="radio"]',  function () {
                $(this).attr('checked', true)
                    .siblings('input[type="radio"]').removeAttr('checked');
            });

        return  this.on('click',  'label[for]',  function () {

            var $_This = $(this);

            if (! $_This.hasClass('active'))
                $_This.addClass('active').siblings().removeClass('active');

        }).each(function () {

            var $_Tab_Box = $(this),  iName = $.uuid('iTab'),  iType;

            for (var i = 0;  i < Tab_Type.length;  i++)
                if ($_Tab_Box.hasClass( Tab_Type[i] )) {
                    iType = Tab_Type[i];
                    $_Tab_Box.attr('data-tab-type', iType);
                }
        /* ----- 成员实例化核心 ----- */

            var Label_At = (this.children[0].tagName.toLowerCase() == 'label'),
                iSelector = ['input[type="radio"]',  'div, section, .Body'];
            iSelector[Label_At ? 'unshift' : 'push']('label');

            $.ListView(this,  iSelector,  function ($_Tab_Item) {
                var _UUID_ = $.uuid();

                var $_Label = $_Tab_Item.filter('label').attr('for', _UUID_),
                    $_Radio = $([
                        '<input type="radio" name=',  iName,  ' id=',  _UUID_,  ' />'
                    ].join('"'));

                if (! $.browser.modern)
                    $_Radio.change(function () {
                        if (this.checked)
                            this.setAttribute('checked', true);
                        else
                            this.removeAttribute('checked');
                    });

                return  [$_Label[0], $_Radio[0], $_Tab_Item.not($_Label)[0]];

            }).on('remove',  function () {

                var $_Label = arguments[0].filter('label');

                $('*[id="' + $_Label.attr('for') + '"]').remove();

                Tab_Active.call(this.$_View, $_Label);

            }).on('afterRender',  function () {

                var $_Tab_Head = $($.map(
                        this.$_View.children('input[type="radio"]'),
                        function () {
                            return  $('label[for="' + arguments[0].id + '"]')[0];
                        }
                    ))[Label_At ? 'prependTo' : 'appendTo']( this.$_View );

                Tab_Active.call( this.$_View );

                if (! this.$_View.hasClass('auto'))  return;

        /* ----- 自动切换模式 ----- */

                var Index = 0,  iPause;

                $.every(2,  function () {
                    if (iPause  ||  (! $_Tab_Box.hasClass('auto')))
                        return;

                    Index = (Index < $_Tab_Head.length)  ?  Index  :  0;

                    $_Tab_Head[Index++].click();
                });

                this.$_View.hover(
                    function () { iPause = true; },
                    function () { iPause = false; }
                );
            }).render(
                Array( $.ListView.getInstance(this).length )
            );
        }).swipe(function (iEvent) {
            if (
                (typeof iEvent.deltaX != 'number')  ||
                (Math.abs(iEvent.deltaY)  >  Math.abs(iEvent.deltaX))
            )
                return;

        /* ----- 滑动切换模式 ----- */

            var $_This = $(this),  $_Target = $(iEvent.target);

            var $_Path = $_Target.parentsUntil(this),
                $_Tab_Body = $_This.children().not('label, input');

            $_Target = $_Path.length ? $_Path.slice(-1) : $_Target;

            $_Target = $_Tab_Body.eq(
                (
                    $_Tab_Body.index($_Target) + (
                        (iEvent.deltaX < 0)  ?  1  :  -1
                    )
                ) % $_Tab_Body.length
            );

            $('label[for="' + $_Target[0].previousElementSibling.id + '"]')[0]
                .click();
        });
    };

/* ---------- 阅读导航栏  v0.3 ---------- */

    function toTreeData() {
        var iTree = [ ],  $_Tree = this;

        var _This_ = iTree,  _Parent_;

        this.each(function (Index) {
            var _Level_ = Index && (
                    this.tagName[1]  -  $_Tree[Index - 1].tagName[1]
                );

            if (_Level_ > 0) {
                _Parent_ = _This_;
                _This_ = _This_.slice(-1)[0].list = [ ];
            } else if (_Level_ < 0)
                _This_ = _Parent_;

            if (! this.id.match(/\w/))  this.id = $.uuid('Header');

            _This_.push({
                id:      this.id,
                text:    this.textContent
            });
        });

        return iTree;
    }

    $.fn.iReadNav = function ($_Context) {
        return  this.each(function () {
            var iMainNav = $.TreeView(
                    $.ListView(this,  function ($_Item, iValue) {

                        $('a', $_Item[0]).text(iValue.text)[0].href =
                            '#' + iValue.id;
                        $_Item.attr('title', iValue.text);
                    }),
                    function () {
                        arguments[0].$_View.attr('class', '');
                    }
                ).on('focus',  function (iEvent) {
                    if (iEvent.target.tagName.toLowerCase() != 'a')  return;

                    var $_Target = $(
                            '*[id="' + iEvent.target.href.split('#')[1] + '"]'
                        );
                    $_Target.scrollParents().eq(0).scrollTo( $_Target );
                }),
                _DOM_ = $_Context[0].ownerDocument;

            $_Context.scroll(function () {
                if (arguments[0].target !== this)  return;

                var iAnchor = $_Context.offset(),
                    iFontSize = $(_DOM_.body).css('font-size') / 2;

                var $_Anchor = $(_DOM_.elementFromPoint(
                        iAnchor.left + $_Context.css('padding-left') + iFontSize,
                        iAnchor.top + $_Context.css('padding-top') + iFontSize
                    )).prevAll('h1, h2, h3');

                if (! $.contains(this, $_Anchor[0]))  return;

                $_Anchor = $(
                    'a[href="#' + $_Anchor[0].id + '"]',  iMainNav.unit.$_View[0]
                );
                $('.ListView_Item.active', iMainNav.unit.$_View[0])
                    .removeClass('active');

                $.ListView.getInstance( $_Anchor.parents('.TreeNode')[0] )
                    .focus( $_Anchor[0].parentNode );

            }).on('Refresh',  function () {

                iMainNav.clear().render(
                    toTreeData.call( $('h1, h2, h3', this) )
                );
                return false;

            }).on('Clear',  function () {
                return  (! iMainNav.clear());
            });
        });
    };

/* ---------- 普通元素内容编辑  v0.1 ---------- */

    function StopBubble() {
        arguments[0].stopPropagation();
    }

    $.fn.contentEdit = function () {
        return  this.one('blur',  function () {

            var $_This = $(this);

            this.removeAttribute('contentEditable');

            $_This.off('click', StopBubble).off(
                'input propertychange paste keyup'
            );
            this.value = $_This.text().trim();

            if (! this.value)
                $_This.text(this.value = this.defaultValue);

        }).input(function () {

            var $_This = $(this);

            return  ($_This.text().trim().length <= $_This.attr('maxlength'));

        }).on('click', StopBubble).prop('defaultValue',  function () {

            return $(this).text().trim();

        }).prop('contentEditable', true).focus();
    };

/* ---------- 目录树  v0.2 ---------- */

    function branchDelete() {
        var iList = $.ListView.getInstance( this.parentNode );

        iList.remove( this );

        if (! iList.$_View[0].children[0])  iList.$_View.remove();

        return false;
    }

    $.fn.iTree = function (Sub_Key, onInsert) {
        return  this.each(function () {
            var iOrgTree = $.TreeView(
                    $.ListView(this, onInsert),
                    Sub_Key,
                    2,
                    function (iFork, iDepth, iData) {
                        iFork.$_View.parent().cssRule({
                            ':before':    {content:  (
                                '"'  +  (iData ? '-' : '+')  +  '"  !important'
                            )}
                        });
                    }
                ).on('focus',  function (iEvent) {
                    var _This_ = iEvent.currentTarget;

                    $(':input', _This_).focus();

                    var iRule = Array.prototype.slice.call(
                            BOM.getMatchedCSSRules(_This_, ':before'),  -1
                        )[0];

                    if (! (
                        iEvent.isPseudo() &&
                        $(iRule.parentStyleSheet.ownerNode)
                            .hasClass('iQuery_CSS-Rule')
                    ))
                        return;

                    iRule.style.setProperty('content', (
                        (iRule.style.content[1] == '-')  ?  '"+"'  :  '"-"'
                    ), 'important');
                });

            iOrgTree.unit.$_View
                .on('Insert',  '.ListView_Item',  function () {
                    var iSub = $.ListView.getInstance(
                            $(this).children('.TreeNode')
                        );

                    if ( iSub )
                        iSub.insert( arguments[1] );
                    else
                        iOrgTree.branch(this, arguments[1]);

                    return false;
                })
                .on('Edit',  '.ListView_Item',  function () {
                    return  (! $(arguments[0].target).contentEdit());
                })
                .on('Delete',  '.ListView_Item', branchDelete);
        });
    };

/* ---------- 元素禁止选中  v0.1 ---------- */

    $.fn.noSelect = function () {
        return  this.attr('unSelectable', 'on').addClass('No_Select')
                .bind('selectStart', false).bind('contextmenu', false);
    };

});
//
//          >>>  EasyWebUI Component Library  <<<
//
//
//      [Version]     v0.8  (2015-7-29)  Stable
//
//      [Based on]    iQuery v1  or  jQuery (with jQuery+)
//
//      [Usage]       A jQuery Plugin Library which almost
//                    isn't dependent on EasyWebUI.css
//
//
//            (C)2014-2015    shiy2008@gmail.com
//


(function (BOM, DOM, $) {

/* ---------- Flex Box 补丁  v0.2 ---------- */

    var CSS_Attribute = {
            Float:        {
                absolute:    true,
                fixed:       true
            },
            Display:      {
                block:    true,
                table:    true
            },
            Prefix:       (function (iUA) {
                try {
                    return ({
                        webkit:     '-webkit-',
                        gecko:      '-moz-',
                        trident:    '-ms-'
                    })[
                        iUA.match(/Gecko|WebKit|Trident/i)[0].toLowerCase()
                    ];
                } catch (iError) {
                    return '';
                }
            })(navigator.userAgent),
            Flex_Size:    {
                horizontal:    {
                    length:    'width',
                    margin:    ['left', 'right']
                },
                vertical:      {
                    length:    'height',
                    margin:    ['top', 'bottom']
                }
            }
        };

    function FlexFix() {
        var $_Box = $(this);

        var Size_Name = CSS_Attribute.Flex_Size[
                $_Box.css(CSS_Attribute.Prefix + 'box-orient')
            ];

        var Flex_Child = $.extend([ ], {
                sum:       0,
                sum_PX:    (
                    $_Box[Size_Name.length]() -
                    parseFloat( $_Box.css('padding-' + Size_Name.margin[0]) ) -
                    parseFloat( $_Box.css('padding-' + Size_Name.margin[1]) )
                )
            });
        $_Box.children().each(function () {
            var $_This = $(this);
            if (
                ($_This.css('position') in CSS_Attribute.Float) ||
                ($_This.css('display') == 'none')
            )
                return;

            var iDisplay = $_This.css('display').match(
                    RegExp(['(', CSS_Attribute.Prefix, ')?', '(inline)?-?(.+)?$'].join(''),  'i')
                );
            if ( iDisplay[2] )
                $_This.css({
                    display:    iDisplay[3] ?
                        (
                            ((iDisplay[3] in CSS_Attribute.Display) ? '' : CSS_Attribute.Prefix) +
                            iDisplay[3]
                        ) :
                        'block'
                });
                
            var _Index_ = Flex_Child.push({$_DOM:  $_This}) - 1,
                _Length_ = $_This[Size_Name.length]();

            if (! _Length_) {
                Flex_Child.pop();
                return;
            }

            Flex_Child[_Index_].scale = parseInt(
                $_This.css(CSS_Attribute.Prefix + 'box-flex')
            );

            Flex_Child.sum += Flex_Child[_Index_].scale;
            Flex_Child.sum_PX -= (
                _Length_ +
                parseFloat(
                    $_This.css('margin-' + Size_Name.margin[0])
                ) +
                parseFloat(
                    $_This.css('margin-' + Size_Name.margin[1])
                )
            );
        });
        if (Flex_Child.sum_PX < 0)  Flex_Child.sum_PX = 0;

        var iUnit = Flex_Child.sum_PX / Flex_Child.sum;
        for (var i = 0; i < Flex_Child.length; i++)
            Flex_Child[i].$_DOM[Size_Name.length](
                Flex_Child[i].$_DOM[Size_Name.length]() + (Flex_Child[i].scale * iUnit)
            );
    }

    var Need_Fix,
        _addClass_ = $.fn.addClass;

    $.fn.addClass = function () {
        _addClass_.apply(this, arguments);

        if (Need_Fix && ($.inArray(arguments[0].split(' '), 'Flex-Box') > -1))
            return  this.each(FlexFix);

        return this;
    };

    $(DOM).ready(function () {
        Need_Fix = isNaN(
            parseInt( $('body').css(CSS_Attribute.Prefix + 'flex') )
        );

        if (Need_Fix)  $('.Flex-Box').each(FlexFix);
    });

/* ---------- Input Range 补丁  v0.1 ---------- */
    function Pseudo_Bind() {
        var iStyleSheet = $.cssPseudo([arguments[0]]),
            iStyle = [ ];

        for (var i = 0;  i < iStyleSheet.length;  i++)
            if ($.inArray(iStyleSheet[i].pseudo, 'before') > -1)
                iStyle.push(iStyleSheet[i].style);

        $(this).change(function () {
            var iPercent = ((this.value / this.max) * 100) + '%';

            for (var i = 0;  i < iStyle.length;  i++)
                iStyle[i].setProperty('width', iPercent, 'important');
        });
    }

    Pseudo_Bind.No_Bug = (Math.floor($.browser.webkit) > 533);

    $.fn.Range = function () {
        return  this.each(function () {
                var $_This = $(this);

                //  Fill-Lower for Gecko and WebKit
                if (Pseudo_Bind.No_Bug && (! $_This.hasClass('Detail')))
                    $_This.cssRule({
                        ':before': {
                            width:    (($_This[0].value / $_This[0].max) * 100) + '%  !important'
                        }
                    }, Pseudo_Bind);

                //  Data-List for All Cores
                var $_List = $('<datalist />', {
                        id:    $.guid('Range')
                    });

                $_This.attr('list', $_List[0].id);

                if (this.min) {
                    var iSum = (this.max - this.min) / this.step;

                    for (var i = 0;  i < iSum;  i++)
                        $_List.append('<option />', {
                            value:    Number(this.min + (this.step * i))/*,
                            text:     */
                        });
                }

                $_This.before($_List);
            });
    };

})(self,  self.document,  self.jQuery || self.Zepto);



(function (BOM, DOM, $) {

/* ---------- 密码确认插件  v0.1 ---------- */

    //  By 魏如松

    var $_hint = $('<div class="hint" />').css({
            position:    'absolute'
        });

    function correct(color, text) {
        color = color || 'green' ;
        text = text || '√' ;
        this.parent().append(
            $_hint.clone().css({
                color:            color,
                'font-weight':    'bold'
            }).text(text)
        );
    }

    function wrong(color, text) {
        color = color || 'red';
        text = text || '×';
        this.parent().append(
            $_hint.clone().css({
                color:            color,
                'font-weight':    'bold'
            }).text(text)
        );
    }

    $.fn.pwConfirm = function (hintClass, hintColor, hintText) {
        var $_password = this.find('input[type="password"]');
        if (! $_password.length)  return this;

        $_password.parent().css('position', 'relative');
        $_hint.addClass(hintClass);
        $_password.eq(0).blur(function () {
            var $_this = $(this);

            //  Check and remove hints when inputting the data.
            $_this.parent().find('.hint').remove();
            if (! this.value)  return;

            $_hint.css({
                left:    ($_this.width() * 0.9) + 'px',
                top:     ($_this.height() * 0.2) + 'px'
            });
            if ( this.checkValidity() )
                correct.call($_this, hintColor, hintText);
            else
                wrong.call($_this, hintColor, hintText);
        });

        $_password.eq(1).blur(function () {
            var $_this = $(this);

            $_hint.css({
                left:    ($_this.width() * 0.9) + 'px',
                top:     ($_this.height() * 0.2) + 'px'
            });
            $_this.parent().find('.hint').remove();
            if ($_password[0].value  &&  this.checkValidity()) {
                if ($_password[0].value == this.value)
                    correct.call($_this, hintColor, hintText);
                else
                    wrong.call($_this, hintColor, hintText);
            }
        });
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
            var $_Head_Height =
                    Number( $_Head.css('height').slice(0, -2) )
                    + Number( $_Head.css('margin-top').slice(0, -2) )
                    + Number( $_Head.css('margin-bottom').slice(0, -2) )
                    + Number( $_Panel.css('padding-top').slice(0, -2) ) * 2;

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

/* ---------- 标签页 控件  v0.2 ---------- */

    $.fn.iTab = function () {
        return  this.each(function () {
            var $_Tab = $(this);
            var $_Button = $_Tab.children('ol').eq(0).children('li'),
                Tab_Nav_NO = BOM.location.hash.match(/^#Tab_Nav_(\d+)/);
            Tab_Nav_NO = Tab_Nav_NO  ?  parseInt( Tab_Nav_NO[1] )  :  1;

            if ($_Button.filter('.active').index() != Tab_Nav_NO) {
                $_Button.removeClass('active')
                    .eq(Tab_Nav_NO - 1).addClass('active');
                $_Tab.children('div').removeClass('active')
                    .eq(Tab_Nav_NO - 1).addClass('active');
            }
            $_Button.addClass('opened').click(function (iEvent) {
                var $_This_Head = $(this);
                var $_Tab_Head = $_This_Head.siblings('li'),
                    $_Tab_Body = $_This_Head.parent().siblings('div');
                var $_This_Body = $_Tab_Body.filter(':visible');

                switch ( iEvent.which ) {
                    case 1:    {
                        $_Tab_Head.addClass('opened');
                        $_This_Head.addClass('active').siblings().removeClass('active');
                        $_This_Body.removeClass('active');
                        $_Tab_Body.eq( $_This_Head.index() ).addClass('active');
                        break;
                    }
                    case 3:    if ( $_This_Body.length ) {
                        $_Tab_Head.removeClass('active opened');
                        $_This_Body[
                            ($_This_Body.hasClass('active') ? 'remove' : 'add') + 'Class'
                        ]('active');
                    }
                }
                iEvent.stopPropagation();
            });
        });
    };

/* ---------- 元素禁止选中  v0.1 ---------- */

    $.fn.noSelect = function () {
        return  this.attr('unSelectable', 'on').css({
               '-moz-user-select':      '-moz-none',
             '-khtml-user-select':           'none',
            '-webkit-user-select':           'none',
                 '-o-user-select':           'none',
                '-ms-user-select':           'none',
                    'user-select':           'none',
            '-webkit-touch-callout':         'none'
        }).bind('selectStart', false).bind('contextmenu', false)
            .css('cursor', 'default');
    };


/* ---------- 首屏渲染 自动启用组件集 ---------- */
    $(DOM).ready(function () {

        $(DOM.body).addClass('Loaded');

        $('form input[type="password"]').pwConfirm();

        $('form input[type="range"]').Range();

        $('.Panel').iPanel();

        $('.Tab').iTab();

        $('*:button,  a.Button,  .No_Select,  .Panel > .Head,  .Tab > ol')
            .noSelect();
    });

})(self,  self.document,  self.jQuery || self.Zepto);
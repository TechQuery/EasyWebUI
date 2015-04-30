(function (BOM, DOM, $) {

    var CSS_Prefix = (function (iUA) {
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
        Flex_Size = {
            horizontal:    {
                length:    'width',
                margin:    ['left', 'right']
            },
            vertical:      {
                length:    'height',
                margin:    ['top', 'bottom']
            }
        };

    function FlexFix() {
        var $_Box = $(this);

        var Size_Name = Flex_Size[
                $_Box.css(CSS_Prefix + 'box-orient')
            ];

        var Flex_Child = $.extend([ ], {
                sum:       0,
                sum_PX:    (
                    $_Box[Size_Name.length]() -
                    parseFloat( $_Box.css('padding-' + Size_Name.margin[0]) ) -
                    parseFloat( $_Box.css('padding-' + Size_Name.margin[1]) )
                )
            });
        $_Box.children(/*':visible'*/).each(function () {
            var $_This = $(this);

            var _Index_ = Flex_Child.push({$_DOM:  $_This}) - 1,
                _Length_ = $_This[Size_Name.length]();

            if (! _Length_) {
                Flex_Child.pop();
                return;
            }

            Flex_Child[_Index_].scale = parseInt(
                $_This.css(CSS_Prefix + 'box-flex')
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

        var iUnit = Flex_Child.sum_PX / Flex_Child.sum;
        for (var i = 0; i < Flex_Child.length; i++)
            Flex_Child[i].$_DOM[Size_Name.length](
                Flex_Child[i].$_DOM[Size_Name.length]() + (Flex_Child[i].scale * iUnit)
            );
    }

    var _addClass_ = $.fn.addClass;

    $.fn.addClass = function () {
        _addClass_.apply(this, arguments);

        if ($.inArray(arguments[0].split(' '), 'Flex-Box') > -1)
            this.each(FlexFix);

        return this;
    };

    $(document).ready(function () {
        $('.Flex-Box').each(FlexFix);
    });

})(self,  self.document,  self.jQuery || self.Zepto);



(function (BOM, DOM, $) {

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

})(self,  self.document,  self.jQuery || self.Zepto);



$(document).ready(function () {

// ----------- 加载 遮罩 ----------- //
    $(document.body).addClass('Loaded');

// ----------- 面板 控件 ----------- //
    $('.Panel').iPanel();

// ----------- 标签页 控件 ----------- //
    var $_Tab_0 = $('.Tab.Nav').eq(0),
        Tab_Nav_NO = top.location.hash.match(/^#Tab_Nav_(\d+)/);
    Tab_Nav_NO = Tab_Nav_NO ? parseInt( Tab_Nav_NO[1] ) : 1;
    if ($_Tab_0.find('ol > li.active').index() != Tab_Nav_NO) {
        $_Tab_0.find('ol > li').removeClass('active')
            .eq(Tab_Nav_NO - 1).addClass('active');
        $_Tab_0.children('div').removeClass('active')
            .eq(Tab_Nav_NO - 1).addClass('active');
    }
    $('.Tab > ol > li').addClass('opened').mousedown(function () {
        var $_This_Head = $(this);
        var $_Tab_Head = $_This_Head.parentsUntil('.Tab').children('li'),
            $_Tab_Body = $_This_Head.parentsUntil('.Tab').siblings('div');
        var $_This_Body = $_Tab_Body.filter(':visible');

        switch ( arguments[0].which ) {
            case 1:    {
                $_Tab_Head.addClass('opened');
                $_This_Head.addClass('active').siblings().removeClass('active');
                $_This_Body.removeClass('active');
                $_Tab_Body.eq( $_This_Head.index() ).addClass('active');
            }    break;
            case 3:    if ( $_This_Body.length ) {
                    $_Tab_Head.removeClass('active opened');
                    $_This_Body.toggleClass('active');
                }
        }
        arguments[0].stopPropagation();
    });

// ----------- 标签选择 控件 ----------- //
    $('.Select').each(function () {
        var $Tips = $(this).children('span.Tips');
        var $Tips_DV = $Tips.text();

        function Show_Tips() {
            if ($Tips.length)  $Tips.text(
                this.data('tips') + $Tips_DV
            );
        }
        Show_Tips.call( $(this).find('ul > li.focus') );

        $(this).find('ul > li').click(function () {
            var $_This = $(this);
            var $focus = $_This.parent().find('li.focus');
            var this_Class = $_This.attr('class'),
                focus_Class = $focus.attr('class');
            $focus.attr('class', this_Class);
            $_This.attr('class', focus_Class);

            Show_Tips.call( $_This );
        });
    });

// ----------- “禁止选中”特性的兼容 ----------- //
    function Event_Break() {  return false;  }

    var $_No_Select = $('button, .No_Select, .Panel > .Head, .Tab > ol');

    if ( $_No_Select.length )
        $_No_Select.attr('unSelectable', 'on').css({
            '-moz-user-select':         '-moz-none',
            '-khtml-user-select':       'none',
            '-webkit-user-select':      'none',
            '-o-user-select':           'none',
            '-ms-user-select':          'none',
            'user-select':              'none',
            '-webkit-touch-callout':    'none'
        }).bind('selectStart', Event_Break).bind('contextmenu', Event_Break)
            .css('cursor', 'default');
});


(function ($) {

    $.fn.Select = function ($_Value) {
        var $_Select = this.is('ul') ? this : this.find('ul.Select');

        $_Select.children('li').click(function () {
            var  $_This = $(this),  $_That = $_This.siblings('li.active');

            $_That.children('input').attr('checked', false);
            $_This.children('input').attr('checked', true);

            $_That.removeClass('active')
                .children('i.fa').addClass('fa-circle-o').removeClass('fa-circle');
            var _Value_ = $_This.addClass('active')
                .children('i.fa').addClass('fa-circle').removeClass('fa-circle-o')
                .data('value');

            if (_Value_)
                $('form .Value[for="' + $_Select[0].id + '"]').text(_Value_);
        });
        return this;
    };

})(self.jQuery || self.Zepto);
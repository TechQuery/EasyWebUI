$(document).ready(function () {

// ----------- 面板 控件 ----------- //
    $('.Panel').each(function () {
        $(this).data(
            'height',  Number( $(this).css('height').slice(0, -2) )
        );
    }).children('.Head').dblclick(function () {
        var $_Head = $(this);
        var $_Panel = $_Head.parent();
        var $_Head_Height =
                Number( $_Head.css('height').slice(0, -2) )
                + Number( $_Head.css('margin-top').slice(0, -2) )
                + Number( $_Head.css('margin-bottom').slice(0, -2) )
                + Number( $_Panel.css('padding-top').slice(0, -2) ) * 2;

        if (! $_Panel.hasClass('closed')) {
            $_Panel.stop().animate({height:  $_Head_Height});
            $_Panel.addClass('closed');
        } else {
            $_Panel.stop().animate({height:  $_Panel.data('height')});
            $_Panel.removeClass('closed');
        }
    });

// ----------- 标签页 控件 ----------- //
    $('.Tab > ol > li').addClass('opened').mousedown(function () {
        var $_This_Head = $(this);
        var $_Tab_Head = $_This_Head.parentsUntil('.Tab').children('li'),
            $_Tab_Body = $_This_Head.parentsUntil('.Tab').siblings('div');
        var $_This_Body = $_Tab_Body.filter(':visible');

        switch ( arguments[0].which ) {
            case 1:    {
                $_Tab_Head.addClass('opened');
                $_This_Head.addClass('active').siblings().removeClass('active');
                $_This_Body.removeClass('active')
                $_Tab_Body.eq( $_This_Head.index() ).addClass('active');
            }    break;
            case 3:    if ( $_This_Body.length ) {
                    $_Tab_Head.removeClass('active opened');
                    $_This_Body.toggleClass('active');
                }
        }
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
    function Event_Break() { return false; }
    $(
        'button, .No_Select, .Panel > .Head, .Tab > ol'
    ).attr('unSelectable', 'on').css({
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
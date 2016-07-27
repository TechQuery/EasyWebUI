define(['jquery'],  function ($) {

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

});
define(['jquery'],  function ($) {

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
            this.value = $.trim( $_This.text() );

            if (! this.value)
                $_This.text(this.value = this.defaultValue);

        }).input(function () {

            var $_This = $(this);

            return  ($.trim( $_This.text() ).length  <=  $_This.attr('maxlength'));

        }).on('click', StopBubble).prop('defaultValue',  function () {

            return  $.trim( $(this).text() );

        }).prop('contentEditable', true).focus();
    };

});
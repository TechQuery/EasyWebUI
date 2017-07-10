define(['jquery', 'jQueryKit'],  function ($) {

/* ---------- 普通元素内容编辑  v0.1 ---------- */

    function StopBubble() {

        arguments[0].stopPropagation();
    }

    $.fn.contentEdit = function () {

        return  this.one('blur',  function () {

            this.removeAttribute('contentEditable');

            $( this ).off('click', StopBubble).off('input');

            this.value = this.textContent.trim();

            if (! this.value)
                this.textContent = this.value = this.defaultValue;

        }).on('input',  function () {

            return (
                this.textContent.trim().length  <=  this.getAttribute('maxlength')
            );
        }).on('click', StopBubble).prop('defaultValue',  function () {

            return this.textContent.trim();

        }).prop('contentEditable', true).focus();
    };

});
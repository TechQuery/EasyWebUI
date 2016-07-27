define(['jquery'],  function ($) {

/* ---------- 元素禁止选中  v0.1 ---------- */

    $.fn.noSelect = function () {
        return  this.attr('unSelectable', 'on').addClass('No_Select')
                .bind('selectStart', false).bind('contextmenu', false);
    };

});
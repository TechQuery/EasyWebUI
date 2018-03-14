//
//          >>>  EasyWebUI Component Library  <<<
//
//
//      [Version]     v1.6  (2017-08-08)  Stable
//
//      [Based on]    iQuery v3  or  jQuery (with jQueryKit)
//
//      [Usage]       A jQuery Plugin Library which almost
//                    isn't dependent on EasyWebUI.css
//
//
//            (C)2014-2017    shiy2008@gmail.com
//

/* ---------- 首屏渲染 自动启用组件集 ---------- */

define([
    'jquery',
    'HTML-5_Patch/FlexBox',        'HTML-5_Patch/Input-Range', 'HTML-5_Patch/DataList',
    'Utility/jQuery.pwConfirm',    'Utility/jQuery.checkAll',
    'Component/jQuery.formDialog', 'Component/jQuery.iPanel',
    'Utility/jQuery.scrollFixed',  'NoSelect'
],  function ($) {

    var $_DOM = $( document ).ready(function () {

            $('form').pwConfirm();

            $('form input[type="range"]').Range();

            $('.Panel').iPanel();

            $('*:button,  a.Button,  .No_Select,  .Panel > .Head,  .Tab > label')
                .noSelect();
        });

    if ($.browser.msie < 11)  return;

    $_DOM.on(
        [
            'mousedown', 'mousemove', 'mouseup',
            'click', 'dblclick', 'mousewheel',
            'touchstart', 'touchmove', 'touchend', 'touchcancel',
            'tap', 'press', 'swipe'
        ].join(' '),
        '.No_Pointer',
        function (iEvent) {

            if (iEvent.target !== this)  return;

            var $_This = $( this ).hide(),
                $_Under = $(
                    $_DOM[0].elementFromPoint(iEvent.pageX, iEvent.pageY)
                );

            $_This.show();    $_Under.trigger( iEvent );
        }
    );
});
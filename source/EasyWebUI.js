//
//          >>>  EasyWebUI Component Library  <<<
//
//
//      [Version]     v2.7  (2017-01-16)  Stable
//
//      [Based on]    iQuery v1  or  jQuery (with jQuery+),
//
//                    iQuery+
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
    'HTML-5_Patch/FlexBox',      'HTML-5_Patch/Input-Range', 'HTML-5_Patch/DataList',
    'Utility/jQuery.pwConfirm',  'Utility/jQuery.checkAll',
    'Component/jQuery.iTable',   'Component/jQuery.formDialog',
    'Component/jQuery.iPanel',   'Component/jQuery.iTab',
    'Component/jQuery.iReadNav', 'Component/jQuery.iTree',
    'Utility/jQuery.scrollFix',  'NoSelect'
],  function ($) {

    var BOM = self,  DOM = self.document;

    var $_DOM = $(DOM);

    $_DOM.ready(function () {

        $('form').pwConfirm();

        $('form input[type="range"]').Range();

        $('.Panel').iPanel();

        $('.Tab').iTab();

        $('*:button,  a.Button,  .No_Select,  .Panel > .Head,  .Tab > label')
            .noSelect();

        $.ListView.findView(this.body, true).each(function () {
            var iView = $.ListView.instanceOf(this);

            if ( $(this).children('.ListView_Item').length )  return;

            iView.$_View.click(function (iEvent) {
                if (iEvent.target.parentNode === this)
                    iView.focus( iEvent.target );
            });
        });
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

            var $_This = $(this).hide(),
                $_Under = $(DOM.elementFromPoint(iEvent.pageX, iEvent.pageY));
            $_This.show();
            $_Under.trigger(iEvent);
        }
    );

});
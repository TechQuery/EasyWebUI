//
//          >>>  EasyWebUI Component Library  <<<
//
//
//      [Version]     v3.0  (2016-07-22)  Stable
//
//      [Based on]    iQuery v1  or  jQuery (with jQuery+),
//
//                    iQuery+
//
//      [Usage]       A jQuery Plugin Library which almost
//                    isn't dependent on EasyWebUI.css
//
//
//            (C)2014-2016    shiy2008@gmail.com
//

/* ---------- 首屏渲染 自动启用组件集 ---------- */

define(['jquery', 'Component'],  function ($) {

    var BOM = self,  DOM = self.document;

    var $_DOM = $(DOM),  $_Load_Tips,  Load_Cover;

    $_DOM.on('loading',  function (iEvent) {

        //  $.Event 实例对象 detail 属性 Bug ——
        //      https://www.zhihu.com/question/20174130/answer/80990463

        iEvent = iEvent.originalEvent;

        if ($(iEvent.target).parents().length > 1)  return;

        if ($_Load_Tips  &&  (iEvent.detail < 1))
            return  $_Load_Tips.text( iEvent.data );
        else if (iEvent.detail >= 1) {
            if (Load_Cover instanceof BOM.ModalWindow)  Load_Cover.close();
            return  $_Load_Tips = Load_Cover = null;
        }

        $_Load_Tips = $('<h1 />', {
            text:    iEvent.data,
            css:     {color:  'white'}
        });

        try {
            Load_Cover = BOM.showModalDialog($_Load_Tips, {
                ' ':    {background:  'darkgray'}
            });
        } catch (iError) { }

    }).ready(function () {

        $('form').pwConfirm();

        $('form input[type="range"]').Range();

        $('.Panel').iPanel();

        $('.Tab').iTab();

        $('*:button,  a.Button,  .No_Select,  .Panel > .Head,  .Tab > label')
            .noSelect();

        $.ListView.findView(this.body, true).each(function () {
            var iView = $.ListView.getInstance(this);

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
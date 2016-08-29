define(['jquery', 'jQuery+'],  function ($) {

    var BOM = self,  DOM = self.document;

/* ---------- 滚动悬停  v0.1 ---------- */

    var $_DOM = $(DOM),  Fixed_List = [ ];

    $_DOM.scroll(function () {
        var iOffset = $_DOM.scrollTop();

        for (var i = 0, $_Fixed, $_Shim;  Fixed_List[i];  i++) {
            $_Fixed = $( Fixed_List[i].element );

            if (iOffset < Fixed_List[i].offset.top) {

                if ($_Fixed.css('position') == 'static')  continue;

                $_Fixed.css('position', 'static');

                Fixed_List[i].callback.call($_Fixed[0], 'static', iOffset);

                $_Shim = $( $_Fixed[0].nextElementSibling );

                if (
                    $_Shim.attr('style', '')[0].outerHTML ==
                    $_Fixed.clone(true).attr('style', '')[0].outerHTML
                )
                    $_Shim.remove();

            } else if ($_Fixed.css('position') != 'fixed') {
                $_Fixed.after( $_Fixed[0].outerHTML ).css({
                    position:     'fixed',
                    top:          0,
                    'z-index':    100
                });

                Fixed_List[i].callback.call($_Fixed[0], 'fixed', iOffset);
            }
        }
    });

    $.fn.scrollFixed = function (iCallback) {

        $.merge(Fixed_List,  $.map(this,  function (iDOM) {
            return {
                element:     iDOM,
                offset:      $(iDOM).offset(),
                callback:    iCallback
            };
        }));

        return this;
    };

});
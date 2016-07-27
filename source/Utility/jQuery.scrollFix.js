define(['jquery', 'jQuery+'],  function ($) {

    var BOM = self,  DOM = self.document;

/* ---------- 滚动悬停  v0.1 ---------- */

    var Fixed_List = [ ];

    $(DOM).scroll(function () {
        for (var i = 0, $_Fixed;  Fixed_List[i];  i++) {
            $_Fixed = $( Fixed_List[i] );

            if (
                (! $_Fixed.inViewport())  &&
                ($_Fixed.css('position') != 'fixed')
            )
                $_Fixed.css({
                    position:     'fixed',
                    top:          0,
                    'z-index':    100
                });
        }
    });

    $.fn.scrollFixed = function () {
        $.merge(Fixed_List, this);

        return this;
    };

});
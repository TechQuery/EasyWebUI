define(['jquery', '../jQueryKit'],  function ($) {

/* ---------- 滚动悬停  v0.2 ---------- */

    var $_BOM = $( self ),  $_DOM = $( document ),  Fixed_List = [ ];

    function Scroll_Fixed() {

        this.$_View = $( arguments[0] );

        this.onChange = arguments[1];

        this.$_Shim = $( this.$_View[0].outerHTML ).css('opacity', 0);

        this.offset = this.$_View.offset();
    }

    Scroll_Fixed.limitMap = {
        width:     ['left', 'Left'],
        height:    ['top', 'Top']
    };

    $.extend(Scroll_Fixed.prototype, {
        getLimit:    function () {

            var LM = this.constructor.limitMap,  iLimit = { };

            for (var iKey in LM)
                iLimit['max-' + iKey] = $_BOM[ iKey ]()
                    - (
                        this.$_View.offset()[ LM[iKey][0] ]  -
                        $_DOM['scroll' + LM[iKey][1]]()
                    )
                    - ($_DOM[ iKey ]()  -  (
                        this.offset[ LM[iKey][0] ]  +
                        parseFloat( this.$_Shim.css( iKey ) )
                    ));

            return iLimit;
        },
        render:      function () {

            this.$_View.css({
                position:     'fixed',
                top:          0,
                'z-index':    100
            }).after( this.$_Shim ).css( this.getLimit() );

            if ( this.onChange )  this.onChange.call(this.$_View[0], 'fixed');

            return this;
        },
        destroy:     function () {

            this.$_View.css({
                position:        'static',
                'max-width':     'auto',
                'max-height':    'auto'
            });

            if ( this.onChange )  this.onChange.call(this.$_View[0], 'static');

            this.$_Shim.remove();

            return this;
        },
        toggleAt:    function (Scroll_Top) {

            var iPosition = this.$_View.css('position');

            if (Scroll_Top < this.offset.top) {

                if (iPosition != 'static')  this.destroy();

            } else if (iPosition != 'fixed')  this.render();

            return this;
        }
    });

    $_DOM.scroll(function () {

        var iOffset = $_DOM.scrollTop();

        for (var i = 0;  Fixed_List[i];  i++)
            Fixed_List[i].toggleAt( iOffset );
    });

    $.fn.scrollFixed = function (iCallback) {

        iCallback = (typeof iCallback === 'function')  &&  iCallback;

        $.merge(Fixed_List,  $.map(this,  function () {

            return  new Scroll_Fixed(arguments[0], iCallback);
        }));

        return this;
    };

});
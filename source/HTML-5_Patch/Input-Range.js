define(['jquery', '../jQueryKit'],  function ($) {

/* ---------- Input Range 补丁  v0.1 ---------- */

    function Pseudo_Bind() {

        var iRule = self.getMatchedCSSRules(this, ':before');

        $( this ).change(function () {

            var iPercent = ((this.value / this.max) * 100) + '%';

            for (var i = 0;  iRule[i];  i++)
                iRule[i].style.setProperty('width', iPercent, 'important');
        });
    }

    Pseudo_Bind.No_Bug = (Math.floor( $.browser.webkit )  >  533);

    $.fn.Range = function () {

        return  this.each(function () {

            var $_This = $( this );

            //  Fill-Lower for WebKit
            if (Pseudo_Bind.No_Bug  &&  (! $_This.hasClass('Detail')))
                $_This.cssRule({
                    ':before':    {
                        width:    (
                            ($_This[0].value / $_This[0].max)  *  100
                        )  +  '%  !important'
                    }
                }, Pseudo_Bind);

            //  Data-List for All Cores
            var $_List = $('<datalist />',  {id: $.uuid('Range')});

            $_This.attr('list', $_List[0].id);

            if ( this.min )
                $($.map(Array((this.max - this.min)  /  this.step),  function () {

                    return  $('<option />', {
                        value:
                            $_This[0].min  +  ($_This[0].step * arguments[1])/*,
                        text:     */
                    })[0];
                })).appendTo( $_List );

            $_This.before( $_List );
        });
    };
});
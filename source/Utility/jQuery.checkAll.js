define(['jquery'],  function ($) {

    $.fn.checkAll = function ($_forAll, onChange) {

        if ($_forAll instanceof Function)    onChange = $_forAll,  $_forAll = '';

        return  this.each(function () {

            var $_This = $( this );

            var iAll = $_forAll ?
                    $_This.find( $_forAll )[0]  :
                    $('input[type="checkbox"]', this)[0];

            $_This.on('change',  'input[type="checkbox"]',  function () {

                var $_All = $_This.find('input[type="checkbox"]').not( iAll );

                if (this === iAll)
                    $_All.prop('checked', this.checked);
                else
                    iAll.checked = (! $_All.not(':checked')[0]);

                if (typeof onChange === 'function')
                    onChange.apply($_This[0], [
                        arguments[0],
                        $.map($_All.filter(':checked'),  function () {

                            return arguments[0].value;
                        })
                    ]);
            });
        });
    };
});
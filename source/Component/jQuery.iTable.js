/* ---------- 数据表 控件  v0.1 ---------- */

define(['jquery', 'jQuery+', 'iQuery+'],  function ($) {

    var Sort_Class = {
            '':            'SortDown',
            'SortUp':      'SortDown',
            'SortDown':    'SortUp'
        };

    $.fn.iTable = function () {
        return  this.each(function () {

            var iLV = $.ListView( $('tbody', this) );

            $('thead tr', this).on('click',  'th',  function () {
                var $_This = $(this);

                var iClass = ($_This.attr('class') || '').match(
                        /\s?(Sort(Up|Down))\s?/
                    );
                iClass = iClass ? iClass[1] : '';

                $_This.removeClass(iClass).addClass( Sort_Class[iClass] );

                var iNO = (Sort_Class[iClass] == 'SortUp')  ?  0.5  :  -0.5,
                    Index = $_This.index();

                iLV.sort(function () {
                    var A = $( arguments[2.5 - iNO][0].children[Index] ).text(),
                        B = $( arguments[2.5 + iNO][0].children[Index] ).text();

                    return  isNaN(parseFloat( A ))  ?
                        A.localeCompare( B )  :  (parseFloat(A) - parseFloat(B));
                });
            });
        });
    };

});
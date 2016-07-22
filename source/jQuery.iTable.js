/* ---------- 数据表 控件  v0.2 ---------- */

define(['jquery', 'jQuery+', 'iQuery+'],  function ($) {

    var BOM = self,  DOM = self.document;

    var Sort_Class = {
            '':            'SortDown',
            'SortUp':      'SortDown',
            'SortDown':    'SortUp'
        };

    $.fn.iTable = function (DataURL) {
        var iLV = $.ListView( $('tbody', this[0]) );

        $('th', this[0]).click(function () {
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

        if (typeof DataURL != 'string')  return this.eq(0);

        var $_tFoot = $('tfoot', this[0]);
        $_tFoot = $_tFoot[0]  ?  $_tFoot  :  $('<tfoot />').appendTo( this[0] );

        $('<tr><td><ol><li></li></ol></td></tr>').appendTo( $_tFoot )
            .children('td').attr(
                'colspan',  $('tbody > tr', this[0])[0].children.length
            );

        return this.eq(0);
    };

});
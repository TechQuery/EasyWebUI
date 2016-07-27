/* ---------- 数据表 控件  v0.2 ---------- */

define(['jquery', 'jQuery+', 'iQuery+'],  function ($) {

    var Sort_Class = {
            '':            'SortDown',
            'SortUp':      'SortDown',
            'SortDown':    'SortUp'
        };

    function Data_Page(iSum, iUnit) {
        if (iSum > -1)
            return  $.map(Array(Math.ceil(iSum / iUnit)),  function () {
                return  {index:  arguments[1] + 1};
            });
    }

    $.fn.iTable = function (DataURL) {
        if (! this[0])  return this;

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

        var iPage = $.ListView($('ol', $_tFoot[0])[0],  false,  function () {
                arguments[0].text( ++arguments[2] );
            });

        iPage.$_View.on('click',  'li',  function () {
            var Index = $(this).index() + 1;

            $.getJSON(
                DataURL.replace(/^([^\?]+\??)(.*)/,  function () {
                    return  arguments[1] + 'page=' + Index + (
                        arguments[2]  ?  ('&' + arguments[2])  :  ''
                    );
                }),
                function (iData) {
                    iLV.clear().render(iData.tngou);

                    iPage.clear().render(
                        Data_Page(iData.total, 10)
                    );
                }
            );
        });
        iPage[0].click();

        return this.eq(0);
    };

});
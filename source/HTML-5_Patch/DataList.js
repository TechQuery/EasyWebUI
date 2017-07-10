define(['jquery', '../jQueryKit'],  function ($) {

/* ---------- Input Data-List 补丁  v0.3 ---------- */

    var List_Type = 'input[type="' + [
            'text', 'tel', 'email', 'url', 'search'
        ].join(
            '"][list], input[type="'
        ) + '"]';

    function Tips_Show($_List) {

        if (! this.value)  $_List.append( $_List.$_Option );

        if (! $_List.height())  $_List.slideDown( 100 );

        return this.value;
    }

    function Tips_Hide() {

        if ( this.height() )  this.slideUp( 100 );

        return this;
    }

    function Tips_Match($_List) {

        $_List.$_Option = $.unique($.merge(
            $_List.$_Option,  $_List.children()
        ));

        var iValue = Tips_Show.call(this, $_List);

        if (! iValue)  return;

        $.each($_List.$_Option,  function () {

            for (var i = 0, _Index_;  i < iValue.length;  i++) {

                if (iValue[i + 1]  ===  undefined)  break;

                _Index_ = this.value.indexOf( iValue[i] );

                if (
                    (_Index_ < 0)  ||
                    (_Index_  >=  this.value.indexOf( iValue[i + 1] ))
                ) {
                    if ( this.parentElement )  $( this ).detach();

                    return;
                }
            }

            if (! this.parentElement)  $_List[0].appendChild( this );
        });
    }

    function DL_Change(iCallback) {

        return  this.change(function () {

            var iOption = this.list.options;

            for (var i = 0;  iOption[i];  i++)
                if (this.value === iOption[i].value)
                    return  iCallback.call(this, arguments[0], iOption[i]);
        });
    }

    $.fn.smartInput = function (onChange) {

        return  this.filter( List_Type ).each(function () {

            var $_Input = $(this),  iPosition = this.parentNode.style.position;

            if (typeof HTMLDataListElement === 'function')
                return  DL_Change.call($_Input, onChange);

        //  DOM Property Patch
            $_Input[0].list = $('#' + this.getAttribute('list'))[0];

            var $_List = $( $_Input[0].list.children[0] );

            $_List[0].multiple = $_List[0].multiple || true;

            $_Input[0].list.options = $_List[0].children;

            if ($_Input.attr('autocomplete') === 'off')  return;

        //  Get Position
            if ((! iPosition)  ||  (iPosition === 'static'))
                $(this.parentNode).css({
                    position:    'relative',
                    zoom:        1
                });

            iPosition = $_Input.attr('autocomplete', 'off').position();

            iPosition.top += $_Input.height();

        //  DropDown List
            $_List.css($.extend(iPosition, {
                position:     'absolute',
                'z-index':    10000,
                height:       0,
                width:        $_Input.width(),
                padding:      0,
                border:       0,
                overflow:     'hidden',
                opacity:      0
            })).change(function () {

                $_Input[0].value = Tips_Hide.call( $_List )[0].value;

                return onChange.call(
                    $_Input[0],
                    arguments[0],
                    this.children[ this.selectIndex ]
                );
            });

            $_List.$_Option = [ ];

            var iFilter = $.proxy(Tips_Match, null, $_List);

            $_Input.after( $_List )
                .dblclick( $.proxy(Tips_Show, null, $_List) )
                .blur( $.proxy(Tips_Hide, $_List) )
                .keyup( iFilter )
                .on('paste', iFilter)
                .on('cut', iFilter);
        });
    };
});
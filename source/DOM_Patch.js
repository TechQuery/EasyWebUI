/* ---------- HTML 5 / CSS 3 补丁 ---------- */

define(['jquery', 'jQuery+', 'iQuery+'],  function (BOM, DOM, $) {

/* ---------- Flex Box 补丁  v0.2 ---------- */

    var CSS_Attribute = {
            Float:        {
                absolute:    true,
                fixed:       true
            },
            Display:      {
                block:    true,
                table:    true
            },
            Prefix:       (function (iUA) {
                try {
                    return ({
                        webkit:     '-webkit-',
                        gecko:      '-moz-',
                        trident:    '-ms-'
                    })[
                        iUA.match(/Gecko|WebKit|Trident/i)[0].toLowerCase()
                    ];
                } catch (iError) {
                    return '';
                }
            })(navigator.userAgent),
            Flex_Size:    {
                horizontal:    {
                    length:    'width',
                    margin:    ['left', 'right']
                },
                vertical:      {
                    length:    'height',
                    margin:    ['top', 'bottom']
                }
            }
        };
    function FlexFix() {
        var $_Box = $(this);

        var Size_Name = CSS_Attribute.Flex_Size[
                $_Box.css(CSS_Attribute.Prefix + 'box-orient')
            ];

        var Flex_Child = $.extend([ ], {
                sum:       0,
                sum_PX:    (
                    $_Box[Size_Name.length]() -
                    parseFloat( $_Box.css('padding-' + Size_Name.margin[0]) ) -
                    parseFloat( $_Box.css('padding-' + Size_Name.margin[1]) )
                )
            });
        $_Box.children().each(function () {
            var $_This = $(this);
            if (
                ($_This.css('position') in CSS_Attribute.Float) ||
                ($_This.css('display') == 'none')
            )
                return;

            var iDisplay = $_This.css('display').match(
                    RegExp(['(', CSS_Attribute.Prefix, ')?', '(inline)?-?(.+)?$'].join(''),  'i')
                );
            if ( iDisplay[2] )
                $_This.css({
                    display:    iDisplay[3] ?
                        (
                            ((iDisplay[3] in CSS_Attribute.Display) ? '' : CSS_Attribute.Prefix) +
                            iDisplay[3]
                        ) :
                        'block'
                });

            var _Index_ = Flex_Child.push({$_DOM:  $_This}) - 1,
                _Length_ = $_This[Size_Name.length]();

            if (! _Length_) {
                Flex_Child.pop();
                return;
            }

            Flex_Child[_Index_].scale = parseInt(
                $_This.css(CSS_Attribute.Prefix + 'box-flex')
            );

            Flex_Child.sum += Flex_Child[_Index_].scale;
            Flex_Child.sum_PX -= (
                _Length_ +
                parseFloat(
                    $_This.css('margin-' + Size_Name.margin[0])
                ) +
                parseFloat(
                    $_This.css('margin-' + Size_Name.margin[1])
                )
            );
        });
        if (Flex_Child.sum_PX < 0)  Flex_Child.sum_PX = 0;

        var iUnit = Flex_Child.sum_PX / Flex_Child.sum;
        for (var i = 0; i < Flex_Child.length; i++)
            Flex_Child[i].$_DOM[Size_Name.length](
                Flex_Child[i].$_DOM[Size_Name.length]() + (Flex_Child[i].scale * iUnit)
            );
    }

    var _addClass_ = $.fn.addClass;

    if (!  ('flex' in DOM.documentElement.style)) {
        $.fn.addClass = function () {
            _addClass_.apply(this, arguments);

            if ($.inArray('Flex-Box', arguments[0].split(/\s+/))  >  -1)
                return this.each(FlexFix);

            return this;
        };

        $(DOM).ready(function () {
            $('.Flex-Box').each(FlexFix);
        });
    }

/* ---------- Input Range 补丁  v0.1 ---------- */

    function Pseudo_Bind() {
        var iRule = BOM.getMatchedCSSRules(arguments[0], ':before');

        $(this).change(function () {
            var iPercent = ((this.value / this.max) * 100) + '%';

            for (var i = 0;  i < iRule.length;  i++)
                iRule[i].style.setProperty('width', iPercent, 'important');
        });
    }

    Pseudo_Bind.No_Bug = (Math.floor($.browser.webkit) > 533);

    $.fn.Range = function () {
        return  this.each(function () {
            var $_This = $(this);

            //  Fill-Lower for WebKit
            if (Pseudo_Bind.No_Bug && (! $_This.hasClass('Detail')))
                $_This.cssRule({
                    ':before': {
                        width:    (($_This[0].value / $_This[0].max) * 100) + '%  !important'
                    }
                }, Pseudo_Bind);

            //  Data-List for All Cores
            var $_List = $('<datalist />', {
                    id:    $.uuid('Range')
                });

            $_This.attr('list', $_List[0].id);

            if (this.min) {
                var iSum = (this.max - this.min) / this.step;

                for (var i = 0;  i < iSum;  i++)
                    $_List.append('<option />', {
                        value:    Number(this.min + (this.step * i))/*,
                        text:     */
                    });
            }

            $_This.before($_List);
        });
    };

/* ---------- Input Data-List 补丁  v0.3 ---------- */

    var List_Type = 'input[type="' + [
            'text', 'tel', 'email', 'url', 'search'
        ].join(
            '"][list], input[type="'
        ) + '"]';

    function Tips_Show($_List) {
        if (! this.value)  $_List.append( $_List.$_Option );

        if (! $_List.height())  $_List.slideDown(100);

        return this.value;
    }

    function Tips_Hide() {
        if ( this.height() )  this.slideUp(100);

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
                    if (this.parentElement)  $(this).detach();
                    return;
                }
            }
            if (! this.parentElement)  $_List[0].appendChild( this );
        });
    }

    function DL_Change(iCallback) {
        return  this.change(function () {
            var iOption = this.list.options;

            for (var i = 0;  i < iOption.length;  i++)
                if (this.value == iOption[i].value)
                    return  iCallback.call(this, arguments[0], iOption[i]);
        });
    }

    $.fn.smartInput = function (onChange) {
        return  this.filter(List_Type).each(function () {

            var $_Input = $(this),  iPosition = this.parentNode.style.position;

            if ( BOM.HTMLDataListElement )
                return  DL_Change.call($_Input, onChange);

        //  DOM Property Patch
            $_Input[0].list = $('#' + this.getAttribute('list'))[0];

            var $_List = $( $_Input[0].list.children.item(0) );

            $_List[0].multiple = $_List[0].multiple || true;

            $_Input[0].list.options = $_List[0].children;

            if ($_Input.attr('autocomplete') == 'off')  return;

        //  Get Position
            if ((! iPosition)  ||  (iPosition == 'static'))
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
                $_Input[0].value = Tips_Hide.call($_List)[0].value;

                return onChange.call(
                    $_Input[0],
                    arguments[0],
                    this.children[this.selectIndex]
                );
            });
            $_List.$_Option = [ ];

            var iFilter = $.proxy(Tips_Match, null, $_List);

            $_Input.after($_List)
                .dblclick($.proxy(Tips_Show, null, $_List))
                .blur($.proxy(Tips_Hide, $_List))
                .keyup(iFilter)
                .on('paste', iFilter)
                .on('cut', iFilter);
        });
    };

});
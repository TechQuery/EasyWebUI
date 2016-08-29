define(['jquery', 'jQuery+', 'iQuery+'],  function ($) {

/* ---------- 标签页 控件  v0.5 ---------- */

    var Tab_Type = ['Point', 'Button', 'Monitor'];

    function Tab_Active() {
        var $_Label = this.children('label').not(arguments[0]);
        var $_Active = $_Label.filter('.active');

        $_Active = $_Active.length ? $_Active : $_Label;

        if ($_Active.length)  $_Active[0].click();
    }

    $.fn.iTab = function () {
        if (! $.browser.modern)
            this.on('click',  'input[type="radio"]',  function () {
                $(this).attr('checked', true)
                    .siblings('input[type="radio"]').removeAttr('checked');
            });

        return  this.on('click',  'label[for]',  function () {

            var $_This = $(this);

            if (! $_This.hasClass('active'))
                $_This.addClass('active').siblings().removeClass('active');

        }).each(function () {

            var $_Tab_Box = $(this),  iName = $.uuid('iTab'),  iType;

            for (var i = 0;  i < Tab_Type.length;  i++)
                if ($_Tab_Box.hasClass( Tab_Type[i] )) {
                    iType = Tab_Type[i];
                    $_Tab_Box.attr('data-tab-type', iType);
                }
        /* ----- 成员实例化核心 ----- */

            var Label_At = (this.children[0].tagName.toLowerCase() == 'label'),
                iSelector = ['input[type="radio"]',  'div, section, .Body'];
            iSelector[Label_At ? 'unshift' : 'push']('label');

            $.ListView(this,  iSelector,  false,  function ($_Tab_Item) {
                var _UUID_ = $.uuid();

                var $_Label = $_Tab_Item.filter('label').attr('for', _UUID_),
                    $_Radio = $([
                        '<input type="radio" name=',  iName,  ' id=',  _UUID_,  ' />'
                    ].join('"'));

                if (! $.browser.modern)
                    $_Radio.change(function () {
                        if (this.checked)
                            this.setAttribute('checked', true);
                        else
                            this.removeAttribute('checked');
                    });

                return  [$_Label[0], $_Radio[0], $_Tab_Item.not($_Label)[0]];

            }).on('remove',  function () {

                var $_Label = arguments[0].filter('label');

                $('*[id="' + $_Label.attr('for') + '"]').remove();

                Tab_Active.call(this.$_View, $_Label);

            }).on('afterRender',  function () {

                var $_Tab_Head = $($.map(
                        this.$_View.children('input[type="radio"]'),
                        function () {
                            return  $('label[for="' + arguments[0].id + '"]')[0];
                        }
                    ))[Label_At ? 'prependTo' : 'appendTo']( this.$_View );

                Tab_Active.call( this.$_View );

                if (! this.$_View.hasClass('auto'))  return;

        /* ----- 自动切换模式 ----- */

                var Index = 0,  iPause;

                $.every(2,  function () {
                    if (iPause  ||  (! $_Tab_Box.hasClass('auto')))
                        return;

                    Index = (Index < $_Tab_Head.length)  ?  Index  :  0;

                    $_Tab_Head[Index++].click();
                });

                this.$_View.hover(
                    function () { iPause = true; },
                    function () { iPause = false; }
                );
            }).render(
                Array( $.ListView.getInstance(this).length )
            );
        }).on('swipe',  function (iEvent) {
            if (
                (typeof iEvent.deltaX != 'number')  ||
                (Math.abs(iEvent.deltaY)  >  Math.abs(iEvent.deltaX))
            )
                return;

        /* ----- 滑动切换模式 ----- */

            var $_This = $(this),  $_Target = $(iEvent.target);

            var $_Path = $_Target.parentsUntil(this),
                $_Tab_Body = $_This.children().not('label, input');

            $_Target = $_Path.length ? $_Path.slice(-1) : $_Target;

            $_Target = $_Tab_Body.eq(
                (
                    $_Tab_Body.index($_Target) + (
                        (iEvent.deltaX < 0)  ?  1  :  -1
                    )
                ) % $_Tab_Body.length
            );

            $('label[for="' + $_Target[0].previousElementSibling.id + '"]')[0]
                .click();
        });
    };

});
define(['jquery', 'jQuery+', 'iQuery+'],  function ($) {

/* ---------- 阅读导航栏  v0.3 ---------- */

    function toTreeData() {
        var iTree = [ ],  $_Tree = this;

        var _This_ = iTree,  _Parent_;

        this.each(function (Index) {
            var _Level_ = Index && (
                    this.tagName[1]  -  $_Tree[Index - 1].tagName[1]
                );

            if (_Level_ > 0) {
                _Parent_ = _This_;
                _This_ = _This_.slice(-1)[0].list = [ ];
            } else if (_Level_ < 0)
                _This_ = _Parent_;

            if (! this.id.match(/\w/))  this.id = $.uuid('Header');

            _This_.push({
                id:      this.id,
                text:    this.textContent
            });
        });

        return iTree;
    }

    $.fn.iReadNav = function ($_Context) {
        return  this.each(function () {
            var iMainNav = $.TreeView(
                    $.ListView(this,  false,  function ($_Item, iValue) {

                        $('a', $_Item[0]).text(iValue.text)[0].href =
                            '#' + iValue.id;
                        $_Item.attr('title', iValue.text);
                    }),
                    function () {
                        arguments[0].$_View.attr('class', '');
                    }
                ).on('focus',  function (iEvent) {
                    if (iEvent.target.tagName.toLowerCase() != 'a')  return;

                    var $_Target = $(
                            '*[id="' + iEvent.target.href.split('#')[1] + '"]'
                        );
                    $_Target.scrollParents().eq(0).scrollTo( $_Target );
                }),
                _DOM_ = $_Context[0].ownerDocument;

            ($_Context.is(':scrollable') ?
                $_Context  :  $_Context.scrollParents().eq(0)
            ).scroll(function () {
                if ($.contains($_Context[0], arguments[0].target))  return;

                var iAnchor = $_Context.offset(),
                    iFontSize = parseFloat($(_DOM_.body).css('font-size')) / 2;

                var $_Anchor = $(_DOM_.elementFromPoint(
                        iAnchor.left + iFontSize +
                            parseFloat( $_Context.css('padding-left') ),
                        iAnchor.top + iFontSize +
                            parseFloat( $_Context.css('padding-top') )
                    )).prevAll('h1, h2, h3');

                if (! $.contains($_Context[0], $_Anchor[0]))  return;

                $_Anchor = $(
                    'a[href="#' + $_Anchor[0].id + '"]',  iMainNav.$_View[0]
                );
                $('.ListView_Item.active', iMainNav.$_View[0])
                    .removeClass('active');

                $.ListView.instanceOf( $_Anchor ).focus( $_Anchor[0].parentNode );
            });

            iMainNav.$_View.on('Refresh',  function () {

                iMainNav.clear().render(
                    toTreeData.call( $_Context.find('h1, h2, h3') )
                );
                return false;

            }).on('Clear',  function () {
                return  (! iMainNav.clear());
            });
        });
    };

});
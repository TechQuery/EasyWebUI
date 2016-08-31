define([
    'jquery', 'jQuery+', 'iQuery+', 'Utility/jQuery.contentEdit'
],  function ($) {

    var BOM = self,  DOM = self.document;

/* ---------- 目录树  v0.2 ---------- */

    function branchDelete() {
        var iList = $.ListView.instanceOf( this );

        iList.remove( this );

        if (! iList.$_View[0].children[0])  iList.$_View.remove();

        return false;
    }

    $.fn.iTree = function (Sub_Key, onInsert) {
        return  this.each(function () {
            var iOrgTree = $.TreeView(
                    $.ListView(this, false, onInsert),
                    Sub_Key,
                    2,
                    function (iFork, iDepth, iData) {
                        iFork.$_View.parent().cssRule({
                            ':before':    {content:  (
                                '"'  +  (iData ? '-' : '+')  +  '"  !important'
                            )}
                        });
                    }
                ).on('focus',  function (iEvent) {
                    var _This_ = iEvent.currentTarget;

                    $(':input', _This_).focus();

                    var iRule = Array.prototype.slice.call(
                            BOM.getMatchedCSSRules(_This_, ':before'),  -1
                        )[0];

                    if (! (
                        iEvent.isPseudo() &&
                        $(iRule.parentStyleSheet.ownerNode)
                            .hasClass('iQuery_CSS-Rule')
                    ))
                        return;

                    iRule.style.setProperty('content', (
                        (iRule.style.content[1] == '-')  ?  '"+"'  :  '"-"'
                    ), 'important');
                });

            iOrgTree.$_View.on('Insert',  '.ListView_Item',  function () {

                var iSub = $.ListView.instanceOf(
                        $(this).children('.TreeNode'), false
                    );

                if ( iSub )
                    iSub.insert( arguments[1] );
                else
                    iOrgTree.branch(this, arguments[1]);

                return false;

            }).on('Edit',  '.ListView_Item',  function () {

                return  (! $(arguments[0].target).contentEdit());

            }).on('Delete',  '.ListView_Item', branchDelete);
        });
    };

});
define(['jquery'],  function ($) {

/* ---------- 表单对话框  v0.1 ---------- */

    var $_BOM = $( self );

    function show() {

        return this.css({
            opacity:    1,
            left:
                ($_BOM.width()  -  parseFloat( this.css('width') ))  /  2,
            top:
                ($_BOM.height()  -  parseFloat( this.css('height') ))  /  2
        });
    }

    function close() {

        var $_This = this.css({
                opacity:    0,
                left:       0,
                top:        0
            }).off('.Dialog');

        return  new Promise(function (iResolve) {

            $.wait(parseFloat( $_This.css('transition-duration') ),  function () {

                iResolve(! $_This.hide());
            });
        });
    }

    $.fn.formDialog = function () {

        var $_This = this.show();

        return  new Promise(function (iResolve) {

            show.call( $_This ).on('submit.Dialog',  function () {

                close.call( $_This ).then(function () {

                    iResolve($.paramJSON('?' + $_This.serialize()));
                });
            }).on('reset.Dialog',  function () {

                close.call( $_This ).then( iResolve );

            }).on('keyup.Dialog',  function (iEvent) {
                if (
                    (iEvent.type === 'keyup')  &&
                    (iEvent.which === 27)  &&
                    (! $.expr[':'].field( iEvent.target ))
                )
                    $( this ).trigger('reset')[0].reset();
            });
        });
    };
});
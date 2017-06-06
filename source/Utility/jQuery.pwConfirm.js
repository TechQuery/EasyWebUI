define(['jquery', 'jQueryKit'],  function ($) {

/* ---------- 密码确认插件  v0.3 ---------- */

    //  By 魏如松

    var $_Hint = $('<div class="Hint" />').css({
            position:         'absolute',
            width:            '0.625em',
            'font-weight':    'bold'
        });

    function showHint() {
        var iPosition = this.position();

        $_Hint.clone().text( arguments[0] ).css({
            color:    arguments[1],
            left:     (iPosition.left + this.width() - $_Hint.width()) + 'px',
            top:      (iPosition.top + this.height() * 0.2) + 'px'
        }).appendTo(
            this.parent()
        );
    }

    $.fn.pwConfirm = function () {
        var pwGroup = { },
            $_passwordAll = this.find('input[type="password"][name]');

        //  密码明文查看
        var $_visible = $('<div class="visible" />').css({
                position:       'absolute',
                right:          '5%',
                top:            '8%',
                'z-index':      1000000,
                'font-size':    '26px',
                cursor:         'pointer'
            });
        $_passwordAll.parent().css('position', 'relative').append( $_visible.clone() )
            .find('.visible').html('&#10002;').click(function(){
                var $_this = $(this);

                if($_this.text() == '✒')
                    $_this.html('&#10001;').siblings('input').attr('type', 'text');
                else
                    $_this.html('&#10002;').siblings('input').attr('type', 'password');
            });

        //  密码输入验证
        $_passwordAll.each(function (){
            if (! pwGroup[this.name])
                pwGroup[this.name] = $_passwordAll.filter('[name="' + this.name + '"]');
            else
                return;

            var $_password = pwGroup[this.name],
                _Complete_ = 0;

            if ($_password.length < 2)  return;

            $_password.blur(function () {
                var $_this = $(this);

                $_this.parent().find('.Hint').remove();

                if (! this.value) return;

                if (! this.checkValidity())
                    showHint.call($_this, '×', 'red');
                else if (++_Complete_ == 2) {
                    var $_other = $_password.not(this);

                    showHint.apply(
                        $_this,
                        (this.value == $_other[0].value)  ?  ['√', 'green']  :  ['×', 'red']
                    );

                    _Complete_ = 0;
                } else
                    showHint.call($_this, '√', 'green');
            });
        });

        return this;
    };

});
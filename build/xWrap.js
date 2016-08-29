(function () {

    if ((typeof this.define != 'function')  ||  (! this.define.amd))
        arguments[0]();
    else
        this.define('EasyWebUI', ['iQuery+'], arguments[0]);

})(function () {



});
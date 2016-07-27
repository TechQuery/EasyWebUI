({
    name:            'EasyWebUI',
    baseUrl:         '../source',
    paths:           {
        jquery:       'http://cdn.bootcss.com/jquery/1.12.3/jquery',
        'jQuery+':    'http://git.oschina.net/Tech_Query/iQuery/raw/master/jQuery+.js',
        'iQuery+':    'http://git.oschina.net/Tech_Query/iQuery/raw/master/iQuery+.js'
    },
    out:             '../EasyWebUI.js',
    onBuildWrite:    function () {
        var fParameter = 'BOM, DOM',  aParameter = 'self,  self.document';

        if (arguments[0] != 'extension/ES-5') {
            fParameter += ', $';
            aParameter += ',  self.jQuery || self.Zepto';
        }
        return arguments[2]
            .replace(/^define[\s\S]+?(function \()[^\)]*/m,  "\n($1" + fParameter)
            .replace(/\s+var BOM.+?;/, '')
            .replace(/\}\).$/,  '})(' + aParameter + ");\n\n");
    },
    wrap:            {
        startFile:    'xWrap_0.txt',
        end:          '});'
    },
    optimize:        'none'
});
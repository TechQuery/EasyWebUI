({
    name:            'EasyWebUI',
    baseUrl:         '../source',
    paths:           {
        jquery:       'http://cdn.bootcss.com/jquery/1.12.4/jquery',
        jQueryKit:    'http://tech_query.oschina.io/iquery/jQueryKit'
    },
    out:             '../EasyWebUI.js',
    onBuildWrite:    function () {
        var fParameter = 'BOM, DOM',  aParameter = 'self,  self.document';

        fParameter += ', $';
        aParameter += ',  self.jQuery || self.Zepto';

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
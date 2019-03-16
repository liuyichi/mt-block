
var port = 3200;

process.chdir(__dirname + '/../');

var configure = require('mtf.devtools/webpack-configure');
var config = configure('dev', {
    entry: 'dev/index',
    html: 'dev/index.html',
});
config.module.noParse.push(/tinymce\.min$/);
var devServer = require('mtf.devtools/dev-server');
var server = devServer(config);

server.localAt(port, [
    ['/service/dataset/([^\/]*)', 'bill/demo/app/dataset/$1.json'],
    ['/service/fetch/([^\/]*)', 'bill/demo/app/fetch/$1.json'],
    ['/attachment', 'upload/demo/data/attachment.json'],
    ['/complex-records/data/(.*)', 'complex-records/demo/data/$1.json'],
]);

/**
 * Routes
 *
 */
var files = require('./files');

exports.auth = function(req, res){

    var url = files.auth.generateAuthUrl({
        access_type: 'online',
        scope: files.scopes
    });
    
    res.redirect(url);
};

exports.auth_return = function(req, res){

    if ( !req.query.code ) {
        res.status(500).send('Authorization failed.');
        return;
    }
    
    var authorizationCode = req.query.code;
    files.getNewToken(authorizationCode, function(){
        res.redirect('/');
    });

};

exports.index = function(req, res){

    var authorised = files.isAuthorised();
    
    if ( authorised ) {
        files.getList('root', function(files){
            res.render('index', {
                authorised: true,
                folderId: 'root',
                files: files
            });
        });
    }
    else {
        res.render('index', { authorised: false });
    }
};

exports.folders = function(req, res){

    var authorised = files.isAuthorised();
    if ( !authorised )
        res.redirect('/');
    var folderId = req.params.folderId
        ? req.params.folderId
        : 'root';
    files.getList(folderId, function(files){
        res.render('index', {
            authorised: true,
            folderId: folderId,
            files: files
        });
    });
};

exports.logout = function(req, res){

    var authorised = files.isAuthorised();
    if ( !authorised )
        res.redirect('/');
    files.logout({});
    files.auth.setCredentials({});
    res.redirect('/');
};

exports.viewers = function(req, res){

    var authorised = files.isAuthorised();
    if ( !authorised )
        res.redirect('/');
    var fileId = req.params.fileId
    files.getAccessList(fileId, function(files){
        console.log(files)
        res.redirect('/');
        // res.render('index', {
        //     authorised: true,
        //     files: files
        // });
    });

};
/** Load config */
var fs = require('fs'),
    config = {};
try {
        config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    } catch (err) {
        throw err;
    }

/**
 * Files model
 *
 * @param {Object} config
 */
var Model = function( config ) {
    
    var google = require('googleapis'),
        OAuth2 = google.auth.OAuth2;
    
    this.scopes = config.scopes;
    this.auth = new OAuth2(config.client_id, config.client_secret, config.redirect_url);
    service_drive = google.drive({ version: 'v2', auth: this.auth });
    
    /**
     * Check authorisation
     */
    this.isAuthorised = function(){
        return Object.keys(this.auth.credentials).length > 0;
    };
    
    /**
     * Get Service access token
     * 
     * @param {String} authorizationCode
     * @param {Function} callback
     */
    this.getNewToken = function( authorizationCode, callback ) {
        
        var self = this;
        this.auth.getToken(authorizationCode, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            self.auth.credentials = token;
            callback();
        });
        
    };
    
    /**
     * Get files list
     * 
     * @param {String} folderId
     * @param {Function} callback
     */
    this.getList = function(folderId, callback){
        
        service_drive.files.list({
            auth: this.auth,
            q: "'" + folderId + "' in parents and trashed=false",
            orderBy: 'folder,modifiedDate desc,title'
        }, function(err, response) {
            if (err) {
                return;
            }
            callback(response.items);
        });
        
    };

    
    /**
     * Get list of users who can access a file
     * 
     * @param {String} fileId
     * @param {Function} callback
     */``
    this.getAccessList = function(fileId, callback){

        service_drive.permissions.list({
            auth: this.auth,
            fileId: fileId,
            fields: 'items(emailAddress,role)' // include fields for user email and role
        }, function(err, response) {
            if (err) {
                return;
            }
            callback(response.items);
        });
    };
    

    /**
     * Log out from Google Drive
     */
    this.logout = function() {
        this.auth.revokeCredentials(function(err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log('Logged out successfully');
            }
        });
    };
    
};

module.exports = new Model( config );

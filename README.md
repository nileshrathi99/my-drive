# MY-DRIVE
Node.js application with Google OAuth authorisation and Google Drive listing, downloading files and viewing the users who have access to the files. It is built using the Express framework and the Jade view engine. The application allows users to authenticate with their Google account, view their folders and files, and log out.

## info
To access Google Drive through this application, we need authorization from Google. This involves creating a new project on the Google website and generating a unique key that enables the application to access user files. Access to this application is restricted to certain individuals, so if you're interested in using it, you'll need to request permission from the person who developed it and provide them with your Gmail ID, which happens to be me. Please inform me of your Gmail ID if you wish to obtain access.


## how to run
- step0: clone this repository
- step1: open terminal
- step2: navigate to location my-drive (this folder basically which you have downloaded)
- step3: To verify whether you have Node installed on your computer, you can run a check. If it is not installed, you can install it by using the command 'brew install node' if you are using a Mac with Homebrew installed, or by installing Nodejs if you are using Windows. It is important to note that the version of Node used for testing this is v19.8.1.
- step4: after step3 install googleapis by typing command "npm install googleapis" (you can skip this step, as the modules are already added in repo)
- step4: to run the app type command 'node app.js'
- step5: go to http://localhost:3000 if not working open in incognito

The application will start listening on port 3000. Open a web browser and go to http://localhost:3000 to view the application.

# files

## config.json

This is a configuration file for a Google API client. The file contains the following details:

client_id: This is a unique identifier for the client application that has been registered with Google API Console. It is used to identify the client application when making API requests.

client_secret: This is a secret key that is used in conjunction with the client ID to authenticate the client application when making API requests.

redirect_url: This is the URL that the user will be redirected to after granting access to the requested scopes.

scopes: These are the specific permissions that the client application is requesting from the user when they authenticate with their Google account.


## app.js

Routes
The following routes are available:

- /: Displays the home page with a login button.
- /auth/google: Initiates the Google authentication process.
- /auth/google/return: Handles the Google authentication callback.
- /folders/:folderId: Displays the files in the specified folder.
- /logout: Logs the user out and redirects to the home page.
- /viewers/:fileId: Displays the users who have access to the file

## index.js

This is a Node.js module that defines several functions for handling routes of a web application. The routes are related to Google Drive API authorization, listing folders and files, logging out, and viewing access list of a file.

The module requires a separate module files which presumably handles all the interaction with Google Drive API. The files module is imported at the beginning of this module.

Here are the functions defined in this module:

auth(req, res): This function generates an authorization URL using the generateAuthUrl() function of the files.auth object, with access type set to "online" and the specified scope. The function then redirects the user's browser to the authorization URL.

auth_return(req, res): This function is called after the user has authorized the application on the Google Drive API authorization page. If the code parameter is not present in the query string, the function sends a 500 status code with the message "Authorization failed." Otherwise, it calls the getNewToken() function of the files module, passing the authorization code as a parameter. When the getNewToken() function completes, the user is redirected to the root URL.

index(req, res): This function first checks whether the user is authorized using the isAuthorised() function of the files module. If the user is authorized, it calls the getList() function of the files module, passing the "root" folder ID as a parameter. It then renders the index view with the authorised flag set to true and the files variable set to the list of files returned by the getList() function. If the user is not authorized, the index view is rendered with the authorised flag set to false.

folders(req, res): This function first checks whether the user is authorized. If not, it redirects the user to the root URL. If the user is authorized, it gets the folder ID from the folderId parameter of the request or sets it to "root" if the parameter is not present. It then calls the getList() function of the files module, passing the folder ID as a parameter. It renders the index view with the authorised flag set to true, the folderId variable set to the folder ID, and the files.

logout(req, res): This function first checks whether the user is authorized. If not, it redirects the user to the root URL. If the user is authorized, it sets the user's credentials to an empty object and logs them out by calling the logout() function of the files module. It then redirects the user to the root URL.

viewers(req, res): This function first checks whether the user is authorized. If not, it redirects the user to the root URL. If the user is authorized, it gets the file ID from the fileId parameter of the request. It then calls the getAccessList() function of the files module, passing the file ID as a parameter. When the getAccessList() function completes, it renders the index view with the pre flag set to true and the files variable set to the list of viewers returned by the getAccessList() function. 

## files.js

This code defines a model for interacting with the Google Drive API using the Google Drive API client library for Node.js. The model is defined as a JavaScript class with several methods for authentication, authorization, and fetching data from Google Drive.

The model is loaded by the main application code via the require() method, and is passed a configuration object loaded from a config.json file. The configuration object contains the client ID, client secret, and redirect URL needed for authentication.

The Model class has several methods:

isAuthorised() checks whether the user is authorized to access the Google Drive API by checking if the authentication credentials exist.

getNewToken(authorizationCode, callback) retrieves an access token from Google OAuth2 service using an authorization code that was obtained through the user's interaction with the authentication and authorization flow. The callback function is executed when the access token is obtained.

getList(folderId, callback) retrieves a list of files in a specified folder (or the root folder if none is specified) from Google Drive. The callback function is executed with an array of files returned from the API.

getAccessList(fileId, callback) retrieves a list of users who have access to a specified file from Google Drive. The callback function is executed with an array of access permissions returned from the API.

logout() revokes the authentication credentials and logs the user out of Google Drive.
The Model class uses the googleapis package to interact with the Google Drive API, and creates an OAuth2 object to handle authentication. The service_drive variable is a reference to the Google Drive API client with version 2, and is used to call methods on the API.

Overall, this code provides a way to interact with the Google Drive API using Node.js, allowing users to authenticate and retrieve files or access permissions from their Google Drive account.

## views/index.jade

This is a Pug/Jade template file that extends a layout template and defines the structure and content of a web page. The template generates a page that displays the contents of a Google Drive folder.

The main content of the page is enclosed within a block content directive. It first checks whether the user is authorized or not. If the user is authorized, it displays a logout button; otherwise, it displays a sign-in button that redirects the user to the Google authentication page.

If the user is authorized and there are files in the folder, it displays a list of files in the folder. If there are no files, it displays a message stating that no files were found. Each file or folder is displayed as a list item. If the item is a folder, it displays an icon and a link to the folder, and a link to view its contents. If the item is a file, it displays an icon, the file title, and links to download the file and view the users who have access to it.

The file also contains logic to generate the download link for each file, based on the file ID and MIME type.

# extra note

- to download the file click on the down arrow icon.
- To see the list of people who have access to the file, click on the eye icon. Note that the view button will not display the names on the screen, but rather print them in the console.
- If your server is still running even after you have suspended app.js, you will need to terminate the process ID associated with port 3000. On a Mac, you can do this by running the following command: "lsof -i -P -n | grep LISTEN" to locate the PID associated with port 3000, and then use the command "kill -9 <PID>" to terminate the process.

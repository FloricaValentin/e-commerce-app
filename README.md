Installation guide : 
First clone the repo 
and then install dependencies using : npm install 

Starting project : npm start 

This project requires Firebase services for authentication, database, and storage functionalities. Before running the project, you need to set up Firebase and obtain the necessary configuration information. Follow these steps:

1) Create a firebase project

2) Obtain your configuration file (ex: ApiKey, AuthDomain,ProjectId etc)

3) Use a .env file where you add your configuration there to match the config.jsx file 

Ex : REACT_APP_FIREBASE_API_KEY=<your_api_key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
REACT_APP_FIREBASE_PROJECT_ID=<your_project_id> etc. 

License
This project is licensed under the MIT License. See the LICENSE file for details.

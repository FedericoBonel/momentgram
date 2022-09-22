# Front-end client

This is the frontend client of the system, it was developed using ReactJS, React Router and create-react-app.

## How to start using this?

1. Install nodeJS
2. Clone this repository.
3. Set up and run the [backend of the system](https://github.com/FedericoBonel/momentgram/tree/master/server).
4. Go to the client folder:
      
        cd ./client
        
5. Set your environment variables (either by running the app.js with those variables declared or adding a .env file to the /client folder):

        REACT_APP_BACKEND_URL=The url where your backend is runinng (i.e. http://localhost:5000)
        REACT_APP_BACKEND_URI=$REACT_APP_BACKEND_URL{The backend base uri (i.e. /api/v1/)}
        REACT_APP_SERVER_HOST=The url where your front end client is being served (i.e. http://localhost:3000) 

6. Install the application to download dependencies:

        npm install
        
7. Run the build script to create an optimized version of the app:

        npm run build
        
8. Serve the ./client/build folder with some package (You could use the [serve package](https://www.npmjs.com/package/serve))
9. Done and done! You can now go to the url where you are serving this client and access it!

## Code Organization

The code is structured and modularized in 3 main layers as follows:

* Components: Contains all the React components that will be aggregated into one or many pages (i.g. Forms, rows, input fields, moment excerpts, etc.).
* Pages: Contains all the Pages that are displayed on one specific route (i.g. Dashboard, Registration Page, Error Page, etc.)
* Apis: Contains all the logic that involves making an HTTP request to the backend server exposing only the data and the response code to be handled as needed on each component. To keep the code organized, clear and lightly coupled I try to only allow api calls on pages or components where the specific states that use api data are defined. (i.g. the moment comment form calls an onSubmit prop to add a new comment, and that onSubmit api access will be a responsibility of whatever page or component has defined the specific moment where the comment is to be added).

There are some extra folders and packages but those are mostly utils and such.

## A word on state and context

This client is not using Redux or some other fancy package to keep a global state. For an example to keep a global access to the user token, we are using only the React Context. This of course is viable for now, but I'm well aware that at some point it'll be better to start managing a global normalized state and reducers to change it, hence, beware that this app is destined to change at some point or another.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

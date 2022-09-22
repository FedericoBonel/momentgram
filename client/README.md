# Front-end client

This is the frontend client of the system, it was developed using ReactJS, React Router and create-react-app.

## Code Organization

The code is structured and modularized in 3 main layers as follows:

* Components: Contains all the React components that will be aggregated into one or many pages (i.g. Forms, rows, input fields, moment excerpts, etc.).
* Pages: Contains all the Pages that are displayed on one specific route (i.g. Dashboard, Registration Page, Error Page, etc.)
* Apis: Contains all the logic that involves making an HTTP request to the backend server exposing only the data and the response code to be handled as needed on each component. To keep the code organized, clear and lightly coupled I try to only allow api calls on pages or components where the specific states that use api data are defined. (i.g. the moment comment form calls an onSubmit prop to add a new comment, and that onSubmit api access will be a responsibility of whatever page or component has defined the specific moment where the comment is to be added).

There are some extra folders and packages but those are mostly utils and such.

## A word on state and context

This client is not using Redux or some other package to keep a global state, to keep a global access to the user token for an example, we are using only the React Context. This of course is viable for now, but I'm well aware that at some point it'll be better to start managing a global normalized state and reducers, hence, be aware that this app is destined to change at some point or another.

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

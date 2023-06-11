# ATN-Warensystem Frontend

This repo contains the front end of the ATN-Warensystem system. The frontend is built with [React](https://reactjs.org/).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test:e2e`

Launches the app in the development mode and runs the [End-to-End tests](https://jestjs.io/docs/puppeteer).\
The tests are automatically started in an external browser.
Note that for the tests to run the backend needs to be running.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Development

### Resources

[React](https://reactjs.org/) : The JavaScript framework used in this project.

[React Router DOM](https://reacttraining.com/react-router/web/guides/quick-start) : The routing library used in this project.

[Material-UI](https://mui.com/) : The UI library used in this project.

[react-i18next](https://www.npmjs.com/package/react-i18next) : The internationalization library used in this project.

[axios](https://www.npmjs.com/package/axios) : The HTTP library used in this project.

### Configuration [config.js](src/config/config.js)

### Navigation

The frontend navigate between pages using the [React Router DOM](https://reacttraining.com/react-router/web/guides/quick-start) library. The following pages are available:

- /index/dashboard : The dashboard page.
- /index/articles : The articles table page.
- /index/ordered : The orders table page.

The routes are defined in the [src/app.js](src/app.js) file in the MainWindow component.

### Services

#### Authentication service [src/services/auth.service.js] :

handles backend API requests for user authentication. the authentication method used in the app is [JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html). The authentication token is stored in the browsers's local storage. The token is used to authenticate the user in the backend API. The refresh token is used to refresh the token if it expires which keeps the user logged in even after long periods of inactivity. Both durations of access and refresh tokens are set in the backend settings.py file.
this service handles three API requests:

    - Login : POST /api/auth/login
    fetches the user's authentication token, refresh token and user role from the backend and stores them in the browsers's local storage.

    - Logout : POST /api/auth/logout
    deletes the authentication token and refresh token from the browsers's local storage.

    - Refresh : POST /api/auth/refresh
    refreshes the authentication token if it has expired and stores it in the browsers's local storage.

#### API service [src/services/API.service.js] :

this file contains all other API requests.

The UserApi class adds the Base-URL (defined in [src\config\config.js](src\config\config.js)) and authentication headers to the requests before sending them to the Backend. The authentication headers are fetched from the browsers's local storage saved by the Authentication service.

If the URL's paths are updated in the Backend, they only need to be updated in the API.service.js file.

### Components

- [App](src\App.js) : The main component of the app.
  the app is the root component of the application. It contains the MainWindow component. In the app component the following functions are handled

  - useEffect : The effect hook is used to handle refreshing the access token every hour. ( another method for refreshing the access token can be implemented in which the refresh token is used to get a new access token upon token expiry rather than every hour which allows the user to stay signed in over long periods of inactivity)
  - onLogout : The function is called when the user logs out.
  - useEffect : the effect hook is used to fetch the user information from the local storage and set it to the state. or redirect to login page if no user was found in local storage.

  MainWindow : handles the navigation between the pages. and also the sidebar menu.
  new pages can be added by adding a new route to the "routes" array and corresponding sidebar button in "drawerButtons" array in the MainWindow component.

- [ArticlesTable](src/Components/ArticlesTable/)
  This folder contains all components related to the articles table.

  - [UpdatedArticleTable.jsx](src/Components/ArticlesTable/UpdatedArticleTable.jsx) : This component contains the articles table definition, it's build upon [MUI's Data Grid](https://mui.com/x/react-data-grid/)
  - [AddArticleDialog.jsx](src/Components/ArticlesTable/AddArticleDialog.jsx) : This component contains the pop up dialog for adding a new article.
  - [AddManufacturerDialog.jsx](src/Components/ArticlesTable/AddManufacturerDialog.jsx) : This component contains the pop up dialog for adding a new manufacturer.
  - [AddStorageDialog.jsx](src/Components/ArticlesTable/AddStorageDialog.jsx) : This component contains the pop up dialog for adding a new storage.
  - [ArticlesMainContainer.jsx](src/Components/ArticlesTable/ArticlesMainContainer.jsx) : This component contains the articles table.
  - [CellExpander.js](src/Components/ArticlesTable/CellExpander.js) : This component contains the cell expander.

- [OrdersTable](src/Components/OrdersTable/)
  This folder contains all components related to the orders table.

  - [OrdersMainContainer.jsx](src/Components/OrdersTable/OrdersMainContainer.jsx) : This component contains the orders table.
  - [UpdatedOrderTable.jsx](src/Components/OrdersTable/UpdatedOrderTable.jsx) : This component contains the orders table definition, it's build upon [MUI's Data Grid](https://mui.com/x/react-data-grid/)

- [Dashboard](src/Components/Dashboard/)
  This folder contains all components related to the dashboard.

  - [AttrCard.jsx](src/Components/Dashboard/AttrCard.jsx) : This component contains the attribute card.
  - [Dashboard.jsx](src/Components/Dashboard/Dashboard.jsx) : This component contains the dashboard.
  - [ETCard.jsx](src/Components/Dashboard/ETCard.jsx) : This component contains the E-technik card.
  - [FTCard.jsx](src/Components/Dashboard/FTCard.jsx) : This component contains the Fertigungsteile card.
  - [KTCard.jsx](src/Components/Dashboard/KTCard.jsx) : This component contains the Kaufsteile card.
  - [OrdersCard.jsx](src/Components/Dashboard/OrdersCard.jsx) : This component contains the orders card.
  - [TotalValue.jsx](src/Components/Dashboard/TotalValue.jsx) : This component contains the total value card.
  -

### Internationalization [i18n.js](src/i18n.js)

## Deployment

## Testing

# Tech Stack


## Frontend

This section documents the structure of the frontend and outlines the important interactions.

```
/client
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── index.html
├── package.json
├── vite.config.js
```

### Important Files & Directories

- `index.html` serves as a way to connect our React framework to standard HTML format.
- `package.json` is where all the dependancies of our node.js config lives
- `main.jsx` is where we inject the jsx code into the root div in the index.html. This is also where the website routing is structured
- `App.jsx` can be thought of as the "home" page
- `index.css` provides the style of our website
- `layout directory` structures main website so that it can be browsed through dynamically
- `pages directory` populates the page using the layout
- `components directory` the bread and butter of react lives here. React follows a composable model, where we build smaller components and are able to dynamically and efficiently call them whenever they are needed.

### Concepts

A vague list of core concepts to learn

- `HTML`
- `CSS`
- `node.js`
- `React.js`
- `React Components`
- `react-dom-router`
- `useState`
- `useEffect`

### Resources

- [Full Stack Development Explained](https://www.mongodb.com/languages/full-stack-development)
- [100+ Web Development Things you Should Know
  ](https://www.youtube.com/watch?v=erEgovG9WBs&ab_channel=Fireship)
- [How to OVER Engineer a Website // What is a Tech Stack?
  ](https://www.youtube.com/watch?v=Sxxw3qtb3_g&ab_channel=Fireship)
- [How to Create a Express/Node + React Project | Node Backend + React Frontend
  ](https://www.youtube.com/watch?v=w3vs4a03y3I&ab_channel=ArpanNeupane)
- [Scrimba: Learn React](https://scrimba.com/learn/learnreact)

## Backend Server

This section outlines the structure of the backend server, and important concepts to understand the structure.

### Structure

```
/server
├── routes/
├── services/
├── tests/
├── src/
│   ├── constants.js
│   ├── index.js
│   ├── neo4j.js
├── .env
├── package.json
```

### Important Files & Directories

- `index.js` initializes the neo4j database connection and api routing using Express.js as the server
- `.env` config file which contains information necessary to connect to the neo4j database
- `constants.js`contain config information in the form of js
- `neo4j.js` initializes a singleton instance of the neo4j driver, which is used to make API calls to the database
- `routes.js` is where API calls are created which utilizes the neo4j driver
- `services directory` contains a list of classes which contains the methods to build the API calls in routes.

### Concepts

A Vague list of concepts that are useful to understand

- `API calls`
- `server`
- `routing`
- `middleware`
- `backend frameworks`

### Resources

- [Backend web development - a complete overview](https://www.youtube.com/watch?v=XBu54nfzxAQ&ab_channel=SuperSimpleDev)

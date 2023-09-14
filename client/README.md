# Frontend
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

## Important Files & Directories
- `index.html` serves as a way to connect our React framework to standard HTML format.
- `package.json` is where all the dependancies of our node.js config lives
- `main.jsx` is where we inject the jsx code into the root div in the index.html. This is also where the website routing is structured
- `App.jsx` can be thought of as the "home" page
- `index.css` provides the style of our website
- `layout directory` structures main website so that it can be browsed through dynamically
- `pages directory` populates the page using the layout
- `components directory` the bread and butter of react lives here. React follows a composable model, where we build smaller components and are able to dynamically and efficiently call them whenever they are needed.

## Concepts
A vague list of core concepts to learn
- `HTML`
- `CSS`
- `node.js`
- `React.js`
- `React Components`
- `react-dom-router`
- `useState`
- `useEffect`

## Resources
- [Full Stack Development Explained](https://www.mongodb.com/languages/full-stack-development)
- [100+ Web Development Things you Should Know
](https://www.youtube.com/watch?v=erEgovG9WBs&ab_channel=Fireship)
- [How to OVER Engineer a Website // What is a Tech Stack?
](https://www.youtube.com/watch?v=Sxxw3qtb3_g&ab_channel=Fireship)
- [How to Create a Express/Node + React Project | Node Backend + React Frontend
](https://www.youtube.com/watch?v=w3vs4a03y3I&ab_channel=ArpanNeupane)
- [Scrimba: Learn React](https://scrimba.com/learn/learnreact)




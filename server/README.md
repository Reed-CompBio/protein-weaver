# Backend Server
This section outlines the structure of the backend server, and important concepts to understand the structure.

## Structure
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

## Important Files & Directories
- `index.js` initializes the neo4j database connection and api routing using Express.js as the server
- `.env` config file which contains information necessary to connect to the neo4j database
- `constants.js`contain config information in the form of js
- `neo4j.js` initializes a singleton instance of the neo4j driver, which is used to make API calls to the database
- `routes.js` is where API calls are created which utilizes the neo4j driver
- `services directory` contains a list of classes which contains the methods to build the API calls in routes.

## Concepts
A Vague list of concepts that are useful to understand
- `API calls`
- `server`
- `routing`
- `middleware`
- `backend frameworks`

## Resources
- [Backend web development - a complete overview](https://www.youtube.com/watch?v=XBu54nfzxAQ&ab_channel=SuperSimpleDev)
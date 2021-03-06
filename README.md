# lodi-event-booking

MERN Stack + GraphQL API & Apollo Client - Create and book event

#### npm start alternative

Instead of running npm start in both client and server, you can run both at the same time using this.

install `npm install concurrently`

###### package.json

```json
"scripts": {
    "start": "node app.js",
    "server": "nodemon app.js",
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
```

terminal `npm run dev`

## Deployment

###### client/App.js

`uri: "http://localhost:5000/graphql";` to `uri: "/graphql";`

###### app.js

```javascript
const path = require("path");

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
```

###### client/package.json

```json
"proxy": "http://localhost:5000"
"build": "react-scripts build && move build ../public"
```

terminal `cd client` `npm run build`

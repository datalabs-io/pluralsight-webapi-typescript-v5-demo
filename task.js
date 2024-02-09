// 1. Show how to implement an Interface, a type alias, modules and namespaces
// 2. Show how to  make a GET and a POST using FETCH, show how to handle both simple text response and also a JSON response
// 3. Show how to  define a custom type for an API response, show type assertion and type casting
// 4. Show how to send a custom header in an API response and how to map a HTTP response to a custom type
// 5. Show how to handle user authentication (simple login)
// 6. Show how to implement client-side caching for API response to speed things up locally and not have to re-fetch data over and over
// 7. Show how to implement API versioning
// 8. Show how to implement local trottling of requests and how to implement websockets (server and client)


// 1. Show how to implement an Interface, a type alias, modules and namespaces
// Interface in flightData.ts
export interface FlightData {
    states: StateData[];
  }

  export interface StateData {
    icao24: string;
    callsign: string;
    country: string;
    longitude: number;
    latitude: number;
    altitude: number;
    trueTrack: number;
  }
  
// type alias in map.tsx
type HistoryElement = {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
// modules in map.tsx 
import { FlightData, StateData } from './flightData'; 

// namespaces in flightData.tsx

namespace FlightDataNamespace {
    export interface FlightData {
      states: StateData[];
    }
  
    export interface StateData {
      icao24: string;
      callsign: string;
      country: string;
      longitude: number;
      latitude: number;
      altitude: number;
      trueTrack: number;
    }
  }
  
  export default FlightDataNamespace;
  
// namespaces exported in map.tsx

import FlightDataNamespace from './flightData';

const initialFlightData: FlightDataNamespace.FlightData = { states: [] };

// 2. Show how to  make a GET and a POST using FETCH, show how to handle both simple text response and also a JSON response
// GET request and handle a text response
const fetchDataFromServer = async () => {
    try {
      const response = await fetch('https://example.com/api/data', {
        method: 'GET',
        // Add headers here if needed
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const textData = await response.text();
      setFlightData(textData);
    } catch (error) {
      console.error('Error:', error);
    }
  };
// GET Request and Setting JSON Response
const fetchJSONDataFromServer = async () => {
    try {
      const response = await fetch(`http://localhost:4000/opensky-local?fileId=data${counterId}`, {
        method: 'GET',
        // Add headers here if needed
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const jsonData = await response.json();
      setFlightData(jsonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };
// POST Request and Setting Text Response
const postDataToServer = async () => {
    const dataToSend = { key: 'value' };
  
    try {
      const response = await fetch(`http://localhost:4000/opensky-local?fileId=data${counterId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the appropriate content type
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const textResponse = await response.text();
      setFlightData(textResponse);
    } catch (error) {
      console.error('Error:', error);
    }
  };
// POST Request and Setting JSON Response 
const postJSONDataToServer = async () => {
    const dataToSend = { key: 'value' };
    try {
      const response = await fetch(`http://localhost:4000/opensky-local?fileId=data${counterId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the appropriate content type
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const jsonData = await response.json();
      setFlightData(jsonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
// 3. Show how to  define a custom type for an API response, show type assertion and type casting
// In TypeScript, the concept of "type casting" and "type assertion" is often used interchangeably 
// because TypeScript primarily uses type assertions for explicit type conversions.
interface TextApiResponse {
    text: string;
  }
  
  interface JsonApiResponse {
    data: FlightDataNamespace.FlightData;
  }
  
// Fetch and handle text response
const fetchDataFromServer = async () => {
    try {
      const response = await fetch(`http://localhost:4000/opensky-local?fileId=data${counterId}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const textData = await response.text();
  
      // Type assertion to treat textData as TextApiResponse
      const response: TextApiResponse = {
        text: textData,
      };
  
      // Now we can work with response as a TextApiResponse
      setFlightData(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Fetch and handle JSON response
  const fetchJSONDataFromServer = async () => {
    try {
      const response = await fetch(`http://localhost:4000/opensky-local?fileId=data${counterId}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const jsonData = await response.json();
  
      // Type assertion to treat jsonData as JsonApiResponse
      const response: JsonApiResponse = {
        data: jsonData,
      };
  
      // Now we can work with response as a JsonApiResponse
      setFlightData(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

// 4. Show how to send a custom header in an API response and how to map a HTTP response to a custom type
// 4.1 how to send a custom header in an API response (adding "Authorization" header)
const fetchDataWithCustomHeader = async () => {
    try {
      const customHeaders = new Headers();
      customHeaders.append('Authorization', 'Bearer yourAccessToken');
  
      const response = await fetch(`http://localhost:4000/opensky-local?fileId=data${counterId}`, {
        method: 'GET',
        headers: customHeaders,
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const jsonData = await response.json();
      setFlightData(jsonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
// 4.2 how to map a HTTP response to a custom type (ex. CustomApiResponse type)
// Define a custom type
interface CustomApiResponse {
    data: string;
    customField: number;
  }
  
  // Fetch and handle the response
  const fetchDataWithCustomMapping = async () => {
    try {
      const response = await fetch(`http://localhost:4000/opensky-local?fileId=data${counterId}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const jsonData: CustomApiResponse = await response.json();

      setFlightData(jsonData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

// 5. Show how to handle user authentication (simple login)
// to implement auth into the backend we shoul add the next code
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 

const users = [
  { username: 'admin', password: 'admin' },
];

let isAuthenticated = false;
// Authentication middleware
const authenticate = (req, res, next) => {
    if (isAuthenticated) {
      // User is authenticated, proceed to the next middleware or route handler.
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      isAuthenticated = true;
      res.status(200).json({ message: 'Login successful' });
    } else {
      isAuthenticated = false;
      res.status(401).json({ message: 'Login failed' });
    }
  });

// to implement auth into the frontend we should add the next code
// should create new component login.tsx inside components folder 
// and modify App.tsx code adding login post function and conditions to chek if user loggedin or not

// 6. Show how to implement client-side caching for API response to speed things up locally and not have to re-fetch data over and over
// to implement client-side caching for login we should update login.tsx component
const saveLoginCredentials = () => {
  localStorage.setItem('username', username);
  localStorage.setItem('password', password);
};

const handleCredentialInput = () => {
  const savedUsername = localStorage.getItem('username');
  const savedPassword = localStorage.getItem('password');

  if (savedUsername && savedPassword) {
    setUsername(savedUsername);
    setPassword(savedPassword);
  }
};

React.useEffect(() => {
  handleCredentialInput();
}, []);
// and update App.tsx
const checkStoredCredentials = () => {
  const storedUsername = localStorage.getItem('username');
  const storedPassword = localStorage.getItem('password');
  if (storedUsername && storedPassword) {
    handleLogin(storedUsername, storedPassword);
  }
};

useEffect(() => {
  checkStoredCredentials();
}, []);

const handleLogin = async (username: any, password: any) => {
  try {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);

      setIsLoggedIn(true);
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

// 7. Show how to implement API versioning
// In our backend project's server.js file, we need to create two routers named v1Router and v2Router.
// The distinction between the two routers lies in their response data. 
// v1Router returns data in the format: { data: { time, states } }, 
// while v2Router provides data in this format: { data: { time, states, total } }, 
// where "total" represents the number of states in the data.

const v1Router = express.Router();
v1Router.get('/opensky-local', authenticate, (req, res) => {
  if (req.query.fileId) {
    let jsonFile = req.query.fileId;
    console.log(jsonFile);
    const filePath = `./uploads/${jsonFile}.json`;

    if (fs.existsSync(filePath)) {
      try {
        const dataFromFile = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(dataFromFile);

        res.json({
          data: jsonData,
        });
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } else {
    res.status(400).json({ error: 'Bad Request' });
  }
});

const v2Router = express.Router();
v2Router.get('/opensky-local', authenticate, (req, res) => {
  if (req.query.fileId) {
    let jsonFile = req.query.fileId;
    console.log(jsonFile);
    const filePath = `./uploads/${jsonFile}.json`;

    if (fs.existsSync(filePath)) {
      try {
        const dataFromFile = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(dataFromFile);

        // Calculate the total number of states
        const totalStates = jsonData.states.length;

        res.json({
          data: jsonData,
          total: totalStates,
        });
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } else {
    res.status(400).json({ error: 'Bad Request' });
  }
});

app.use('/v1', v1Router);
app.use('/v2', v2Router);
// on frontend add new variable to .env file REACT_APP_VERSION and add it into main fetch function fetchDataFromOpenSkyLocal() into the url 


// 8. Show how to implement local trottling of requests and how to implement websockets (server and client)
// 8.1 Show how to implement local trottling of requests
// backend in server.js we have to import the rate limiter from 'limiter' library and implement the next logic:
import { RateLimiter } from "limiter";

// Allow 150 requests per hour. 
const limiter = new RateLimiter({ tokensPerInterval: 150, interval: "hour" });

// add  await apiLimiter.removeTokens(1); into get method
v2Router.get('/opensky-local', authenticate, async (req, res) => {
  try {
    await apiLimiter.removeTokens(1);
    if (req.query.fileId) {
      let jsonFile = req.query.fileId;
      console.log(jsonFile);
      const filePath = `./uploads/${jsonFile}.json`;

      if (fs.existsSync(filePath)) {
        try {
          const dataFromFile = fs.readFileSync(filePath, 'utf-8');
          const jsonData = JSON.parse(dataFromFile);

          const totalStates = jsonData.states.length;

          res.json({
            data: jsonData,
            total: totalStates,
          });
        } catch (error) {
          console.error('Error parsing JSON data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } else {
      res.status(400).json({ error: 'Bad Request' });
    }
  } catch (error) {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
});



// 8.2 how to implement websockets (server and client)
// backend in server.js we should add next
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

let counter = 0;

let broadcastInterval;

function broadcastDataToClients() {
  const fileName = `data${counter}.json`;
  const filePath = `./uploads/${fileName}`;

  if (fs.existsSync(filePath)) {
    const dataFromFile = fs.readFileSync(filePath, 'utf-8');

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          const jsonData = JSON.parse(dataFromFile);
          client.send(JSON.stringify(jsonData));
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
      }
    });

    counter++;
  } else {
    console.log(`File ${fileName} not found. Broadcasting stopped.`);
    clearInterval(broadcastInterval);
  }
}

broadcastInterval = setInterval(broadcastDataToClients, 3000);

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});
// The data will be sent at each broadcast interval, and the interval will increase by 1 after each iteration

// frontend in .csv file we have to add new variable REACT_APP_WS which indicates do we want to have ws connection 
//and add the next code into map.tsx 
const webSocket = process.env.REACT_APP_WS;

useEffect(() => {
  if (webSocket === 'true') {
    const wsUrl = 'ws://localhost:4000';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFlightData(data);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }
}, [webSocket]);

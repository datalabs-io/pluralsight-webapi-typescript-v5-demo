// import React, { useState } from 'react';
// import './App.css';
// import Map from './components/map';
// import Login from './components/login';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); 

//   const handleLogin = async (username: any, password: any) => {
//     try {
//       const response = await fetch('http://localhost:4000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//         setIsLoggedIn(true);

//       } else {
//         console.error('Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   return (
//     <div className="App">
//       {isLoggedIn ? (
//         <Map /> 
//       ) : (
//         <Login onLogin={handleLogin} error={''} />
//       )}
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/map';
import Login from './components/login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const checkStoredCredentials = () => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    console.log(storedUsername,'storedUsername')
    console.log(storedPassword,'storedPassword')
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

  return (
    <div className="App">
      {isLoggedIn ? (
        <Map /> 
      ) : (
        <Login onLogin={handleLogin} error={''} />
      )}
    </div>
  );
}

export default App;

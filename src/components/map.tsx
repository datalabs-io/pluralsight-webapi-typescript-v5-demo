import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import FlightDataNamespace from './flightData';

const initialFlightData: FlightDataNamespace.FlightData = { states: [] };

type HistoryElement = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type MapProps = {};

const Map: React.FC<MapProps> = () => {
  if (process.env.REACT_APP_API_KEY == null) {
    throw new Error("You have to configure env REACT_APP_API_KEY");
  }

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [flightData, setFlightData] = useState<FlightDataNamespace.FlightData>(initialFlightData);

  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [markersArr, setMarkersArr] = useState<maplibregl.Marker[]>([]);
  const [counterId, setCounterId] = useState(0);
  const [requestStatus, setRequestStatus] = useState('ok');
  const webSocket = process.env.REACT_APP_WS;
  const version = process.env.REACT_APP_VERSION


  useEffect(() => {
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: `https://api.maptiler.com/maps/basic-v2-dark/style.json?key=${process.env.REACT_APP_API_KEY}`,
      center: [3, 37],
      zoom: 5,
    });

    newMap.addControl(new maplibregl.NavigationControl(), 'top-right');
    setMap(newMap);

    newMap.on('load', () => {
      setMap(newMap);
    });

    return () => {
      newMap.remove();
    };
  }, []);

  const fetchDataFromOpenSkyLocal = async () => {
    if (requestStatus === 'ok') {
      try {
        const response = await fetch(`http://localhost:4000/v${version}/opensky-local?fileId=data${counterId}`);
        if (response.ok) {
          const data = await response.json();
          setFlightData(data.data);
          setRequestStatus('ok');
        } else {
          console.error('Error fetching data from the mock OpenSky API:', response.status, response.statusText);
          setRequestStatus('error');
        }
      } catch (error) {
        console.error('Error fetching data from the mock OpenSky API:', error);
      }
    }
  };


  const clearMap = () => {
    markersArr.forEach((marker) => marker.remove());
    setMarkersArr([]);
  };

  const fetchDataFromOpenSkyLocalTest = () => {
    setCounterId((prevCounter) => prevCounter + 1);
  };

  useEffect(() => {
    const intervalId = setInterval(fetchDataFromOpenSkyLocalTest, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (webSocket === 'false') {
      fetchDataFromOpenSkyLocal();
      clearMap();
    }
    // eslint-disable-next-line
  }, [counterId]);

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

  const createCustomMarker = (color: string, rotation: number, properties: FlightDataNamespace.StateData) => {
    const customMarkerContainer = document.createElement('div');
    customMarkerContainer.className = 'custom-marker-container';

    customMarkerContainer.innerHTML = '';

    const customMarker = document.createElement('div');
    customMarker.className = 'custom-marker';
    customMarker.style.fontSize = '40px';
    customMarker.style.color = color;
    customMarker.textContent = '✈';
    customMarker.style.transform = `rotate(${rotation}deg)`;

    customMarkerContainer.appendChild(customMarker);

    return customMarkerContainer;
  };

  const getMarkerColor = (altitude: number) => {
    if (altitude < 1000) {
      return 'white';
    } else if (altitude < 2000) {
      return '#ff1300';
    } else if (altitude < 3000) {
      return 'orange';
    } else if (altitude < 5000) {
      return '#ffcf01';
    } else {
      return '#4aff00';
    }
  };

  const displayMarkers = (data: FlightDataNamespace.FlightData) => {
    data.states.forEach((flight:any) => {
      const icao24 = flight[0] as string;
      const callsign = flight[1] as string;
      const country = flight[2] as string;
      const longitude = flight[5] as number;
      const latitude = flight[6] as number;
      const altitude = flight[7] as number;
      const trueTrack = flight[10] as number;

      if (longitude && latitude) {
        const markerColor = getMarkerColor(altitude);

        const marker = new maplibregl.Marker({
          element: createCustomMarker(markerColor, trueTrack + 270, {
            icao24,
            callsign,
            country,
            longitude,
            latitude,
            altitude,
            trueTrack
          }),
        })
          .setLngLat([longitude, latitude])
          .addTo(map!);

        setMarkersArr((current) => [...current, marker]);

        // Left-click event
        marker.getElement().addEventListener('click', (e) => {
          if (!e.shiftKey) {
            e.stopPropagation();
            const popup = new maplibregl.Popup({ closeButton: false });
            popup.setLngLat([longitude, latitude]).setHTML(`
              <p><b>ICAO24:</b> ${icao24}</p>
              <p><b>Callsign:</b> ${callsign}</p>
              <p><b>Country:</b> ${country}</p>
              <p><b>Altitude:</b> ${altitude == null ? 0 : altitude} feet</p>
            `);

            const popups = document.getElementsByClassName("mapboxgl-popup");
            if (popups.length) {
              popups[0].remove();
            }

            popup.addTo(map!);
          }
        });

        // Right-click event
        marker.getElement().addEventListener('click', (e) => {
          if (e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();

            const secondpopup = new maplibregl.Popup({
              closeButton: false,
              className: "history",
              offset: [0, 5],
            });

            secondpopup.setLngLat([longitude, latitude]);
            const secondpopups = document.getElementsByClassName("mapboxgl-popup");
            if (secondpopups.length) {
              secondpopups[0].remove();
            }

            secondpopup.addTo(map!);

            const icao24id = icao24;
            fetch(`http://localhost:4000/history?icao24=${icao24id}`)
              .then((response) => response.json())
              .then((data) => {
                const historyElements = data.history.map((item: HistoryElement) => {
                  const date = new Date(item.timestamp * 1000);
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  const hours = date.getHours();
                  const minutes = date.getMinutes();
                  const seconds = date.getSeconds();
                  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                  return `<p><b>Latitude:</b> ${item.latitude}</p>
                          <p><b>Longitude:</b> ${item.longitude}</p>
                          <p><b>Time:</b> ${formattedDateTime}</p>
                          <p>------------------------------</p>`;
                });

                const historyHTML = historyElements.join('');
                secondpopup.setHTML(`
                  <p>History Data of ${icao24}:</p>
                  ${historyHTML}
                `);
              })
              .catch((error) => {
                console.error('Error fetching history data:', error);
              });
          }
        });
      }
    });
  };

  useEffect(() => {
    if (webSocket === 'false') {
      if (flightData.states) {
        displayMarkers(flightData);
      }
    }
    // eslint-disable-next-line
  }, [counterId]);

  useEffect(() => {
    if (webSocket === 'true') {
      clearMap();
      if (flightData.states) {
        displayMarkers(flightData);
      }
    }
    // eslint-disable-next-line
  }, [flightData]);

  return (
    <>
   
      <div className="map-wrap">
        <a href="https://www.maptiler.com" className="watermark">
          <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
        </a>
        <div ref={mapContainerRef} className="map" />
        <div id='refresh-btn' className="mapboxgl-ctrl">
          {webSocket === 'true' ? null : <div onClick={() => { clearMap(); setCounterId(counterId + 1); fetchDataFromOpenSkyLocal(); }}>refresh</div>}
        </div>

      </div>
    </> 
  );
};

export default Map;

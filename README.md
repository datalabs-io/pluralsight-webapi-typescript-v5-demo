# React Flight Map App

This React.js application is designed to display real-time flight data on an interactive map. It offers a customizable configuration through environment variables and provides options to retrieve flight data either via traditional HTTP requests or WebSocket.

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Environment Variables](#2-environment-variables)
3. [Source Code Structure](#3-source-code-structure)
4. [Map Component](#4-map-component)
5. [Data Fetching](#5-data-fetching)
6. [WebSocket Integration](#6-websocket-integration)

## 1. Application Overview

The React.js application is built to provide a dynamic and interactive map that visualizes live flight data. Users can tailor the behavior of the application based on their requirements, including the choice of data retrieval method. The core component of the application is the map, which forms the basis of the user interface.

## 2. Environment Variables

To configure the application's behavior, you can use environment variables. In the root directory, there's a `.env` file containing the following variables:

- `REACT_APP_API_KEY`: This environment variable is used to specify the API key required for map styling. It is a mandatory configuration.

- `REACT_APP_WS`: This environment variable can be set to either `'true'` or `'false'` to enable or disable WebSocket functionality. It influences the way the application obtains flight data.

## 3. Source Code Structure

The application's source code is organized as follows:

- `src/`: This is the root directory of the source code.

  - `index.js`: The application's entry point, responsible for initializing the React application.

  - `index.css`: The primary CSS file for the application.

  - `App.js`: The central component that renders the application's user interface, including the map component.

  - `components/`: This directory holds various components utilized by the application.

    - `map.js`: The central component that handles the map rendering, displays flight data markers, and manages user interactions.

    - `map.css`: CSS styles specific to the map component.

## 4. Map Component

The `Map` component is the main component of the application, delivering the interactive map and facilitating the presentation of flight data.

- The component utilizes the [MapLibre GL](https://www.mapbox.com/maplibre-gl/) library to create interactive maps.

- Functions like `createCustomMarker`, `getMarkerColor`, and `displayMarkers` are responsible for customizing marker styling and rendering flight data.

- The component manages user interactions, allowing left-click and right-click actions on map markers.

## 5. Data Fetching

The application fetches flight data using either traditional HTTP requests or WebSocket, depending on the `REACT_APP_WS` environment variable.

- When `REACT_APP_WS` is set to `'false'`, the application uses HTTP requests to fetch flight data from a local server at `http://localhost:4000/opensky-local`.

- When `REACT_APP_WS` is set to `'true'`, the application establishes a WebSocket connection to receive real-time flight data from `ws://localhost:4000`.

## 6. WebSocket Integration

If WebSocket integration is enabled (by setting `REACT_APP_WS` to `'true'`), the application initiates a WebSocket connection with the server.

- Real-time flight data is received and displayed on the map as it becomes available.

- The WebSocket connection is established, and event handlers are configured to manage data reception and connection status.

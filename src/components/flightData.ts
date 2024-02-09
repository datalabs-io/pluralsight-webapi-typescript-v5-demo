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
  
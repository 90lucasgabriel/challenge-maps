// MAPS -------------------------------
export class MapsRequest {
  constructor(
    key?:           string, // MAP API KEY
    address?:       string, 
    components?:    string,
    latlng?:        string,
    place_id?:      string
  ) {	}
}

export interface MapsResponse {
  results:          [Map],
  status:           string;
}

export interface Map {
  address_components: any,
  formatted_address:  string,
  geometry: {
    location: {
      lat: string,
      lng: string
    }
  },
  place_id:           string,
  types:              any
}


// PLACES --------------------------------
export class PlacesRequest {
  constructor(
    key?:           string, // MAP API KEY
    location?:      string, 
    radius?:        number,
    type?:          string
  ) {	}
}
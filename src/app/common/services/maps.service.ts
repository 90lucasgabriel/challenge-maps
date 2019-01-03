// IMPORTS -----------------------------------------------------
  // ANGULAR -------------------------
  import { Injectable }                 from '@angular/core';
  import { HttpClient }                 from '@angular/common/http';
  import { Observable }                 from 'rxjs';

  // SERVICES ------------------------
  import { UtilService }                from './util.service';
  import { MapsRequest, PlacesRequest } from '../../common/models/maps.model';





@Injectable()
export class MapsService {
// DECLARATIONS --------------------------------------------------
  private returnType:                 string = `json`;
  private mapsUrl:                    string = `https://maps.googleapis.com/maps/api/geocode/${this.returnType}?`;
  private placesUrl:                  string = `https://maps.googleapis.com/maps/api/place/nearbysearch/${this.returnType}?`;




// METHODS -------------------------------------------------------
  /**
   * GET Maps List
   */
  public queryMaps(param: MapsRequest): Observable<any> {
    const paramQueryString = this.util.ObjectToQuerystring(param);
    return this.http.get(`${this.mapsUrl}${paramQueryString}`);
  }

  /**
   * GET Places List
   */
  public queryPlaces(param: PlacesRequest): Observable<any> {
    const paramQueryString = this.util.ObjectToQuerystring(param);
    return this.http.get(`${this.placesUrl}${paramQueryString}`);
  }



// OTHERS ---------------------------------------------------------
  constructor(
    private http: HttpClient,
    private util: UtilService) { }

}

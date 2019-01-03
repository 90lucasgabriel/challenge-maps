/// <reference types="@types/googlemaps" />

// IMPORTS ---------------------------------------------
  // ANGULAR ------------------
  import { Component, OnInit, ViewChild }     from '@angular/core';  
  import { MatSnackBar }                      from '@angular/material';
  import { Observable }                       from 'rxjs';
  
  // SERVICES ------------------  
  import { ViacepService }                    from './common/services/viacep.service';
  import { MapsService }                      from './common/services/maps.service';
  //import { }                                  from 'googlemaps';

  // CONFIG --------------------
  import { AppConfig }                        from './app.config';
  import { MapsRequest, MapsResponse, Map, PlacesRequest } from './common/models/maps.model';
  import 'hammerjs';

  declare let google: any;
 


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
//DECLARATIONS ----------------------------------------- 
  public themeList:       any = AppConfig.THEME_LIST;

  // Requests variables
  public address:         string = '';
  public mapsRequest:     MapsRequest;
  public placesRequest:   PlacesRequest;

  // Response variables
  public resultViacep:    any;
  public resultMaps:      any;
  public resultPlaces:    any;
  
  public loading:         boolean = false;

  // Google maps elements
  @ViewChild('gmap') gmapElement: any;
  map:                    google.maps.Map;
  place:                  any;
  places:                 any;




//MAIN -------------------------------------------------
  /**
   * Start main functions 
   */
  private start() { }

  /**
   * Check and show Viacep result
   */
  private queryViacep(cep: string): void {
    cep = cep.replace(/\D/g, '');
    
    // Check CEP length and continue or show error
    if(cep.length === 8){
      this.loading          = true;

      // Call viacep service
      this.service.query(cep).subscribe(
      v => {
        // If exists, show result and maps
        if(!v.erro){
          this.resultViacep = v;
          this.loading      = false;
          this.queryMaps(cep);
        
        // If it doesn't exists, show error
        } else {
          this.openSnackBar('CEP não encontrado', 'OK');
          this.loading      = false;
        }        
      },

      // If it doesn't returns a valid value
      error => {
        this.openSnackBar('CEP não encontrado', 'OK');
        this.loading        = false;
      });
    } 

    // If CEP length is different from 8
    else {
      this.openSnackBar('CEP com quantidade de dígitos incorreta', 'OK');
      this.loading          = false;
    }

    
  }

  /**
   * Check and show Google Maps result
   */
  private queryMaps(address: string): void {
    this.loading        = true;
    this.mapsRequest    = {
      key:            AppConfig.MAPS_API_KEY,
      address:        address
    };

    // Call Google Maps service
    this.mapsService.queryMaps(this.mapsRequest).subscribe(
      // If it returns a valid result
      m => {
        const maps: MapsResponse = m;
        if(maps.status === 'OK'){
          const map: Map  = maps.results[0];                                                      // Get first result
          var mapProp     = {                                                                     // Create a properties var
            center: new google.maps.LatLng(map.geometry.location.lat, map.geometry.location.lng),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map        = new google.maps.Map(this.gmapElement.nativeElement, mapProp);         // Attr to local element
          var marker      = new google.maps.Marker({ position: mapProp.center });                 // Create marker
          marker.setMap(this.map);                                                                // Show marker

          // Search nearby places (Google Maps)
          this.queryPlaces(map);
        }
      },
      
      // If it doesn't returns a valid value
      error => {
        this.openSnackBar('CEP não encontrado', 'OK');
        this.loading      = false;
      } 
    );


  }
  
  /**
   * Search nearby places by address
   */
  private queryPlaces(map: any): void {
    // Create properties
    this.placesRequest = {
      key:            AppConfig.MAPS_API_KEY,
      location:       {lat: map.geometry.location.lat, lng: map.geometry.location.lng},
      radius:         '2000',
      type:           ['restaurant']
    };
    
    // Attr service to local variable and search
    this.place = new google.maps.places.PlacesService(this.map);
    this.place.nearbySearch(this.placesRequest, this.callbackPlaces);

    // Get localStorage places and insert markers into map
    setTimeout(() => {
      for(let i = 0; i< JSON.parse(localStorage.getItem('places')).length; i++){
        this.createMarker(JSON.parse(localStorage.getItem('places'))[i]); 
      } 
      this.places = JSON.parse(localStorage.getItem('places'));
      this.loading = false;
    }, 2500); 
  }

  /**
   * Callback of Google Maps function. Returns nearby places and adjust object
   */
  private callbackPlaces(results: [any], status: any): void {
    let valores = [];

    // If it returns a valid value
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      // Foreach result, create a new formatted object
      for(let i = 0; i < results.length; i++){
        let place = new Object ({
          name: results[i].name,
          photo: typeof results[i].photos !== 'undefined' 
              ? results[i].photos[0].getUrl()
              : '', //alternative a "nophoto.jpg"
          geometry: {location: results[i].geometry.location}, 
          vicinity: results[i].vicinity,
          rating: results[i].rating,
          icon: results[i].icon
        });

        // Insert each result into an array
        valores[i] = place;
      }

      // Add array to localStorage. (Google callback function can't be accessed by local functions)
      localStorage.setItem('places', JSON.stringify(valores));      
    }
  }

  /**
   * Insert markers into map
   */
  public createMarker(place: any): void {    
    let placeLoc  = place.geometry.location;
    let marker    = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location,
      icon: {
        url: place.icon,
        scaledSize: new google.maps.Size(25, 25)
      }
    });
  }




//OTHERS -----------------------------------------------
  constructor(
    public snackBar:      MatSnackBar,
    private service:      ViacepService,
    private mapsService:  MapsService) { }

  /**
   * Execute when component start
   */
  ngOnInit() {
    this.start();
  }

  // Show snackBar
  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  /**
   * Change theme
   */
  public selectTheme(theme) {
    document.body.className = '';
    document.body.classList.add(theme, 'mat-app-background');
  }
}

// IMPORTS ------------------------------------------
  // ANGULAR --------------
  import { NgModule }                   from '@angular/core';
  import { BrowserModule }              from '@angular/platform-browser';
  import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
  import { FormsModule }                from '@angular/forms';
  import { HttpClientModule }           from '@angular/common/http';

  // SERVICES ------------
  import { MapsService }                from './common/services/maps.service';
  import { ViacepService }              from './common/services/viacep.service';
  import { UtilService }                from './common/services/util.service';

  // OTHER -------------
  import { MaterialModule }             from './material/material.module';    
  import { AppComponent }               from './app.component';


@NgModule({
  imports:      [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    MaterialModule 
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [
    MapsService,
    ViacepService,
    UtilService
  ]
})
export class AppModule { }

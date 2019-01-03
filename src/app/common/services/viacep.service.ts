// IMPORTS -----------------------------------------------------
  // ANGULAR -------------------------
  import { Injectable }                 from '@angular/core';
  import { HttpClient }                 from '@angular/common/http';
  import { Observable }                 from 'rxjs';




@Injectable()
export class ViacepService {
// DECLARATIONS --------------------------------------------------
  private url:                        string = `https://viacep.com.br/ws`;
  private returnType:                 string = `json`;




// METHODS -------------------------------------------------------
  /**
   * GET Search List
   */
  public query(cep: string): Observable<any> {
    return this.http.get(`${this.url}/${cep}/${this.returnType}`);
  }




// OTHERS ---------------------------------------------------------
  constructor(private http: HttpClient) { }

}

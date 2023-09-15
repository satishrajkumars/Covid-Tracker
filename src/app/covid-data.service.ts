import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  private apiUrl = 'https://api.covidtracking.com/v1/states';

  constructor(private http: HttpClient) { }

  getStateCovidData(stateAbbreviation: string): Observable<any> {
    const stateApiUrl = this.apiUrl + '/' + stateAbbreviation + '/daily.json';
    return this.http.get(stateApiUrl);
  }
}

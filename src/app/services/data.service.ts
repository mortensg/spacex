import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  public getAllShipsList():Observable<any>{
    return this.http.get("https://api.spacexdata.com/v4/ships");
  }

  public requestLaunchData(): Observable<any[]> {
    let launches = this.http.get('https://api.spacexdata.com/v5/launches');
    let capsules = this.http.get('https://api.spacexdata.com/v4/capsules');
    let payloads = this.http.get('https://api.spacexdata.com/v4/payloads');

    return forkJoin([launches, capsules, payloads]);
  }
}

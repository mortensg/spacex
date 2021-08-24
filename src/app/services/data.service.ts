import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators'

export interface launch {
  name: string,
  payloads: payload[],
  capsules: capsules[]
}

export interface capsules {
  id: any,
  name: string,
  serial: any
}
export interface payload {
  id: any,
  name?: string,
}

export interface payloads {
  id?: any,
  name?: string
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  ships$ = this.http.get<any>('https://api.spacexdata.com/v4/ships');
  launches$ = this.http.get<launch[]>('https://api.spacexdata.com/v5/launches');
  capsules$ = this.http.get<capsules[]>('https://api.spacexdata.com/v4/capsules');
  payloads$ = this.http.get<payloads[]>('https://api.spacexdata.com/v4/payloads');

  getLaunchData$ = combineLatest([
    this.launches$,
    this.capsules$,
    this.payloads$
  ]).pipe(
    map(([launches, capsules, payloads]) =>
      {
        return launches.map(launch => ({
          ...launch,
          payloads: launch.payloads.map(payload => ({
            id: payload,
            name: payloads.find(p => payload === p.id)!.name
          })),
          capsules: launch.capsules.map(capsule => ({
            id: capsule,
            name: capsules.find(c => capsule === c.id)!.serial
          }))
        }))
      }
    )
  )
}

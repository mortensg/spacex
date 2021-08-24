import { DataService } from './services/data.service';
import { AfterViewInit, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'space';
  filterValues: any = {'mass_kg':[], 'roles':[]};
  launches$ = this.dataservice.getLaunchData$;
  massKgValues$ = this.dataservice.ships$
    .pipe(
      map(ships => ships.map(ship => {
        if(this.filterValues.mass_kg.indexOf(ship.mass_kg) === -1 && ship.mass_kg != null) {
          this.filterValues.mass_kg.push(ship.mass_kg);
        }
        ship.roles.map(role => {
          if(this.filterValues.roles.indexOf(role) === -1) {
            this.filterValues.roles.push(role)
          }
        })
      }))
    );

  private filter = new BehaviorSubject<any>({value: 'all', type: 'role'});
  filterAction$ = this.filter.asObservable();

  ships$ = combineLatest([
    this.dataservice.ships$,
    this.filterAction$,
  ])
  .pipe(
    map(([ships, filter]) =>
      ships.filter(ship => {
        if(filter.type === 'role') {

          if(filter.value === 'all') return true
          else return filter.value ? ship.roles.indexOf(filter.value) > -1: true

        } else if(filter.type === 'mass_kg') {

          if(filter.value === 'all') return true
          else return filter.value ? ship.mass_kg == filter.value: true

        } else return true
      })

    )
  )

  constructor(private dataservice:DataService) {}

  ngAfterViewInit(): void {
  }

  selectedRole(value, type) {
    this.filter.next({value: value.value, type: type})
  }
}

import { DataService } from './services/data.service';
import { AfterViewInit, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'space';
  ships:any=[];
  displayedColumns: string[] = ['name', 'type', 'mass_kg', 'roles'];
  displayedColumnsLaunches: string[] = ['name', 'capsules', 'payloads'];
  filterRolers: string[] = [];
  filterMassKg: string[] = [];
  launches: any = []

  constructor(private dataservice:DataService) {
  }

  ngAfterViewInit(): void {
    this.dataservice.getAllShipsList().subscribe(data => {
      this.ships = new MatTableDataSource(data);
      this.addFilter(data);
    })


    this.dataservice.requestLaunchData().subscribe(data => {
        data[0].forEach(launches => {
          launches.capsules.forEach(capsule => {
            let obj = data[1].find(o => o.id === capsule);
            launches.capsules = {id: capsule, name: obj.serial};
          });

          launches.payloads.forEach((payload, i) => {
            let obj = data[2].find(o => o.id === payload);
            launches.payloads[i] = {id: payload, name: obj.name};
          });
        });
        this.launches = new MatTableDataSource(data[0]);
    });

  }

  addFilter(data) {
    data.forEach(element => {
      element.roles.forEach(role => {
        if(this.filterRolers.indexOf(role) === -1) this.filterRolers.push(role);
      });
      if(this.filterMassKg.indexOf(element.mass_kg) === -1) this.filterMassKg.push(element.mass_kg);
    });
  }

  filter(value) {
    this.ships.filter = value.toString();
  }

}

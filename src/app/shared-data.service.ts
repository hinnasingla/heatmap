import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import mockData from '../assets/mockData.json';
//import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() {
    this.getEventData()
   }

  private dataSubject = new BehaviorSubject<any[]>([mockData]);


  getDataFromSubject() {
    return this.dataSubject.asObservable();
  }
  setNewDataToSubject(newValue: any[]) {
    this.dataSubject.next(newValue);
  }

  getEventData(): Observable<any>{
    this.setNewDataToSubject(mockData);
    return of(mockData);   // converting mock data to observable so that we can subscribe to it.
  }

  //can use below mwthod if we had api to fetch the results.Currently using mock data
  // fetchEventData() {
  //   this.http.get<any[]>('https://api').subscribe(
  //     data => {
  //       this.dataSubject.next(data);
  //     },
  //     error => {
  //       console.error('Failed to fetch initial event data:', error);
  //     }
  //   );
  // }

}

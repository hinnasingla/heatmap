import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { SharedDataService } from './shared-data.service';
import { EventData } from '../assets/heatmap';
import { debounceTime, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeatmapComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [SharedDataService]
})
export class AppComponent {
  eventData: EventData[] = [];
  startDate: string = "";
  endDate: string = "";
  intensity: number = 0;
  selectedType: string = ""
  

  constructor(private sharedService: SharedDataService) {
    this.getRealTimeData();
  }

  // Displaying data monthy basis. Currently for july month

  getRealTimeData() {
    //using debounceTime if data updates are happening rapidly as it will limit the rate of api calls.
    //can be used on fetchEventData method of service.
    this.sharedService.getEventData().subscribe((val) => {
      const parsedData = val.map((item: { timestamp: string | number | Date; intensity: any; }) => ({
        timestamp: new Date(item.timestamp),
        intensity: item.intensity
      }));
      this.eventData = parsedData;
    })
  }



  filterData() {
    if (this.selectedType == "1") {
      const filteredData =this.eventData.filter((x) => {
        const date = new Date(x.timestamp).toISOString()
        if (date >= this.startDate && date <= this.endDate) {
          return true;
        }
        else {
          return false;
        }
      })
     this.sharedService.setNewDataToSubject(filteredData)

    }
    else if (this.selectedType == "2") {
      const filteredData = this.eventData.filter((x) => {
        return x.intensity > this.intensity;
      })
      this.sharedService.setNewDataToSubject(filteredData)
    }
    else{
      this.sharedService.setNewDataToSubject(this.eventData)
    }

  }






}

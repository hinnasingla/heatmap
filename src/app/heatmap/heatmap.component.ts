import { Component, Input, SimpleChange } from '@angular/core';
import { EventData } from '../../assets/heatmap';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})
export class HeatmapComponent {
  @Input() eventData: EventData[] = [];
  heatMapData: number[][] = [];
  private _subscription!: Subscription;

  leftIndicators: string[] = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']; 
  // rightIndicators: string[] = ['SU', 'MO', 'TU','WE','TH','FR','SA']; 
  constructor(private sharedService: SharedDataService){
    
  }

  ngOnInit(): void {
   this._subscription = this.sharedService.getDataFromSubject().subscribe((data)=>{
      this.calculateHeatMap(data);
    })
    
  }

 
  calculateHeatMap(eventData: EventData[]): void {
    console.log(this.eventData,"eventData in calculate")
    const numRows = 24; // 24 hours
    const noOfColmns =this.getTotalDaysInMonth(2024,6) // calculating for a month's data.
    this.heatMapData = Array(numRows).fill(0).map(() => Array(noOfColmns).fill(0)); 

    eventData.forEach(event => {
      const date = new Date(event.timestamp);
      const hour = date.getHours();
      const day = date.getDate();

      if (hour >= 0 && hour < numRows) {
        this.heatMapData[hour][day] += event.intensity;
      }
    });

  }


  getColorForCell(cellvalue: number) {
    const minValue = 0;
    const maxValue = 20; // Adjust based on your data range
    const hue = ((1 - (cellvalue - minValue) / (maxValue - minValue)) * 120).toString(10);
    return `hsl(${hue}, 100%, 50%)`;

  }

  // can set columns based on difference between incoming dates
  // getColumns(){
  //   const date1 = new Date(this.eventData[this.eventData.length-1].timestamp);
  //   const date2 = new Date(this.eventData[0].timestamp);
  //   date1.setHours(0,0,0,0);
  //   date2.setHours(0,0,0,0);
  //   const diffInMiliscnds = date1.getTime() - date2.getTime()
  //   const differenceInDays = diffInMiliscnds /(60 * 60 * 24 * 1000)
  //   return differenceInDays;


  // }

  //currently setting columns based on no of days of a month.
   getTotalDaysInMonth(year: number, month: number): number {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();
    return totalDays;
  }



  ngOnDestroy() {
    this._subscription.unsubscribe();
   }

}

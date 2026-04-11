import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart01',
  imports: [RouterLink,],
  templateUrl: './chart01.component.html',
  styleUrl: './chart01.component.css'
})
export class Chart01Component {

  chartArray = [
    {
      id: '1',
      labels: ['早餐', '午餐', '晚餐'],
      label: '花費',
      data: [30, 120, 300],
      backgroundColor: ['rgba(164, 162, 22, 1)', 'rgba(22, 93, 164, 1)', 'rgba(53, 17, 58, 1)']
    },
    {
      id: '2',
      labels: ['籃球', '桌球', '羽球'],
      label: '次數',
      data: [10, 20, 30],
      backgroundColor: ['rgba(65, 164, 22, 1)', 'rgba(34, 39, 43, 1)', 'rgba(234, 77, 255, 1)']
    }
  ]

  ngAfterViewInit(): void {

    for(let item of this.chartArray){
    let ctx = document.getElementById(item.id) as HTMLCanvasElement;

    let data = {
      labels: item.labels,
      datasets: [
        {
          label: item.label,
          data: item.data,
          backgroundColor: item.backgroundColor,
          hoverOffset: 15,
        },
      ],
    };

    let chart = new Chart(ctx, {
      type: 'pie',
      data: data,
    });
  }
}
}

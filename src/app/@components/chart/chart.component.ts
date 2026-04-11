import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../@service/api.service';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-chart',
  imports: [MatCardModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {

  quizId?: number;

  processedData: any[] = []; // 存放格式化後的圖表資料

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAnswerByQuizId();
  }

  getAnswerByQuizId() {
    this.apiService.getApi(`/get_answer?quizId=${this.quizId}`).subscribe((res) => {
      if (res.code == 200) {
        console.log(res);
        this.formatChartData(res.answerVoList);
        // 重要：必須等 Angular 渲染完 HTML 才能畫圖
        setTimeout(() => this.renderAllCharts(), 100);
      } else {
        console.log(res.message);
      }
    });
  }


  // 這個方法的作用是將從後端獲取的原始資料 list 進行格式化，轉換成適合 Chart.js 使用的格式
  formatChartData(list: any[]) {
    let groups = new Map();

    list.forEach(item => {
      let q = item.question;
      // 如果這個問題 ID 還沒有在 groups 中，先創建一個新的 entry
      if (!groups.has(q.questionId)) {
        // 這裡會把問題的標題、類型、選項等資訊存起來，方便後續統計和畫圖
        groups.set(q.questionId, {
          title: q.question,
          type: q.type,
          // 這裡會把選項字串用逗號分割成陣列，並去除多餘空白
          labels: q.options ? q.options.split(/[，,]/).map((s: string) => s.trim()) : [],
          answers: [], // 存問答題文字
          // 統計選擇題次數的物件，key 是選項，value 是被選擇的次數
          counts: {}
        });
      }

      // 統計選擇題次數或收集問答題答案
      let g = groups.get(q.questionId);
      if (q.type === 'Text') {
        g.answers.push(item.answer);
      } else {
        // 統計選擇題次數
        // 這裡會把使用者的答案字串用逗號分割成陣列，因為可能有多選題的情況，然後對每個選項進行統計
        let userAnsArray = item.answer.split(/[，,]/).map((s: string) => s.trim());
        // 這裡會對每個選項進行統計，累加到 counts 物件中
        userAnsArray.forEach((ans: string) => {
          g.counts[ans] = (g.counts[ans] || 0) + 1;
        });
      }
    });

    // 將統計資料轉換成陣列
    this.processedData = Array.from(groups.values());
    console.log(this.processedData);
  }


  // 這個方法的作用是根據 processedData 中的統計資料，為每個問題創建一個 Chart.js 圖表
  renderAllCharts() {
    this.processedData.forEach((item, i) => {
      if (item.type === 'Text') return;

      // 這裡會根據問題的索引 i，找到對應的 canvas 元素，然後使用 Chart.js 創建圖表
      let canvas = document.getElementById('chart-' + i) as HTMLCanvasElement;
      if (!canvas) return;

      // 防止重複渲染報錯 - 如果這個 canvas 已經有 Chart 物件了，先把它銷毀掉，然後再創建新的圖表
      let existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();

      // 根據問題的類型來決定圖表的類型，如果是多選題就用柱狀圖，否則用圓餅圖
      new Chart(canvas, {
        type: item.type === 'Multi' ? 'bar' : 'pie',
        // 這裡會把統計資料中的 labels 和 counts 組合成 Chart.js 需要的格式，labels 是選項名稱，data 是對應的次數，還有一些顏色設定
        data: {
          labels: item.labels,
          datasets: [{
            label: '票數',
            data: item.labels.map((l: string) => item.counts[l] || 0),
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#9CCC65']
          }]
        },
        options: { responsive: true }
      });
    });
  }
}

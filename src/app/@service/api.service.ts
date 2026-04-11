import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // 1. 設定後端地址 (注意引號要正確)
  private baseUrl = 'http://localhost:8080';

  // 2. 注入 HttpClient (給總機一支電話)
  constructor(private http: HttpClient) { }

  // 3. GET 方法 (用大括號包起來 { })
  getApi(url: string): Observable<any> {
    // 這裡會把 baseUrl 拼起來，變成 http://localhost:8080/user/login 之類的
    return this.http.get(this.baseUrl + url);
  }

  // 4. POST 方法 (用大括號包起來 { })
  postApi(url: string, postData: any): Observable<any> {
    return this.http.post(this.baseUrl + url, postData);
  }

  // api.service.ts
  saveQuestionnaire(data: any): Observable<any> {
    // 將整份 questionData 物件 POST 到後端 API
    // 路徑假設為 http://localhost:8080/api/questionnaire
    return this.http.post(`${this.baseUrl}/api/questionnaire`, data);
  }
}

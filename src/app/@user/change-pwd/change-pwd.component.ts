import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UpdatePassword, User } from '../../@interface/user';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../@service/api.service';

@Component({
  selector: 'app-change-pwd',
  imports: [FormsModule],
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.css'
})
export class ChangePwdComponent {

  user: UpdatePassword = {
    email: '',
    password: '',
    newPassword: '',
  }

  constructor(private router: Router, private apiService: ApiService) { }

  backLogin() {
    this.router.navigate(['/login']);
  }

  changePwd() {
    this.apiService.postApi("/update_password", this.user).subscribe(res => {
      console.log(res);
      if (res.code == 200) {
        alert('密碼修改成功！');
        this.router.navigate(['/login']);
      } else {
        alert('密碼修改失敗: ' + res.message);
      }
    });
  }
}

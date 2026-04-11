import { Component } from '@angular/core';
import { User } from '../../@interface/user';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../@service/api.service';
import { Router,} from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [FormsModule,],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  user: User = {
    email: '',
    name: '',
    phone: '',
    password: '',
    age: "",
  }

  constructor(private apiService: ApiService, private router: Router) {}

  backLogin(){
    this.router.navigate(['/login']);
  }

  registration(){
    this.apiService.postApi('/register', this.user).subscribe(res => {
      console.log(res);
      if(res.code == 200){
        alert('註冊成功！');
        this.router.navigate(['/login']);
      }else{
        alert('註冊失敗: ' + res.message);
      }
    });
  }
}

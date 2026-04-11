import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../@service/api.service';
import { Router, RouterLink } from '@angular/router';
import { DialogComponent } from '../../@components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  login = {
    email: '',
    password: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

  readonly dialog = inject(MatDialog);
  
  loginSubmit() {
    this.apiService.postApi('/login', this.login).subscribe({
      next: (res) => {
        if(res.code == 200){
          console.log(res);
          localStorage.setItem("userEmail", this.login.email);
          this.router.navigate(['/list']);
        }else{
          alert('登入失敗:' + res.message);
        }
      },
      error: (err) => {
        console.log(err);
      }
  });
  }

  openDialog() {
      let dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        height: '220px',
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          console.log(res);
        }
      });
    }
}

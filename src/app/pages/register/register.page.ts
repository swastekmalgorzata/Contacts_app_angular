import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  User: any={
  username: '',
  email: '',
  password:''
  }

  

  register(){
    if(this.User.username && this.User.email && this.User.password){
      this.router.navigateByUrl('/login')
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { ToastrManager } from 'ng6-toastr-notifications';
// import { LoginService } from '../Services/login.service';
import { interval } from 'rxjs';
// import { AuthService } from '../auth.service';


interface Category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userName1: string;
  passWord1: string;

  selectedValue: string;
  firstName: string;
  email: string;
  pwd: string;
  phNo: string;
  categories: Category[] = [
    { value: 'Doctor', viewValue: 'Doctor' },
    { value: 'Patient', viewValue: 'Patient' }
  ];
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;
  signUpFlag = false;
  loginFlag = false;

  progressbarValue = 0;
  curSec: number = 0;

  constructor(
  
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // private loginService: LoginService
  ) {
  }

  async ngOnInit() {
    this.signUpFlag = false;
    this.loginFlag = true;
    // this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/game';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  // async onSubmit() {
  //   console.log('submit clicked')
  //   this.router.navigateByUrl('home-page');
  //   this.loginInvalid = false;
  //   this.formSubmitAttempt = false;
  //   if (this.form.valid) {
  //     try {
  //       const username = this.form.get('username').value;
  //       const password = this.form.get('password').value;
  //       console.log(username);
  //       //await this.authService.login(username, password);
  //     } catch (err) {
  //       this.loginInvalid = true;
  //     }
  //   } else {
  //     this.formSubmitAttempt = true;
  //   }
  // }

  onSignUp() {
    console.log('sign up clicked')
    this.signUpFlag = true;
    this.loginFlag = false;
    this.userName1 = '';
    this.passWord1 = '';
  }


  onLogin() {
    console.log('loginUp Works!!')
    this.signUpFlag = false;
    this.loginFlag = true;
    this.email = '';
    this.pwd = '';
    this.phNo = '';
    this.firstName = '';
  }


  onRegister() {
    if (this.firstName === '' || this.email === '' || this.pwd === '' || this.phNo === '' || this.selectedValue === undefined) {
 
    }
    else {
      const registerBody = {
        "userName": this.firstName,
        "password": this.pwd,
        "email": this.email,
        "role": this.selectedValue,
        "phoneNumber": this.phNo
      };
      // this.loginService.registerPerson(registerBody).subscribe(
      //   (data: any) => {
      //     console.log(data);
      //     this.toastr.successToastr('User Registered successfully...,Redirecting to the Login Screen in few Seconds', 'Success!', {
      //       position: 'bottom-full-width', animate: 'slideFromRight'
      //     });

      //   },
      //   err => {
      //     this.toastr.errorToastr(err.message, 'Error!', {
      //       position: 'bottom-full-width', animate: 'slideFromBottom'
      //     });

      //   });

      setTimeout(() => {
        this.signUpFlag = false;
        this.loginFlag = true;
      }, 3500);
    }
  }

  onSignIn1() {

    this.router.navigateByUrl('home-page');
    console.log(this.userName1)
    if (this.userName1 === '' || this.passWord1 === '' || this.userName1 === undefined || this.passWord1 === undefined) {
   
    }

    else {
      const loginBody = {
        "userName": this.userName1,
        "password": this.passWord1

      };
      // this.loginService.loginPerson(loginBody).subscribe(
      //   (data: any) => {
      //     console.log(data);
      //     localStorage.setItem('email', data.user.email);
      //     localStorage.setItem('role', data.user.role);
      //     localStorage.setItem('userName', data.user.userName);


      //     this.toastr.successToastr('Successful Login', 'Success!', {
      //       position: 'bottom-full-width', animate: 'slideFromRight'
      //     });

      //     setTimeout(() => {
      //      
      //     }, 3000);


      //   },
      //   err => {
      //     this.toastr.errorToastr(err.message, 'Error!', {
      //       position: 'bottom-full-width', animate: 'slideFromBottom'
      //     });

      //   });



    }

  }

  startTimer(seconds: number) {
    const time = seconds;
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 0 + sec * 100 / seconds;
      this.curSec = sec;

      console.log(this.progressbarValue)
      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
    });
  }


  

}


import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router, private location: Location) { }

  model = {
    username: '',
    password: ''
  };

  serverErrorMessages: string;

  ngOnInit() {
    if (this.apiService.logged()) {
      this.router.navigateByUrl('/stations');
    }
  }

  onSubmit(form: NgForm) {
    this.apiService.login(form.value).subscribe(
      res => {
       // tslint:disable-next-line: no-string-literal
       this.apiService.setToken(res['token']);
       this.location.back();
      },
      err => {
            this.serverErrorMessages = 'You entered a wrong username and password combination.';
      }
    );
  }

}

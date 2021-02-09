import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  returnUrl: any;

  constructor(public apiService: ApiService, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.apiService.deleteToken();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd));
  }

}

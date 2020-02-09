import { Component, OnInit } from '@angular/core';
import { MsalService } from '../services/msal.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private msal: MsalService) { }

  ngOnInit() {
  }

  onSignIn() {
    this.msal.login();
  }

  onSignUp() {
    this.msal.signup();
  }
}

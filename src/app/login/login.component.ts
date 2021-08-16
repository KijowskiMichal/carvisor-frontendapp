import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PageService} from "../services/page.service";
import {AuthorizationService} from "../services/authorization.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private pageService: PageService, private authorizationService: AuthorizationService,
              private router:Router) { }

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (value.logged) {
        this.router.navigate(['./users']);
      }
    });
  }

  signIn(login:any, password:any, user:any, key:any)
  {
    this.authorizationService.signIn(login, password).subscribe(
        () => {
        },
        () => {
          (user as HTMLElement).style.color = '#ef476f';
          (key as HTMLElement).style.color = '#ef476f';
          (login as HTMLElement).style.border = 'solid #ef476f 1px';
          login.value = '';
          (login as HTMLElement).setAttribute('placeholder', 'Błędne dane logowania!');
          (password as HTMLElement).style.border = 'solid #ef476f 1px';
          password.value = '';
          (password as HTMLElement).setAttribute('placeholder', 'Błędne dane logowania!');
        },
        () => {
          this.pageService.getNewLoginStatus().subscribe(value => {
            this.router.navigate(['./users']);
          })
        });
  }

}

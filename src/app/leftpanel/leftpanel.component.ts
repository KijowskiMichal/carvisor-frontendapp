import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthorizationService} from "../services/authorization.service";
import {PageService} from "../services/page.service";

@Component({
  selector: 'app-leftpanel',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss']
})
export class LeftpanelComponent {

  constructor(private pageService: PageService, private authorizationService: AuthorizationService, private router: Router) {
  }

  logout() {
    this.authorizationService.logout().subscribe(
      data => {
      },
      () => {
      },
      () => {
        this.pageService.getNewLoginStatus().subscribe(() => {
          this.router.navigateByUrl('/');
        })
      }
    );
  }
}

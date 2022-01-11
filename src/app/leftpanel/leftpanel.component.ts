import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthorizationService} from "../services/authorization.service";
import {PageService} from "../services/page.service";

@Component({
  selector: 'app-leftpanel',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss']
})
export class LeftpanelComponent implements OnInit {

  options: MenuOption[] = [
    {
      title: "Podsumowanie",
      link: "/summary",
      rbac: ['STANDARD_USER', 'MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-address-card",
    },
    {
      title: "Moja flota",
      link: "/users",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-user",
    },
    {
      title: "Moje pojazdy",
      link: "/vehicles",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-car",
    },
    {
      title: "Strefy",
      link: "/zones",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-location",
    },
    {
      title: "Mapa",
      link: "/map",
      rbac: ['STANDARD_USER', 'MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-map-marker-alt",
    },
    {
      title: "Powiadomienia",
      link: "/notifications",
      rbac: ['STANDARD_USER', 'MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-bell",
    },
    {
      title: "Awarie i naprawy",
      link: "/warnings",
      rbac: ['STANDARD_USER', 'MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-exclamation-triangle",
    },
    {
      title: "Punkty ekojazdy",
      link: "/ecodrive",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-trophy",
    },
    {
      title: "Bezpieczeństwo",
      link: "/safety",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-shield-check",
    },
    {
      title: "Raporty",
      link: "/reports",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-chart-bar",
    },
    {
      title: "Kalendarz",
      link: "/calendar",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-fw fa-calendar-alt",
    },
  ]

  bottomMenu: Omit<MenuOption, "title">[] = [
    {
      link: "/settings",
      rbac: ['MODERATOR', 'ADMINISTRATOR'],
      classes: "far fa-cogs",
    },
  ]

  constructor(public pageService: PageService, private authorizationService: AuthorizationService, private router: Router) {
  }

  ngOnInit() {
    if (!this.pageService.loginStatus) {
      this.pageService.getNewLoginStatus().subscribe(() => {});
    }
  }

  logout() {
    this.authorizationService.logout().subscribe(
      () => {
      },
      () => {
      },
      () => {
        this.pageService.loginStatus = undefined;
        this.router.navigate(['/']);
      }
    );
  }
}

interface MenuOption {
  title: string;
  link: string;
  rbac: string[];
  classes: string;
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ListOfUser, UserService} from "../services/user.service";
import {PageService} from "../services/page.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private userService: UserService, private pageService: PageService, private router: Router) { }
  listOfUser!: ListOfUser;
  page!: number;
  pageMax!: number;
  pageSize = 6;
  complete!: boolean;
  addUserPopup: boolean;

  ngOnInit(): void
  {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.list(1, '$');
  }

  public list(page: number, regex: string): void
  {
    this.complete = false;
    if (regex === '') {
      regex = '$';
    }
    if (page >= 1) {
      this.userService.getListOfUsers(page, this.pageSize, regex).subscribe(value => {
        if (page <= value.pageMax)
        {
          this.listOfUser = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      },
      () => {
        this.complete = true;
      },
      () => {
        this.complete = true;
      });
    }
  }

}



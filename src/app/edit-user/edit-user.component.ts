import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

interface UserInfo {
  userPrivileges: number;
  name: string;
  telephone: number;
  image: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  private routeSub: Subscription;
  private id:number;
  userInfo: UserInfo;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  popupOk = false;
  popupFail = false;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.http.get<UserInfo>('/API/users/getUserData/' + this.id + '/').subscribe(value => {
        this.userInfo = value;
      });
    });
  }

  sendData(name:string, phone:string) {
    this.http.post('/API/users/changeUserData/' + this.id + '/',
      {
        "name": name,
        "telephone": phone
      })
      .subscribe(
        (val) => {
        },
        response => {
          this.popupFail = true;
        },
        () => {
          this.popupOk = true;
        });
  }
}

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { StatusService } from "./status.service";
import jwt_decode from "jwt-decode";
import { from } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    public saveStatus: StatusService,
    private router: Router,
    public http: HttpClient
  ) {}

  token =
    "eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0=.eyJ1c2VyX2lkIjoyMiwiaW5zdGFuY2UiOiJ0ZXN0YmVkIiwiZXhwIjoxNjU1NzExNzYwfQ==.8gCv+vf8SuRPSoGZ5mKP3k2LdcfwGnYInhn2HjUTh7w=";
  decoded: any = jwt_decode(this.token);

  ngOnInit(): void {
    // this.getToken();
    // this.getData();
    // this.getConfiguration();
  }

  getToken(): void {
    this.http
      .get("http://localhost/Token?origin=moldavia", {
        headers: new HttpHeaders({
          refer: "https://www.vodafone.it",
        }),
      })
      .subscribe((res) => {
        console.log(res);
        // this.router.navigate([
        //   this.saveStatus.response.configuration.modules[2].moduleName,
        // ]);
      });
  }

  getData(): Observable<any> {
    return from(
      fetch(
        "https://api.gsped.it/token?origin=moldavia", // the url you are trying to access
        {
          headers: {
            "content-type": "application/json",
            refer: "https://www.vodafone.it",
          },
          method: "GET", // GET, POST, PUT, DELETE
          mode: "no-cors", // the most important option
        }
      )
    );
  }

  /* getConfiguration() {
    this.http
      .get(
        "/api/" +
          this.decoded.instance +
          "/ResourceConfiguration?resource=" +
          "resi",
        { headers: { "X-API-KEY": this.token } }
      )
      .subscribe((res) => {
      });
  } */
}

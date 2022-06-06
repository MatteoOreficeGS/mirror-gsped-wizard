import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { StatusService } from "./status.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    public saveStatus: StatusService,
    private router: Router,
    public http: HttpClient
  ) {}

  token =
    "eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0=.eyJ1c2VyX2lkIjoyMiwiaW5zdGFuY2UiOiJ0ZXN0YmVkIiwiZXhwIjoxNjU0NTEwODAwfQ==.jE1BCGi5GCVqLPo2mqCxKNxlXKJrm9kJCA/7DVdcxAQ=";
  decoded: any = jwt_decode(this.token);

  ngOnInit(): void {
    this.getConfiguration();
  }

  getToken(): void {
    this.http
      .get("https://api.gsped.it/token?origin=moldavia", {
        headers: new HttpHeaders({
          "content-type": "application/json",
          Refer: "https://www.vodafone.it",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
        }),
      })
      .subscribe((res) => {
        console.log(res);
        // this.router.navigate([
        //   this.saveStatus.response.configuration.modules[2].moduleName,
        // ]);
      });
  }

  getConfiguration() {
    this.http
      .get(
        "https://api.gsped.it/" +
          this.decoded.instance +
          "/ResourceConfiguration?resource=" +
          "resi",
        { headers: { "X-API-KEY": this.token } }
      )
      .subscribe((res) => {
      });
  }
}

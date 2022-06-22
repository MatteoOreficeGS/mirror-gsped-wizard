import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
    public status: StatusService,
    private route: ActivatedRoute,
    public http: HttpClient,
    public router: Router
  ) {}

  token =
    "eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0=.eyJ1c2VyX2lkIjoyMiwiaW5zdGFuY2UiOiJ0ZXN0YmVkIiwiZXhwIjoxNjU1NzExNzYwfQ==.8gCv+vf8SuRPSoGZ5mKP3k2LdcfwGnYInhn2HjUTh7w=";
  decoded: any = jwt_decode(this.token);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.lang) {
        this.status.setTranslations(params.lang, "resi");
      } else {
        // this.router.navigate(["/Sender"], {queryParams: {lang: "it_IT"}})
      }
    });
    this.status.setConfiguration();

    // this.getToken();
    // this.getData();
    // this.getConfiguration();
    // this.getTranslations("it_IT", "resi").subscribe(res => {this.status.translations = res});
    // this.status.setTranslations()
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
        //   this.status.response.configuration.modules[2].moduleName,
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
}

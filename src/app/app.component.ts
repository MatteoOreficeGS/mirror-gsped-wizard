import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { StatusService } from "./status.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  @HostListener("window:beforeunload", ["$event"])
  treno($event: { returnValue: string }) {
    if (true) $event.returnValue = "Your data will be lost!";
  }

  constructor(
    public status: StatusService,
    private route: ActivatedRoute,
    public http: HttpClient,
    public router: Router
  ) {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      event.returnValue = "Unsaved modifications";
      return event;
    });
    if (window.location.pathname === "/" || true) {
      this.route.queryParams.subscribe((params: any) => {
        if ((params.lang, params.origin)) {
          this.queryParams = params;
          this.getToken(params.origin).subscribe(
            (res: any) => {
              console.log(res);
              this.token = res.token;
              this.decoded = jwt_decode(res.token);
              // this.status.decodeToken();
              sessionStorage.setItem("token", res.token);
              this.status.decoded = this.decoded;
              this.status
                .setConfiguration()
                .subscribe((res: any) =>
                  sessionStorage.setItem("configuation", res.configuration)
                );
              this.status.setTranslations("it_IT", "resi");
              this.router.navigate(["/sender"], {
                queryParams: { lang: "it_IT" },
              });
            },
            (error: any) => {
              alert(JSON.stringify(error));
            }
          );
        } else {
          console.log("Errore parametri");
        }
      });
    }
  }
  /* constructor(public status: StatusService) {
    if (!this.token) {
      chiamo
    }
  } */
  ngOnInit(): void {
    console.log();
    let token = sessionStorage.getItem("token");
    console.log("token", token);

    this.status.setConfiguration();

    // this.status.setTranslations("it_IT", "resi");
  }

  queryParams: any;
  token: string = "";
  decoded: any;

  getToken(origin: any): Observable<any> {
    return this.http.get("https://api.gsped.it/Token?origin=" + origin);
  }

  doSomething() {
    confirm("vuoi vermantre uscire?");
  }
}

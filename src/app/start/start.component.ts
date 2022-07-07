import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { StatusService } from "../status.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
})
export class StartComponent {
  queryParams: any;
  token: string = "";
  decoded: any;

  constructor(
    public status: StatusService,
    private route: ActivatedRoute,
    public http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if ((params.lang, params.origin)) {
        this.queryParams = params;
        this.getToken(params.origin, "https://www.vodafone.it").subscribe(
          (res: any) => {
            this.token = res.token;
            this.decoded = jwt_decode(res.token);
            sessionStorage.setItem("token", this.token);
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
          (error:any) => {
            alert(JSON.stringify(error.error.error))
          }
        );
      } else {
        console.log("Errore parametri");
      }
    });
  }

  getToken(origin: any, refer: any): Observable<any> {
    return this.http.get("https://api.gsped.it/Token?origin=" + origin, {
      headers: new HttpHeaders({
        refer: refer,
      }),
    });
  }
}

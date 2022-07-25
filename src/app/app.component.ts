import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, mergeMap, Observable } from "rxjs";
import { StatusService } from "./status.service";
import jwt_decode from "jwt-decode";
import { StoreService } from "./store.service";
import { environment } from "./enviroment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  /* @HostListener("window:beforeunload", ["$event"])
  treno($event: { returnValue: string }) {
    if (true) $event.returnValue = "Your data will be lost!";
  } */

  constructor(
    public status: StatusService,
    public store: StoreService,
    private route: ActivatedRoute,
    public http: HttpClient,
    public router: Router
  ) {
    /*     window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      return event;
    }); */
    this.route.queryParams.subscribe((params: any) => {
      if (params.origin) {
        this.getToken(params.origin).subscribe(
          (res: any) => {
            store.origin = params.origin;
            store.token = res.token;
            store.decodedToken = jwt_decode(res.token);
            forkJoin(
              this.getConfiguration(res.token, jwt_decode(res.token)),
              this.getTranslations(
                params.lang ? params.lang : "it_IT",
                res.token,
                jwt_decode(res.token)
              )
            ).subscribe((res: any) => {
              this.store.configuration = res[0].configuration;
              const modules = res[0].configuration.modules.map(
                (module: { moduleName: string }) => {
                  return module.moduleName;
                }
              );
              console.log(modules[0]);
              this.store.modules = modules;
              this.store.translations = res[1];
              this.router.navigate(["/" + modules[0]], {
                // this.router.navigate(["/" + "fatturaDHL"], {
                queryParams: { lang: params.lang ? params.lang : "it_IT" },
              });
            });
          },
          (error: any) => {
            this.router.navigate(["/error-page"], {
              queryParams: { lang: params.lang ? params.lang : "it_IT" },
            });
          }
        );
      } else if (params.uuid /* && router.url */) {
        this.http
          .get(
            environment.API_URL +
              "testbed" + //TODO da cambiare col token
              "/resoFacile/payment/display/monetaweb?uuid=" +
              params.uuid
          )
          .subscribe((res: any) => {
            this.store.token = res.session.token;
            this.store.outwardShipmentID = res.session.outwardShipmentID;
            this.store.returnShipmentID = res.session.returnShipmentID;
            this.router.navigate(["/awb-printing/monetaweb"], {
              // this.router.navigate(["/" + "fatturaDHL"], {
              queryParams: { lang: params.lang ? params.lang : "it_IT" },
              queryParamsHandling: "merge",
            });
          });
      }
      /* this.http
          .get(
            environment.API_URL +
              "testbed" + //TODO da cambiare col token
              "/resoFacile/payment/display/monetaweb?uuid=" +
              params.uuid
          )
          .subscribe((res: any) => {
            store.token = res.token;
            store.decodedToken = jwt_decode(res.token);
            forkJoin(
              this.getConfiguration(res.token, jwt_decode(res.token)),
              this.getTranslations("it_IT", res.token, jwt_decode(res.token))
            ).subscribe((res: any) => {
              this.store.configuration = res[0].configuration;
              const modules = res[0].configuration.modules.map(
                (module: { moduleName: string }) => {
                  return module.moduleName;
                }
              );
              console.log(modules[0]);
              this.store.modules = modules;
              this.store.translations = res[1];
              // this.router.navigate(["/" + modules[0]], {
              //   queryParams: { lang: "it_IT" },
              // });
            });
          }); */
    });
  }

  getToken(origin: any): Observable<any> {
    return this.http.get(environment.API_URL + "Token?origin=" + origin);
  }

  getConfiguration(token: any, decoded: any, resource = environment.FLOW) {
    return this.http.get(
      environment.API_URL +
        decoded.instance +
        "/ResourceConfiguration?resource=" +
        resource,
      { headers: { "X-API-KEY": token } }
    );
  }

  getTranslations(
    lang: string,
    token: any,
    decoded: any,
    resource = environment.FLOW
  ): Observable<any> {
    const headers = { "x-api-key": token };
    return this.http.get(
      environment.API_URL +
        decoded.instance +
        "/Translations?" +
        "lang=" +
        lang +
        "&resource=" +
        resource,
      { headers: headers }
    );
  }
}

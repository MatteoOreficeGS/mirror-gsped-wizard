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
      // alert(JSON.stringify(params, null, 4));
      if (params.origin && !params.uuid) {
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
              let modules = res[0].configuration.modules.map((module: any) => {
                if (module.moduleConfig.hidden) {
                  if (module.moduleName === "sender") {
                    this.store.sender = module.moduleConfig.data;
                  }
                  if (module.moduleName === "recipient") {
                    this.store.recipient = module.moduleConfig.data;
                  }
                  return null;
                } else {
                  return {
                    module: module.moduleName,
                    label: module.moduleConfig.label,
                  };
                }
              });
              modules = modules.filter((module: any) => module);
              this.store.hasPayment =
                modules.filter((element: any) => element.module === "payment")
                  .length > 0;
              console.log(this.store.hasPayment);
              this.store.modules = modules;
              this.store.translations = res[1];
              this.router.navigate(["/" + modules[0].module], {
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
              "testbed/" + //TODO da verificare
              "resoFacile/payment/display/monetaweb?uuid=" +
              params.uuid
          )
          .subscribe((resDisplay: any) => {
            console.log("session", resDisplay.session);
            this.store.displayPayment = resDisplay.monetaweb;
            this.store.outwardShipment.id = resDisplay.session.outwardShipmentID;
            this.store.returnShipment.id = resDisplay.session.returnShipmentID;
            this.getToken(resDisplay.session.origin).subscribe(
              (resToken: any) => {
                store.origin = resDisplay.session.origin;
                store.token = resToken.token;
                store.decodedToken = jwt_decode(resToken.token);
                forkJoin(
                  this.getConfiguration(
                    resToken.token,
                    jwt_decode(resToken.token)
                  ),
                  this.getTranslations(
                    params.lang ? params.lang : "it_IT",
                    resToken.token,
                    jwt_decode(resToken.token)
                  )
                ).subscribe((res: any) => {
                  console.log("all response", res);
                  this.store.configuration = res[0].configuration;
                  let modules = res[0].configuration.modules.map(
                    (module: any) => {
                      if (module.moduleConfig.hidden) {
                        if (module.moduleName === "sender") {
                          this.store.sender = module.moduleConfig.data;
                        }
                        if (module.moduleName === "recipient") {
                          this.store.recipient = module.moduleConfig.data;
                        }
                        return null;
                      } else {
                        return {
                          module: module.moduleName,
                          label: module.moduleConfig.label,
                        };
                      }
                    }
                  );
                  modules = modules.filter((module: any) => module);
                  this.store.hasPayment =
                    modules.filter(
                      (element: any) => element.module === "payment"
                    ).length > 0;
                  this.store.modules = modules;
                  this.store.translations = res[1];
                  this.store.currentStep = modules.length;
                  console.log("navigo a awb-printing");
                  this.store.isLastModule = true;
                  this.router.navigate(["/" + modules[modules.length - 1].module], {
                    // this.router.navigate(["/" + "fatturaDHL"], {
                    queryParams: {
                      lang: params.lang ? params.lang : "it_IT",
                      uuid: params.uuid,
                    },
                  });
                });
              },
              (error: any) => {
                this.router.navigate(["/error-page"], {
                  queryParams: { lang: params.lang ? params.lang : "it_IT" },
                });
              }
            );
          });
      }
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

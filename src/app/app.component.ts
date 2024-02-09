import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import jwt_decode from "jwt-decode";
import { Observable, forkJoin } from "rxjs";
import { environment } from "./enviroment";
import { StatusService } from "./status.service";
import { StoreService } from "./store.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  constructor(
    public status: StatusService,
    public store: StoreService,
    private route: ActivatedRoute,
    public http: HttpClient,
    public router: Router
  ) {
    // block history navigation
    history.pushState(null, "", location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    this.route.queryParams.subscribe((params: any) => {
      if (params.origin && !params.uuid && !params.action) {
        this.getToken(params.origin).subscribe(
          (res: any) => {
            store.origin = params.origin;
            sessionStorage.setItem("origin", params.origin);
            store.token = res.token;
            store.decodedToken = jwt_decode(res.token);
            forkJoin(
              this.getConfiguration(),
              this.status.getTranslations(params.lang || "it_IT"),
              this.status.getCountries()
            ).subscribe((res: any) => {
              this.store.configuration = res[0].configuration;
              if (!this.store.configuration.mainColor) {
                this.store.configuration.mainColor = "FFCC35";
              }
              this.store.configuration.fadedColor =
                "#" +
                this.fadeColor("#" + this.store.configuration.mainColor, 150);
              this.isSenderPrefilled();
              this.isRecipientVisible();
              let modules = this.store.configuration.modules.map(
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

              const modulesNames = modules.map((module: any) => {
                return module.module;
              });
              this.store.hasPayment = modulesNames.indexOf("payment") !== -1;
              this.store.hasShipmentData =
                modulesNames.indexOf("shipment-data") !== -1;
              this.store.hasInvoice = modulesNames.indexOf("fatturaDHL") !== -1;
              this.store.stepForShipment =
                modulesNames.indexOf("select-courier");
              if (this.store.stepForShipment === -1) {
                if (this.store.hasPayment) {
                  this.store.stepForShipment =
                    modulesNames.indexOf("payment") - 1;
                } else {
                  this.store.stepForShipment =
                    modulesNames.indexOf("awb-printing") - 1;
                }
              }
              this.store.stepForShipment += 1;
              this.store.modules = modules;
              this.store.translations = res[1];
              this.store.countries = res[2];
              this.router.navigate(["/" + modules[0].module], {
                queryParams: { lang: params.lang || "it_IT" },
              });
            });
          },
          (error: any) => {
            this.router.navigate(["/error-page"], {
              queryParams: { lang: params.lang || "it_IT" },
            });
          }
        );
      } else if (
        params.uuid &&
        params.instance &&
        router.url.includes("monetaweb") &&
        router.url.includes("display") &&
        !params.action
      ) {
        this.store.providerPayment = "monetaweb";
        this.http
          .get(
            environment.API_URL +
              params.instance +
              "/resoFacile/payment/display/" +
              this.store.providerPayment +
              "?uuid=" +
              params.uuid
          )
          .subscribe((resDisplay: any) => {
            this.store.displayPayment = resDisplay[this.store.providerPayment];
            this.store.beforePaymentSession = resDisplay.session;
            this.store.outwardShipment.id =
              resDisplay.session.outwardShipmentID;
            this.store.returnShipment.id = resDisplay.session.returnShipmentID;
            this.getToken(resDisplay.session.origin).subscribe(
              (resToken: any) => {
                store.origin = resDisplay.session.origin;
                store.token = resToken.token;
                store.decodedToken = jwt_decode(resToken.token);
                forkJoin(
                  this.getConfiguration(),
                  this.status.getTranslations(
                    this.store.beforePaymentSession.language ||
                      params.lang ||
                      "it_IT"
                  ),
                  this.status.getCountries()
                ).subscribe((res: any) => {
                  this.store.configuration = res[0].configuration;
                  if (!this.store.configuration.mainColor) {
                    this.store.configuration.mainColor = "FFCC35";
                  }
                  this.store.configuration.fadedColor =
                    "#" +
                    this.fadeColor(
                      "#" + this.store.configuration.mainColor,
                      150
                    );
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
                  this.store.countries = res[2];
                  this.store.currentStep = modules.length;
                  this.store.isLastModule = true;
                  this.router.navigate(
                    ["/" + modules[modules.length - 1].module],
                    {
                      queryParams: {
                        lang:
                          this.store.beforePaymentSession.language || "it_IT",
                        uuid: params.uuid,
                      },
                    }
                  );
                });
              },
              (error: any) => {
                this.router.navigate(["/error-page"], {
                  queryParams: { lang: params.lang || "it_IT" },
                });
              }
            );
          });
      } else if (
        params.uuid &&
        params.instance &&
        router.url.includes("monetaweb") &&
        router.url.includes("recovery") &&
        !params.action
      ) {
        this.http
          .get(
            environment.API_URL +
              params.instance +
              "/resoFacile/payment/recovery/monetaweb?uuid=" +
              params.uuid
          )
          .subscribe({
            next: (resRecovery: any) => {
              this.store.displayPayment = resRecovery.monetaweb;
              this.store.beforePaymentSession = resRecovery.session;
              this.store.outwardShipment.id =
                resRecovery.session.outwardShipmentID;
              this.store.returnShipment.id =
                resRecovery.session.returnShipmentID;
              this.getToken(resRecovery.session.origin).subscribe(
                (resToken: any) => {
                  store.origin = resRecovery.session.origin;
                  store.token = resToken.token;
                  store.decodedToken = jwt_decode(resToken.token);
                  forkJoin(
                    this.getConfiguration(),
                    this.status.getTranslations(
                      this.store.beforePaymentSession.language ||
                        params.lang ||
                        "it_IT"
                    ),
                    this.status.getCountries()
                  ).subscribe((res: any) => {
                    this.store.configuration = res[0].configuration;
                    if (!this.store.configuration.mainColor) {
                      this.store.configuration.mainColor = "FFCC35";
                    }
                    this.store.configuration.fadedColor =
                      "#" +
                      this.fadeColor(
                        "#" + this.store.configuration.mainColor,
                        150
                      );
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
                    this.store.countries = res[2];
                    this.store.currentStep = modules.length;
                    this.store.isLastModule = true;
                    this.router.navigate(
                      ["/" + modules[modules.length - 1].module],
                      {
                        queryParams: {
                          lang:
                            this.store.beforePaymentSession.language || "it_IT",
                          uuid: params.uuid,
                        },
                      }
                    );
                  });
                },
                (error: any) => {
                  this.router.navigate(["/error-page"], {
                    queryParams: { lang: params.lang || "it_IT" },
                  });
                }
              );
            },
            error: (resRecovery) => {
              this.store.displayPayment = resRecovery.error.monetaweb.length
                ? resRecovery.error.monetaweb
                : {};
              this.store.displayPayment.status = "failed";
              this.store.beforePaymentSession = resRecovery.error.session;
              this.store.outwardShipment.id =
                resRecovery.error.session.outwardShipmentID;
              this.store.returnShipment.id =
                resRecovery.error.session.returnShipmentID;
              this.getToken(resRecovery.error.session.origin).subscribe(
                (resToken: any) => {
                  store.origin = resRecovery.error.session.origin;
                  store.token = resToken.token;
                  store.decodedToken = jwt_decode(resToken.token);
                  forkJoin(
                    this.getConfiguration(),
                    this.status.getTranslations(
                      this.store.beforePaymentSession.language ||
                        params.lang ||
                        "it_IT"
                    ),
                    this.status.getCountries()
                  ).subscribe((res: any) => {
                    this.store.configuration = res[0].configuration;
                    if (!this.store.configuration.mainColor) {
                      this.store.configuration.mainColor = "FFCC35";
                    }
                    this.store.configuration.fadedColor =
                      "#" +
                      this.fadeColor(
                        "#" + this.store.configuration.mainColor,
                        150
                      );
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
                    this.store.countries = res[2];
                    this.store.currentStep = modules.length;
                    this.store.isLastModule = true;
                    this.router.navigate(
                      ["/" + modules[modules.length - 1].module],
                      {
                        queryParams: {
                          lang:
                            this.store.beforePaymentSession.language || "it_IT",
                          uuid: params.uuid,
                        },
                      }
                    );
                  });
                },
                (error: any) => {
                  this.router.navigate(["/error-page"], {
                    queryParams: { lang: params.lang || "it_IT" },
                  });
                }
              );
            },
          });
      } else if (
        params.uuid &&
        params.instance &&
        router.url.includes("ingenicoconnect") &&
        router.url.includes("display") &&
        !params.action
      ) {
        const regex: any = /\/.+\/(.+)\?/gm;
        this.store.providerPayment = regex.exec(router.url)[1];
        this.store.providerPayment = "monetaweb"; //TODO: rimuovere

        this.http
          .get(
            `${environment.API_URL}${params.instance}/resoFacile/payment/display/${this.store.providerPayment}?uuid=${params.uuid}`
          )
          .subscribe((resDisplay: any) => {
            this.store.providerPayment = "ingenicoconnect"; //TODO: rimuovere

            this.store.displayPayment = resDisplay[this.store.providerPayment];

            if (Object.keys(resDisplay.session).length === 0) {
              return;
            }
            this.store.beforePaymentSession = resDisplay.session;
            this.store.outwardShipment.id =
              resDisplay.session.outwardShipmentID;
            this.store.returnShipment.id = resDisplay.session.returnShipmentID;
            this.getToken(resDisplay.session.origin).subscribe(
              (resToken: any) => {
                store.origin = resDisplay.session.origin;
                store.token = resToken.token;
                store.decodedToken = jwt_decode(resToken.token);
                forkJoin(
                  this.getConfiguration(),
                  this.status.getTranslations(
                    this.store.beforePaymentSession.language ||
                      params.lang ||
                      "it_IT"
                  ),
                  this.status.getCountries()
                ).subscribe((res: any) => {
                  this.store.configuration = res[0].configuration;
                  if (!this.store.configuration.mainColor) {
                    this.store.configuration.mainColor = "FFCC35";
                  }
                  this.store.configuration.fadedColor =
                    "#" +
                    this.fadeColor(
                      "#" + this.store.configuration.mainColor,
                      150
                    );
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
                  this.store.countries = res[2];
                  this.store.currentStep = modules.length;
                  this.store.isLastModule = true;

                  //#region separate payment
                  if (
                    this.store.configuration["separate payment"] &&
                    resDisplay.status === "completed"
                  ) {
                    if (
                      this.store.beforePaymentSession
                        .isOutwardPaymentPerformed &&
                      !this.store.beforePaymentSession.isReturnPaymentPerformed
                    ) {
                      this.store.outwardUuid = params.uuid;
                      this.store.isReturnPayment = true;
                      this.store.currentStep = modules.length - 1;
                      this.router.navigate(
                        ["/" + modules[modules.length - 2].module],
                        {
                          queryParams: {
                            lang:
                              this.store.beforePaymentSession.language ||
                              "it_IT",
                          },
                        }
                      );
                    } else if (
                      this.store.beforePaymentSession.isReturnPaymentPerformed
                    ) {
                      this.router.navigate(
                        ["/" + modules[modules.length - 1].module],
                        {
                          queryParams: {
                            lang:
                              this.store.beforePaymentSession.language ||
                              "it_IT",
                            "outward-uuid":
                              this.store.beforePaymentSession.outwardUuid,
                            "return-uuid": params.uuid,
                          },
                        }
                      );
                    }
                  }
                  //#endregion
                  else {
                    this.router.navigate(
                      ["/" + modules[modules.length - 1].module],
                      {
                        queryParams: {
                          lang:
                            this.store.beforePaymentSession.language || "it_IT",
                          uuid: params.uuid,
                        },
                      }
                    );
                  }
                });
              },
              (error: any) => {
                this.router.navigate(["/error-page"], {
                  queryParams: { lang: params.lang || "it_IT" },
                });
              }
            );
          });
      } else if (
        params.origin &&
        params.action &&
        params.action === "retrievedoc"
      ) {
        this.getToken(params.origin).subscribe((res: any) => {
          store.origin = params.origin;
          sessionStorage.setItem("origin", params.origin);
          sessionStorage.setItem("action", params.action);
          this.store.action = params.action;
          store.token = res.token;
          store.decodedToken = jwt_decode(res.token);
          forkJoin(
            this.getConfiguration(),
            this.status.getTranslations(
              params.lang || "it_IT",
              this.store.action
            ),
            this.status.getTranslations(params.lang || "it_IT")
          ).subscribe((res: any) => {
            this.store.configuration = res[0].configuration;
            if (!this.store.configuration.mainColor) {
              this.store.configuration.mainColor = "FFCC35";
            }
            this.store.configuration.fadedColor =
              "#" +
              this.fadeColor("#" + this.store.configuration.mainColor, 150);
            this.store.translations = { ...res[1], ...res[2] };
            this.router.navigate(["/document-recovery"], {
              queryParams: { lang: params.lang || "it_IT" },
            });
          });
        });
      }
    });
  }

  getToken(origin: any): Observable<any> {
    return this.http.get(environment.API_URL + "Token?origin=" + origin);
  }

  getConfiguration(resource = environment.FLOW) {
    const decoded: any = this.store.decodedToken;
    return this.http.get(
      environment.API_URL +
        decoded.instance +
        "/ResourceConfiguration?resource=" +
        resource,
      { headers: { "X-API-KEY": this.store.token } }
    );
  }

  isRecipientVisible() {
    let result = true;
    this.store.configuration.modules.forEach(
      (element: {
        moduleName: string;
        moduleConfig: {
          hidden: boolean;
          data: { sender_name: string; sender_addr: string };
        };
      }) => {
        if (element.moduleName === "sender") {
          if (element.moduleConfig.hidden) {
            result = false;
          }
        }
      }
    );
    this.store.noteSenderOnSender = result;
  }
  isSenderPrefilled() {
    let result = false;
    this.store.configuration.modules.forEach(
      (element: {
        moduleName: string;
        moduleConfig: { data: { sender_name: string; sender_addr: string } };
      }) => {
        if (element.moduleName === "sender") {
          if (
            element.moduleConfig.data.sender_name &&
            element.moduleConfig.data.sender_addr
          ) {
            result = true;
          }
        }
      }
    );
    this.store.isSenderPrefilled = result;
  }

  fadeColor(hexColor: string, delta: number) {
    if (hexColor.length === 4) {
      hexColor = this.lenghtenHexCode(hexColor);
    }
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const clampedR = Math.max(0, Math.min(255, r + delta));
    const clampedG = Math.max(0, Math.min(255, g + delta));
    const clampedB = Math.max(0, Math.min(255, b + delta));

    return (clampedR * 0x10000 + clampedG * 0x100 + clampedB).toString(16);
  }

  lenghtenHexCode(hexCode: string) {
    const r = hexCode[1] + hexCode[1];
    const g = hexCode[2] + hexCode[2];
    const b = hexCode[3] + hexCode[3];
    return `#${r}${g}${b}`;
  }
}

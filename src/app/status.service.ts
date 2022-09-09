import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Router } from "@angular/router";
import { StoreService } from "./store.service";
import { environment } from "./enviroment";
import { ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  constructor(
    public http: HttpClient,
    private router: Router,
    private store: StoreService
  ) {}

  getTranslations(lang: string, resource = environment.FLOW): Observable<any> {
    const headers = { "x-api-key": this.store.token };
    const decoded: any = this.store.decodedToken;
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

  getCountries() {
    const headers = { "x-api-key": this.store.token };
    const decoded: any = this.store.decodedToken;
    return this.http.get(
      environment.API_URL + decoded.instance + "/Countries",
      { headers: headers }
    );
  }

  pickupAvailability(corriere: any) {
    const decoded: any = this.store.decodedToken;
    const date = new Date();
    const headers = { "x-api-key": this.store.token };
    const body = {
      ...this.store.sender,
      pickup_date: date.getHours() + ":" + (date.getMinutes() + 1),
      corriere: corriere,
      client_id: this.store.configuration.client_id,
    };
    return this.http.post(
      environment.API_URL + decoded.instance + "/PickupAvailability",
      body,
      { headers: headers }
    );
  }

  handleShipment(payload: any): Observable<any> {
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    return this.http.post(
      environment.API_URL + decoded.instance + "/Shipment",
      payload,
      { headers: headers }
    );
  }

  googlePlace(address: string, lang: string = "it"): Observable<any> {
    if (address.length >= 10) {
      const decoded: any = this.store.decodedToken;
      return this.http.get(
        environment.API_URL +
          decoded.instance +
          "/AddressAutocomplete?input=" +
          address +
          "&lang=" +
          lang,
        { headers: { "X-API-KEY": this.store.token } }
      );
    } else {
      return of();
    }
  }

  invertAddressData(obj: any): any {
    const keys = [
      ["rcpt_addr", "sender_addr"],
      ["rcpt_cap", "sender_cap"],
      ["rcpt_city", "sender_city"],
      ["rcpt_contact", "sender_contact"],
      ["rcpt_country_code", "sender_country_code"],
      ["rcpt_email", "sender_email"],
      ["rcpt_name", "sender_name"],
      ["rcpt_surname", "sender_surname"],
      ["rcpt_phone", "sender_phone"],
      ["rcpt_prov", "sender_prov"],
    ];
    let tmp = obj;

    keys.forEach((key: any) => {
      [tmp[key[0]], tmp[key[1]]] = [tmp[key[1]], tmp[key[0]]];
    });
    return tmp;
  }

  previousStep() {
    if (this.store.currentStep > 1) {
      this.router.navigate(
        [this.store.modules[this.store.currentStep--].module],
        {
          queryParamsHandling: "merge",
        }
      );
    }
  }

  getDifference(a: string, b: string) {
    const aux = b.split("").reverse();
    const res = a
      .split("")
      .reverse()
      .map((letter: any, i: number) => {
        if (letter !== aux[i]) {
          return letter;
        }
      });
    return res.reverse().join("");
  }

  selectCourier() {
    return this.store.outwardCostExposure[0];
  }

  createShipment() {
    this.store.chosenCourier["outward"] = this.store.outwardCostExposure[0];
    this.store.chosenCourier["return"] = this.store.returnCostExposure[0];
    const outwardPayloadShipment = {
      ...this.store.payloadShipment,
      ...this.store.sender,
      ...this.store.recipient,
      // ...this.pickupMode,
      valore: this.store.outwardInsurance,
      corriere: this.store.chosenCourier.outward.courierCode,
      servizio: this.store.chosenCourier.outward.serviceCode,
    };
    if (this.store.hasInvoice) {
      const outwardInvoice = {
        nolo: this.store.chosenCourier["outward"].data.nolo,
        totale_fattura: this.store.chosenCourier["outward"].data.totale,
        assicurazione:
          this.store.chosenCourier["outward"].data.varie_dettaglio[
            this.store.isDocumentShipment
              ? "IB-EXTENDED LIABILITY"
              : "II-SHIPMENT INSURANCE"
          ],
        valore: this.store.outwardInsurance,
      };
      outwardPayloadShipment.fattura_dhl = [
        { ...this.store.invoice, ...outwardInvoice },
      ];
    }
    if (this.store.selectedProducts) {
      outwardPayloadShipment[this.store.productDestination] =
        this.store.selectedProducts;
    }

    this.handleShipment(outwardPayloadShipment).subscribe(
      (res) => {
        this.store.outwardShipment = res;
        if (!this.store.hasReturnShipment) {
          this.router.navigate(
            [this.store.modules[this.store.currentStep++].module],
            {
              queryParamsHandling: "merge",
            }
          );
        } else {
          // inverto il mittente con il destinatario per la spedizione di ritorno
          const returnPayloadShipment = {
            ...this.store.payloadShipment,
            valore: this.store.returnInsurance,
            servizio: this.store.chosenCourier.return.serviceCode,
            corriere: this.store.chosenCourier.return.courierCode,
            ...this.invertAddressData({
              ...this.store.sender,
              ...this.store.recipient,
            }),
          };
          if (this.store.hasInvoice) {
            const returnInvoice = {
              nolo: this.store.chosenCourier["return"].data.nolo,
              totale_fattura: this.store.chosenCourier["return"].data.totale,
              assicurazione:
                this.store.chosenCourier["return"].data.varie_dettaglio[
                  this.store.isDocumentShipment
                    ? "IB-EXTENDED LIABILITY"
                    : "II-SHIPMENT INSURANCE"
                ],
              valore: this.store.returnInsurance,
            };
            returnPayloadShipment.fattura_dhl = [
              { ...this.store.invoice, ...returnInvoice },
            ];
          }
          this.handleShipment(returnPayloadShipment).subscribe(
            (res) => {
              this.store.returnShipment = res;
              this.router.navigate(
                [this.store.modules[this.store.currentStep++].module],
                {
                  queryParamsHandling: "merge",
                }
              );
            },
            (error) => {
              // this.showModal = true;
              // this.errors = {};
              // this.errors = {
              //   errore: "errore temporaneo, riprova più tardi",
              // };
              // alert("errore temporaneo, riprova più tardi");
            }
          );
        }
      },
      (error) => {
        // this.showModal = true;
        // this.errors = {};
        // this.errors = {
        //   errore: "errore temporaneo, riprova più tardi",
        // };
      }
    );
  }

  showModal(form: any) {
    let errors: any = {};
    Object.keys(form.controls).forEach((key) => {
      const controlErrors: ValidationErrors = form.get(key)?.errors || {
        error: null,
      };
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          if (controlErrors[keyError]) {
            errors[
              this.store.translations[key] ? this.store.translations[key] : key
            ] = this.store.translations[keyError]
              ? this.store.translations[keyError]
              : keyError + "XXX";
          }
        });
      }
    });
    return errors;
  }

  handlePreviousStep(samePage: boolean = false) {
    if (this.store.currentStep > 1) {
      if (samePage) {
        this.router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this.router.navigate(
              [this.store.modules[this.store.currentStep - 1].module],
              {
                queryParamsHandling: "merge",
              }
            );
          });
      } else {
        this.store.currentStep -= 1;
        this.router.navigate(
          [this.store.modules[this.store.currentStep - 1].module],
          {
            queryParamsHandling: "merge",
          }
        );
      }
    }
  }

  checkConfiguration() {
    console.log(
      environment.CURRENT_URL +
        "/?origin=" +
        sessionStorage.getItem("origin") +
        sessionStorage.getItem("action")
        ? "&action=" + sessionStorage.getItem("action")
        : ""
    );
    if (!(Object.keys(this.store.configuration).length > 0)) {
      window.document.location.href =
        environment.CURRENT_URL +
        "/?origin=" +
        sessionStorage.getItem("origin") +
        sessionStorage.getItem("action")
          ? "&action=" + sessionStorage.getItem("action")
          : "";
      return true;
    }
    return false;
  }
}

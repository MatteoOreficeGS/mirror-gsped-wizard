import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { StoreService } from "./store.service";
import { environment } from "./enviroment";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  constructor(
    public http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private store: StoreService
  ) {}

  getTranslations(lang: string, resource = environment.FLOW): Observable<any> {
    const headers = { "x-api-key": this.store.token };
    const decoded: any = jwtDecode(this.store.token);
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

  pickupAvailability(corriere: any): Observable<any> {
    const decoded: any = this.store.decodedToken;
    const date = new Date(); /* .toLocaleString() */
    const headers = { "x-api-key": this.store.token };
    const body = {
      ...this.store.sender,
      pickup_date: date.getHours() + ":" + (date.getMinutes() + 1),
      corriere: corriere,
      client_id: this.store.configuration.client_id,
    };

    console.log(body);
    return this.http.post(
      "https://api.gsped.it/" + decoded.instance + "/PickupAvailability",
      body,
      { headers: headers }
    );
  }

  handleShipment(payload: any): Observable<any> {
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    return this.http.post(
      "https://api.gsped.it/" + decoded.instance + "/Shipment",
      payload,
      { headers: headers }
    );
  }

  googlePlace(address: string, lang: string = "it"): Observable<any> {
    if (address.length >= 10) {
      const decoded: any = this.store.decodedToken;
      return this.http.get(
        "https://api.gsped.it/" +
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
}

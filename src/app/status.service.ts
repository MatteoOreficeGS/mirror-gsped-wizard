import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { StoreService } from "./store.service";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private store: StoreService
  ) {}

  pickupAvailability(corriere:any): Observable<any> {
    const decoded: any = this.store.decodedToken;
    const date = new Date(); /* .toLocaleString() */
    const headers = { "x-api-key": this.store.token };
    const body = {
      ...this.store.sender,
      pickup_date: date.getHours() + ":" + (date.getMinutes() + 1),
      corriere: corriere,
      client_id: this.store.configuration.client_id
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

  handleRateComparative(body: any): Observable<any> {
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    body = Object.entries(body);
    body = body.map((element: any) => {
      return element.join("=");
    });
    body = body.join("&");
    return this.http.get(
      "https://api.gsped.it/" + decoded.instance + "/RateComparativa?" + body,
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
      ["rcpt_name", "sender_namesurname"],
      ["rcpt_phone", "sender_phone"],
      ["rcpt_prov", "sender_prov"],
    ];
    let tmp = obj;

    keys.forEach((key: any) => {
      [tmp[key[0]], tmp[key[1]]] = [tmp[key[1]], tmp[key[0]]];
    });
    return tmp;
  }
}

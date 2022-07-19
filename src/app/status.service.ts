import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { StoreService } from "./store.service";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  constructor(public http: HttpClient, private route: ActivatedRoute, private store: StoreService) {
  }

  pickupAvailability(): Observable<any> {
    const decoded: any = this.store.decodedToken;
    const date = new Date(); /* .toLocaleString() */
    const headers = { "x-api-key": this.store.token};
    const body = {
      ...this.store.sender,
      pickup_date: date.getHours() + ":" + (date.getMinutes() + 1),
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
    body = body;

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
}

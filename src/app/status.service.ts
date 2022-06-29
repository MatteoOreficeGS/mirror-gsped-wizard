import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { from, map, Observable, Subject } from "rxjs";
import jwt_decode from "jwt-decode";
import { NavigationEnd, ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class StatusService implements OnInit {
  constructor(public http: HttpClient, private route: ActivatedRoute) {
    // this.getToken();
  }

  ngOnInit(): void {
    // this.getConfiguration();
    console.log(this.session);
    this.route.queryParams.subscribe((params) => {
      console.log(params); // { orderby: "price" }
    });
  }

  foo = 1;

  response: any = {};

  activeStep: number = 0;

  token =
    "eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0=.eyJ1c2VyX2lkIjoiMjIiLCJpbnN0YW5jZSI6InRlc3RiZWQiLCJleHAiOjE2NTY0Mjc2MjB9.GOkYTTQ7vsgPp9F9RF4VJEj2IA6dZ7OOVRDuBwy/PmE=";
  decoded: any = jwt_decode(this.token);

  getConfiguration(): Observable<any> {
    return this.http.get(
      "https://api.gsped.it/" +
        this.decoded.instance +
        "/ResourceConfiguration?resource=" +
        "resi",
      { headers: { "X-API-KEY": this.token } }
    );
  }

  session: any = {
    sender: {
      sender_name: "lorenzo",
      sender_city: "udine",
      sender_contact: "contatto",
      sender_cap: "33100",
      sender_state: "ud",
      sender_country_code: "IT",
      sender_email: "lorenzo@gmailcom",
      sender_phone: "321321321",
      sender_address: "via adroiano 12",
    },
    recipient: {
      rcpt_name: "Consolato Generale Moldova",
      rcpt_contact: "Consolato Generale Moldova",
      rcpt_address: "Via Vincenzo Gioberti, 8",
      rcpt_city: "Milan",
      rcpt_cap: "20123",
      rcpt_state: "MI",
      rcpt_country_country: "IT",
      rcpt_email: "pippo@pippo.it",
      rcpt_phone: "0236745703",
    },
    shipment: {},
    step: null,
    flow: "resoFacile",
    user_id: this.decoded.user_id,
  };

  greeting() {
    console.log("hello");
  }

  setStatus(values: any, field: string) {
    this.session[field] = values;
  }

  getSession(): any {
    return this.session;
  }

  incrementStep() {
    this.activeStep += 1;
    console.log(this.activeStep);
  }
  getActiveStep(): number {
    return this.activeStep;
  }
  change() {
    return this.activeStep;
  }

  pickupAvailability(): Observable<any> {
    const date = new Date(); /* .toLocaleString() */
    const headers = { "x-api-key": this.token };
    const body = {
      sender_addr: "via duomo 10",
      sender_city: "milano",
      sender_cap: "26100",
      sender_prov: "MI",
      sender_phone: "3343353363",
      sender_email: "email@prova.com",
      corriere: "104",
      client_id: "555",
      pickup_date:
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        (date.getSeconds() + 1),
      sender_name: "pippo",
    };
    console.log(body);
    return this.http.post(
      "https://api.gsped.it/" + this.decoded.instance + "/PickupAvailability",
      body,
      { headers: headers }
    );
    /* .pipe(
        map(response => response.json()),
        catchError((e: any) =>{
          //do your processing here
          return throwError(e);
        }),
      ); */
  }

  handleShipment(payload: any): Observable<any> {
    const headers = { "x-api-key": this.token };
    return this.http.post(
      "https://api.gsped.it/" + this.decoded.instance + "/Shipment",
      payload,
      { headers: headers }
    );
  }

  handleRateComparative(): Observable<any> {
    const headers = { "x-api-key": this.token };
    return this.http.get(
      "https://api.gsped.it/" +
        this.decoded.instance +
        "/RateComparativa?departure_date_time=2022-06-20%2015%3A00%3A00&tipo_listino=passivo&gls_exchange=N&al_piano=0&al_sabato=0&client_id=555&colli=1&daticolli=%5B1,1,1,1,1%5D&peso=1&volume=0.002&sender_addr=via%20duomo%203&sender_city=milano&sender_prov=MI&sender_cap=20100&sender_country_code=it&rcpt_addr=via%20roma%204&rcpt_city=roma&rcpt_prov=RM&rcpt_cap=00121&rcpt_country_code=it&contrassegno=10&valore=10&documenti=0&preavviso_telefonico=N",
      { headers: headers }
    );
  }

  _step: number = 0;

  _stepSource: Subject<number> = new Subject();

  get stepSource(): Subject<number> {
    return this._stepSource;
  }

  set stepSource(src: Subject<number>) {
    this._stepSource = src;
  }

  changestep(n: number) {
    this.stepSource.next(n);
  }

  getResponse() {
    return this.response;
  }

  getTranslations() {
    return this.translations;
  }

  translations: any = {};

  setTranslations(lang: string, resource: string) {
    const headers = { "x-api-key": this.token };
    this.http
      .get(
        "https://api.gsped.it/" +
          this.decoded.instance +
          "/Translations?" +
          "lang=" +
          lang +
          "&resource=" +
          resource,
        { headers: headers }
      )
      .pipe((res) => (this.translations = res))
      .subscribe();
  }

  setConfiguration() {
    return this.http
      .get(
        "https://api.gsped.it/" +
          this.decoded.instance +
          "/ResourceConfiguration?resource=" +
          "resi",
        { headers: { "X-API-KEY": this.token } }
      )
      .pipe((res) => (this.response = res));
  }

  /* getGooglePlace(address: string) {
    console.log(address);
    return this.http.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        address +
        "&key=AIzaSyAN6DWc19h79hOsa8c6rFwQlGmH7u6cy_4",
    );
  } */

  getGooglePlace(address: string): Observable<any> {
    return from(
      fetch(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
          address +
          "&key=AIzaSyAN6DWc19h79hOsa8c6rFwQlGmH7u6cy_4",
        {
          method: "GET",
          mode: "no-cors",
        }
      )
    );
  }

  /* getLenguageSolved() {
    const headers = { "x-api-key": this.token };
    let x;
    return this.http
      .get(
        "https://api.gsped.it/" +
          this.decoded.instance +
          "/Translations?" +
          "lang=" +
          "en_EN" +
          "&resource=" +
          "resi",
        { headers: headers }
      )
      .pipe(map((result: any) => result))
      .pipe(res => this.translations = res);
  } */
}

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
    //console.log(this.session);
    this.route.queryParams.subscribe((params) => {
      //console.log(params); // { orderby: "price" }
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
      sender_name: "",
      sender_city: "",
      sender_contact: "",
      sender_cap: "",
      sender_prov: "",
      sender_country_code: "",
      sender_email: "",
      sender_phone: "",
      sender_addr: "",
    },
    recipient: {
      rcpt_name: "Consolato Generale Moldova",
      rcpt_contact: "Consolato Generale Moldova",
      rcpt_addr: "Via Vincenzo Gioberti, 8",
      rcpt_city: "Milan",
      rcpt_cap: "20123",
      rcpt_prov: "MI",
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
    //console.log("hello");
  }

  setStatus(values: any, field: string) {
    this.session[field] = values;
  }

  getSession(): any {
    return this.session;
  }

  incrementStep() {
    this.activeStep += 1;
    //console.log(this.activeStep);
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
      ...JSON.parse(sessionStorage.getItem("sender") || "{}"),
      corriere: "104",
      client_id: "555",
      pickup_date: date.getHours() + ":" + (date.getMinutes() + 1),
    };

    //console.log(body);
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

  handleRateComparative(body: any): Observable<any> {
    const headers = { "x-api-key": this.token };
    body = body;

    body = Object.entries(body);

    body = body.map((element: any) => {
      return element.join("=");
    });

    body = body.join("&");

    return this.http.get(
      "https://api.gsped.it/" +
        this.decoded.instance +
        "/RateComparativa?" +
        body,
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

  getGooglePlace(address: string, lang: string) {
    return this.http
      .get(
        "https://api.gsped.it/" +
          this.decoded.instance +
          "/AddressAutocomplete?input=" +
          address +
          "&lang=" +
          lang,
        { headers: { "X-API-KEY": this.token } }
      )
      .pipe((res) => (this.response = res));
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
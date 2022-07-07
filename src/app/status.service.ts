import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
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

  // token = sessionStorage.getItem("token") || "";
  token = "";
  // token =    "eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0=.eyJ1c2VyX2lkIjoiMjIiLCJpbnN0YW5jZSI6InRlc3RiZWQiLCJleHAiOjE2NTY0Mjc2MjB9.GOkYTTQ7vsgPp9F9RF4VJEj2IA6dZ7OOVRDuBwy/PmE=";
  decoded: any;

  decodeToken() {
    this.decoded = jwt_decode(sessionStorage.getItem("token") || "");
    this.session.user_id = this.decoded?.user_id;
  }

  getConfiguration(): Observable<any> {
    const decoded: any = jwt_decode(sessionStorage.getItem("token") || "");
    return this.http.get(
      "https://api.gsped.it/" +
        decoded.instance +
        "/ResourceConfiguration?resource=" +
        "resi",
      { headers: { "X-API-KEY": sessionStorage.getItem("token") || "" } }
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
  };

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
    const decoded: any = jwt_decode(sessionStorage.getItem("token") || "");
    const date = new Date(); /* .toLocaleString() */
    const headers = { "x-api-key": sessionStorage.getItem("token") || "" };
    const body = {
      ...JSON.parse(sessionStorage.getItem("sender") || "{}"),
      corriere: "104",
      client_id: "555",
      pickup_date: date.getHours() + ":" + (date.getMinutes() + 1),
    };

    console.log(body);
    return this.http.post(
      "https://api.gsped.it/" + decoded.instance + "/PickupAvailability",
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
    const decoded: any = jwt_decode(sessionStorage.getItem("token") || "");
    const headers = { "x-api-key": sessionStorage.getItem("token") || "" };
    return this.http.post(
      "https://api.gsped.it/" + decoded.instance + "/Shipment",
      payload,
      { headers: headers }
    );
  }

  handleRateComparative(body: any): Observable<any> {
    const decoded: any = jwt_decode(sessionStorage.getItem("token") || "");
    const headers = { "x-api-key": sessionStorage.getItem("token") || "" };
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
    console.log(sessionStorage.getItem("token") || "");

    let decoded: any = jwt_decode(sessionStorage.getItem("token") || "");

    // sessionStorage.removeItem("translations");
    const headers = { "x-api-key": sessionStorage.getItem("token") || "" };
    this.http
      .get(
        "https://api.gsped.it/" +
          decoded.instance +
          "/Translations?" +
          "lang=" +
          lang +
          "&resource=" +
          resource,
        { headers: headers }
      )
      // .pipe((res) => (this.translations = res))
      .subscribe((res) => {
        // alert(res);
        console.log(res);
        sessionStorage.setItem("translations", JSON.stringify(res));
        const currentUrl = window.location.pathname;
        console.log(currentUrl);

        window.location.href = currentUrl + "?lang=" + lang;
      });
  }

  setConfiguration() {
    return this.http
      .get(
        "https://api.gsped.it/" +
          "testbed" + // TODO modificare con il decoded
          "/ResourceConfiguration?resource=" +
          "resi",
        { headers: { "X-API-KEY": sessionStorage.getItem("token") || "" } }
      )
      .pipe((res) => (this.response = res));
  }

  getGooglePlace(address: string, lang: string) {
    const decoded: any = jwt_decode(sessionStorage.getItem("token") || "");
    return this.http
      .get(
        "https://api.gsped.it/" +
          decoded.instance +
          "/AddressAutocomplete?input=" +
          address +
          "&lang=" +
          lang,
        { headers: { "X-API-KEY": sessionStorage.getItem("token") || "" } }
      )
      .pipe((res) => (this.response = res));
  }

  /* getLenguageSolved() {
    const headers = { "x-api-key": sessionStorage.getItem("token") || "" };
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

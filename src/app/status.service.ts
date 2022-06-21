import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { map, Observable, Subject } from "rxjs";
import jwt_decode from "jwt-decode";
import { NavigationEnd, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class StatusService implements OnInit {
  constructor(public http: HttpClient, public router: Router) {
    // this.getToken();
  }

  ngOnInit(): void {
    // this.getConfiguration();
    console.log(this.session);
  }

  response: any = {};

  activeStep: number = 0;

  token =
    "eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0=.eyJ1c2VyX2lkIjoyMiwiaW5zdGFuY2UiOiJ0ZXN0YmVkIiwiZXhwIjoxNjU0NzAyNTAwfQ==.GqqO3lFxJLMpikuHY3DO3rC4A874yuwRQT0g3x+JgIs=";
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
      name: "lorenzo",
      city: "udine",
      zipcode: "33100",
      state: "ud",
      country: "italia",
      email: "lorenzo@gmailcom",
      phone: "321321321",
      address: "via adroiano 12",
    },
    recipient: {},
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
      pickup_date: date.getHours() + ":" + (date.getMinutes() + 1),
      sender_name: "pippo",
    };
    console.log(body);
    return this.http
      .post(
        "https://api.gsped.it/" + this.decoded.instance + "/PickupAvailability",
        body,
        { headers: headers }
      )
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
}

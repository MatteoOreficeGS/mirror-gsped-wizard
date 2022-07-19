import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
})
export class PaymentComponent implements OnInit {
  payload: string = "";

  constructor(
    public http: HttpClient,
    public status: StatusService,
    public store: StoreService,
    public router: Router,
    public fb: FormBuilder
  ) {
    this.step = this.store.modules.filter(
      (module: any) => "/" + module.name === router.url.split("?")[0]
    )[0].step;
    console.log(this.selectedProvider);
    this.formPayment = fb.group({
      cardHolderName: "",
      cardHolderEmail: ["", Validators.email],
      cardHolderPhone: "",
    });
  }

  ngOnInit(): void {
    this.response = this.store.configuration;
    console.log(this.response);
    this.currentModule = this.response.modules.filter(
      (el: { moduleName: string }) => el.moduleName === "payment"
    )[0].moduleConfig;
    console.log(this.currentModule);
    this.providers = this.currentModule.provider;
  }

  formPayment: FormGroup;
  bodyPayment: any = {};
  response: any = {};
  currentModule: any;
  providers: Array<string> = [];
  selectedProvider: string = "";
  shipmentResponse: any = {};
  isHandledPayment: boolean = false;
  step: number;

  redirectPayment() {
    this.isHandledPayment = true;
    const shipmentResponse = this.store.shipment;
    const decodedToken: any = this.store.decodedToken;

    this.bodyPayment = {
      monetaweb: {
        origine: "resoFacile", //fisso
        items: [
          {
            item: "Trasporto",
            item_id: shipmentResponse.id,
            amount: this.store.totale,
            codiceSconto: "",
            currency: "EUR",
            clienti_id: shipmentResponse.client_id,
          },
        ],
        displayUrl: "http://gsped-wizard.gsped.it/display/", //scelgo io
        utenti_id: decodedToken.user_id, //utente dal token
        recoveryUrl: "http://gsped-wizard.gsped.it/recovery/", //scelgo io
        language: "it", //fisso
        description: "reso bla bla bla per bla bla ecc ecc", // scelgo io
        cardHolderName: this.formPayment.value.cardHolderName, // questo form
        cardHolderEmail: this.formPayment.value.cardHolderEmail, // questo form
        cardHolderPhone: this.formPayment.value.cardHolderPhone, // questo form
        customField: "reso bla bla bla per bla bla ecc ecc", // scelgo io
      },
      session: {}, //Quello che mi serve per dopo
    };

    this.handlePayment(this.bodyPayment).subscribe(
      (res) => {
        console.log(res);
        window.open(res.monetaweb.hostedpageurl + "?PaymentID=" + res.monetaweb.paymentid , "_blank");
      },
      (error) => {
        alert(JSON.stringify(error, null, 4));
      }
    );
    // window.open('https://www.google.com', "_blank");
  }

  // TODO modificare con la env
  handlePayment(bodyPayment: any): Observable<any> {
    return this.http.post(
      "https://api.gsped.it/testbed/resoFacile/payment/process/monetaweb",
      bodyPayment,
      { headers: { "X-API-KEY": this.store.token } }
    );
  }
}

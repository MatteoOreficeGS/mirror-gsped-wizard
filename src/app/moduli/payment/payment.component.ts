import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/app/enviroment";
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
    console.log(this.selectedProvider);
    this.formPayment = fb.group({
      cardHolderName: "",
      cardHolderEmail: ["", Validators.email],
      cardHolderPhone: "",
    });
    this.translations = store.translations;
    this.fields = [
      {
        value: "cardHolderName",
        label: this.translations.cc_cardholder_name,
        type: "text",
      },
      {
        value: "cardHolderEmail",
        label: this.translations.cc_cardholder_email,
        type: "email",
      },
      {
        value: "cardHolderPhone",
        label: this.translations.cc_cardholder_phone,
        type: "text",
      },
    ];
    Object.keys(store.sender).forEach((element: any) => {
      this.sender[this.translations[element]] = store.sender[element];
    });

    Object.keys(store.recipient).forEach((element: any) => {
      this.recipient[this.translations[element]] = store.recipient[element];
    });

    console.log(this.sender);
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
  isPaymentHanldeCompleted: any = false;
  translations: any = {};
  fields: any = {};
  sender: any = {};
  recipient: any = {};
  shipment: any = {};

  redirectPayment() {
    this.isHandledPayment = true;
    const outwardShipmentResponse = this.store.outwardShipment;
    const returnShipmentResponse = this.store.returnShipment;
    const decodedToken: any = this.store.decodedToken;

    this.bodyPayment = {
      monetaweb: {
        origine: "resoFacile", //fisso
        utenti_id: decodedToken.user_id, //utente dal token
        displayUrl: environment.CURRENT_URL + "/awb-printing", //scelgo io
        recoveryUrl: environment.CURRENT_URL + "/error-payment", //scelgo io
        language: "it", //fisso
        description: "reso bla bla bla per bla bla ecc ecc", // scelgo io
        cardHolderName: this.formPayment.value.cardHolderName, // questo form
        cardHolderEmail: this.formPayment.value.cardHolderEmail, // questo form
        cardHolderPhone: this.formPayment.value.cardHolderPhone, // questo form
        customField: "reso bla bla bla per bla bla ecc ecc", // scelgo io
      },
      session: {
        origin: this.store.origin,
        token: this.store.token,
        outwardShipmentID: outwardShipmentResponse.id,
        returnShipmentID: returnShipmentResponse.id,
      }, //Quello che mi serve per dopo
    };

    let items = [
      {
        item: "Trasporto",
        item_id: outwardShipmentResponse.id,
        amount: this.store.chosenCourier.outward.data.totale,
        // amount: 15.54,
        codiceSconto: this.store.codiceSconto,
        currency: "EUR",
        clienti_id: outwardShipmentResponse.client_id,
      },
    ];

    if (this.store.hasReturnShipment) {
      items.push({
        item: "Trasporto",
        item_id: returnShipmentResponse.id,
        amount: this.store.chosenCourier.return.data.totale,
        // amount: 15.54,
        codiceSconto: this.store.codiceSconto,
        currency: "EUR",
        clienti_id: returnShipmentResponse.client_id,
      });
    }

    this.bodyPayment.monetaweb.items = items;

    this.handlePayment(this.bodyPayment).subscribe(
      (res) => {
        this.isPaymentHanldeCompleted = res.monetaweb.merchantOrderId;
        console.log(res);
        window.document.location.href =
          res.monetaweb.hostedpageurl + "?PaymentID=" + res.monetaweb.paymentid;
      },
      (error) => {
        alert(JSON.stringify(error, null, 4));
      }
    );
  }

  // TODO modificare con la env
  handlePayment(bodyPayment: any): Observable<any> {
    return this.http.post(
      environment.API_URL +
        this.store.decodedToken.instance +
        "/resoFacile/payment/process/monetaweb",
      bodyPayment,
      { headers: { "X-API-KEY": this.store.token } }
    );
  }
}

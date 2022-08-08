import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/app/enviroment";
import { ValidateEmail, ValidatePhone } from "src/app/libs/validation";
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
      cardHolderName: this.store.isSenderPrefilled
        ? this.store.recipient.rcpt_name
        : this.store.sender.sender_name,
      cardHolderEmail: [
        this.store.isSenderPrefilled
          ? this.store.recipient.rcpt_email
          : this.store.sender.sender_email,
        ValidateEmail,
      ],
      cardHolderPhone: [
        this.store.isSenderPrefilled
          ? this.store.recipient.rcpt_phone
          : this.store.sender.sender_phone,
        ValidatePhone,
      ],
      termsconditions: "",
    });
    this.translations = store.translations;
    this.termsConditions = JSON.parse(this.translations.lbl_termsconditions);
    this.termsPrivacy = JSON.parse(this.translations.lbl_privacy);
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

    this.senderNew = {
      ...this.sender,
    };

    this.recipientNew = {
      ...this.recipient,
    };

    delete this.senderNew["undefined"];
    delete this.recipientNew["undefined"];

    this.senderNew[this.translations["sender_name"]] =
      this.store.sender.sender_name + " " + this.store.sender.sender_surname;
    this.recipientNew[this.translations["rcpt_name"]] =
      this.store.recipient.rcpt_name + " " + this.store.recipient.rcpt_surname;
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
  senderNew: any = {};
  recipientNew: any = {};
  termsConditions: any;
  termsPrivacy: any;

  redirectPayment() {
    this.isHandledPayment = true;
    const decodedToken: any = this.store.decodedToken;
    this.bodyPayment = {
      monetaweb: {
        origine: "resoFacile",
        utenti_id: decodedToken.user_id,
        displayUrl: environment.CURRENT_URL + "/",
        recoveryUrl: environment.CURRENT_URL + "/error-payment",
        language: "it",
        description: "reso bla bla bla per bla bla ecc ecc",
        cardHolderName: this.formPayment.value.cardHolderName,
        cardHolderEmail: this.formPayment.value.cardHolderEmail,
        cardHolderPhone: this.formPayment.value.cardHolderPhone,
        customField: "reso bla bla bla per bla bla ecc ecc",
      },
      session: {
        origin: this.store.origin,
        outwardShipmentID: this.store.outwardShipment.id,
        returnShipmentID: this.store.returnShipment.id,
        sender: this.store.sender,
      },
    };

    let items = [
      {
        item: "Trasporto",
        item_id: this.store.outwardShipment.id,
        amount: this.store.chosenCourier.outward.data.totale,
        codiceSconto: this.store.codiceSconto,
        currency: "EUR",
        clienti_id: this.store.outwardShipment.client_id,
      },
    ];

    if (this.store.hasReturnShipment) {
      items.push({
        item: "Trasporto",
        item_id: this.store.returnShipment.id,
        amount: this.store.chosenCourier.return.data.totale,
        codiceSconto: this.store.codiceSconto,
        currency: "EUR",
        clienti_id: this.store.returnShipment.client_id,
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

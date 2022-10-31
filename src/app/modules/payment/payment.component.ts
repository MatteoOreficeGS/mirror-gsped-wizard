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
    public service: StatusService,
    public store: StoreService,
    public router: Router,
    public fb: FormBuilder
  ) {
    if (this.service.checkConfiguration()) { return; };
    this.formPayment = fb.group({
      cc_cardholder_name: this.store.isSenderPrefilled
        ? this.store.recipient.rcpt_name
        : this.store.sender.sender_name,
      cc_cardholder_email: [
        this.store.isSenderPrefilled
          ? this.store.recipient.rcpt_email
          : this.store.sender.sender_email,
        ValidateEmail,
      ],
      cc_cardholder_phone: [
        this.store.isSenderPrefilled
          ? this.store.recipient.rcpt_phone
          : this.store.sender.sender_phone,
        ValidatePhone,
      ],
      termsconditions: "",
    });
    this.translations = store.translations;
    this.store.totalAmount = (
      this.store.chosenCourier.outward.data.totale +
      (this.store.hasReturnShipment
        ? this.store.chosenCourier.return.data.totale
        : 0)
    ).toFixed(2);
    this.termsConditions = JSON.parse(this.translations.lbl_termsconditions);
    this.termsPrivacy = JSON.parse(this.translations.lbl_privacy);
    this.fields = [
      {
        value: "cc_cardholder_name",
        label: this.translations.cc_cardholder_name,
        type: "text",
      },
      {
        value: "cc_cardholder_email",
        label: this.translations.cc_cardholder_email,
        type: "email",
      },
      {
        value: "cc_cardholder_phone",
        label: this.translations.cc_cardholder_phone,
        type: "text",
      },
    ];

    this.recipient = this.store.recipient;
    this.sender = this.store.sender;
  }

  ngOnInit(): void {
    this.response = this.store.configuration;
    this.currentModule = this.response.modules.filter(
      (el: { moduleName: string }) => el.moduleName === "payment"
    )[0].moduleConfig;
    this.providers = this.currentModule.provider;
  }

  formPayment!: FormGroup;
  bodyPayment: any = {};
  response: any = {};
  currentModule: any;
  providers: Array<string> = [];
  isHandledPayment: boolean = false;
  isPaymentHanldeCompleted: any = false;
  translations: any = {};
  fields: any = {};
  sender: any = {};
  recipient: any = {};
  termsConditions: any;
  termsPrivacy: any;
  showModal = false;
  errors: any = {};

  redirectPayment() {
    if (this.formPayment.value.termsconditions && this.formPayment.valid) {
      this.isHandledPayment = true;
      const decodedToken: any = this.store.decodedToken;
      this.bodyPayment = {
        monetaweb: {
          origine: "resoFacile",
          utenti_id: decodedToken.user_id,
          displayUrl: environment.CURRENT_URL + "/",
          recoveryUrl: environment.CURRENT_URL + "/",
          language: "it",
          description: environment.PAYMENT_DESCRIPTION,
          cardHolderName: this.formPayment.value.cc_cardholder_name,
          cardHolderEmail: this.formPayment.value.cc_cardholder_email,
          cardHolderPhone: this.formPayment.value.cc_cardholder_phone,
          customField: "",
        },
        session: {
          origin: this.store.origin,
          outwardShipmentID: this.store.outwardShipment.id,
          returnShipmentID: this.store.returnShipment.id,
          summary: {
            sender: this.store.sender,
            recipient: this.store.recipient,
            invoice: this.store.invoice,
          },
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

      items = items.map(item => {
        const itemAux:any = {...item};
        if (itemAux.codiceSconto.length < 3) {
          delete itemAux.codiceSconto
        }
        return itemAux;
      })

      this.bodyPayment.monetaweb.items = items;
      this.bodyPayment.session.totalAmount = this.store.totalAmount;
      this.bodyPayment.session.bodyPayment = this.bodyPayment.monetaweb;

      this.handlePayment(this.bodyPayment).subscribe(
        (res) => {
          this.isPaymentHanldeCompleted = res.monetaweb.merchantOrderId;
          window.document.location.href =
            res.monetaweb.hostedpageurl +
            "?PaymentID=" +
            res.monetaweb.paymentid;
        },
        (error) => {
          this.showModal = true;
          this.errors = {};
          this.errors = {
            pagamento: "errore temporaneo, riprova più tardi",
          };
        }
      );
    } else {
      this.showModal = true;
      this.errors = {};
      this.errors = {
        ...this.service.showModal(this.formPayment),
        termsConditions: "required",
      };
    }
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

  setCloseModal(event: boolean) {
    this.showModal = event;
  }
}

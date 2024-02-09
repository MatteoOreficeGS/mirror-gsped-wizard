import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
    public fb: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }

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
    if (!this.store.configuration["separate payment"]) {
      this.store.totalAmount = (
        this.store.chosenCourier.outward.data.totale +
        (this.store.hasReturnShipment
          ? this.store.chosenCourier.return.data.totale
          : 0)
      ).toFixed(2);
    } /* else {
      this.store.totalAmount =
        this.store.beforePaymentSession.outwardAmount +
        this.store.beforePaymentSession.returnAmount;
    } */
    this.termsConditions = JSON.parse(
      this.translations.lbl_termsconditions || "{}"
    );
    this.termsPrivacy = JSON.parse(this.translations.lbl_privacy || "{}");
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
    this.provider = this.currentModule.provider[0];
    this.route.queryParams.subscribe((params) => {
      this.lang = params["lang"];
    });
  }

  formPayment!: UntypedFormGroup;
  bodyPayment: any = {};
  response: any = {};
  currentModule: any;
  provider: string = "";
  isHandledPayment: boolean = false;
  isPaymentHanldeCompleted: any = false;
  translations: any = {};
  fields: any = {};
  sender: any = {};
  recipient: any = {};
  lang?: string;
  termsConditions: any;
  termsPrivacy: any;
  showModal = false;
  errors: any = {};

  redirectPayment() {
    if (this.formPayment.value.termsconditions && this.formPayment.valid) {
      this.isHandledPayment = true;
      const decodedToken: any = this.store.decodedToken;
      this.bodyPayment = {
        [this.provider]: {
          origine: "resoFacile",
          utenti_id: decodedToken.user_id,
          displayUrl: environment.CURRENT_URL + "/display",
          recoveryUrl: environment.CURRENT_URL + "/recovery",
          language: this.lang?.slice(0, 2),
          description: environment.PAYMENT_DESCRIPTION,
          cardHolderName: this.formPayment.value.cc_cardholder_name,
          cardHolderEmail: this.formPayment.value.cc_cardholder_email,
          cardHolderPhone: this.formPayment.value.cc_cardholder_phone,
          customField: "",
        },
        session: {
          origin: this.store.origin,
          language: this.lang,
          outwardShipmentID: this.store.outwardShipment.id,
          returnShipmentID: this.store.returnShipment.id,
          isHomePickup: { ...this.store.isHomePickup },
          summary: {
            sender: this.store.sender,
            recipient: this.store.recipient,
            invoice: this.store.invoice,
          },
        },
      };

      this.bodyPayment[this.provider].items = this.getPaymentItems();
      this.bodyPayment.session.totalAmount = this.store.totalAmount;
      this.bodyPayment.session.bodyPayment = this.bodyPayment[this.provider];

      //#region save data for separate payment

      this.bodyPayment.session.isOutwardPaymentPerformed = true;
      if (
        this.store.configuration["separate payment"] &&
        !this.store.isReturnPayment
      ) {
        // andata
        this.bodyPayment.session.outwardAmount =
          this.store.chosenCourier.outward.data.totale;
        this.bodyPayment.session.returnAmount =
          this.store.chosenCourier.return.data.totale;
      } else {
        // ritorno
        this.bodyPayment.session.isReturnPaymentPerformed = true;
        this.bodyPayment.session.outwardAmount =
          this.store.beforePaymentSession.outwardAmount;
        this.bodyPayment.session.returnAmount =
          this.store.beforePaymentSession.returnAmount;
      }
      //#endregion

      this.handlePayment(this.bodyPayment).subscribe(
        (res) => {
          this.isPaymentHanldeCompleted = res[this.provider].merchantOrderId;
          window.document.location.href =
            res[this.provider].hostedpageurl +
            "?PaymentID=" +
            res[this.provider].paymentid;
        },
        (error) => {
          this.showModal = true;
          this.errors = {};
          this.isHandledPayment = false;
          this.errors = {
            pagamento:
              this.store.translations.lbl_generic_error ||
              "errore temporaneo, riprova più tardi",
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
        "/resoFacile/payment/process/" +
        this.provider,
      bodyPayment,
      { headers: { "X-API-KEY": this.store.token } }
    );
  }

  setCloseModal(event: boolean) {
    this.showModal = event;
  }

  getPaymentItems() {
    const items = [];
    let _item = {
      item: "Trasporto",
      item_id: this.store.outwardShipment.id,
      amount: 0,
      codiceSconto: this.store.codiceSconto,
      currency: "EUR",
      clienti_id: this.store.outwardShipment.client_id,
    };

    if (!this.store.configuration["separate payment"]) {
      _item.amount = this.store.chosenCourier.outward.data.totale;
    } else if (!this.store?.beforePaymentSession?.isOutwardPaymentPerformed) {
      _item.amount = this.store.chosenCourier.outward.data.totale;
    }

    // for configuration with separate payment
    if (this.store.isReturnPayment) {
      _item.amount = this.store.beforePaymentSession.returnAmount;
      _item.item_id = this.store.returnShipment.id;
      _item.clienti_id = this.store.returnShipment.client_id;
    }

    items.push(_item);

    // for two way shipment
    if (
      this.store.hasReturnShipment &&
      !this.store.configuration["separate payment"]
    ) {
      items.push({
        item: "Trasporto",
        item_id: this.store.returnShipment.id,
        amount: this.store.chosenCourier.return.data.totale,
        codiceSconto: this.store.codiceSconto,
        currency: "EUR",
        clienti_id: this.store.returnShipment.client_id,
      });
    }

    return items.map((item) => {
      const itemAux: any = { ...item };
      if (itemAux.codiceSconto.length < 3) {
        delete itemAux.codiceSconto;
      }
      return itemAux;
    });
  }
}

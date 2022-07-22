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
      session: { orign: this.store.origin, token: this.store.token, shipmentID: shipmentResponse.id }, //Quello che mi serve per dopo
    };

    this.handlePayment(this.bodyPayment).subscribe(
      (res) => {
        this.isPaymentHanldeCompleted = res.monetaweb.merchantOrderId;
        console.log(res);
        window.open(
          res.monetaweb.hostedpageurl + "?PaymentID=" + res.monetaweb.paymentid,
          "_blank"
        );
      },
      (error) => {
        alert(JSON.stringify(error, null, 4));
      }
    );
    // window.open('https://www.google.com', "_blank");
  }

  handleRecovery() {
    this.router.navigate(["error-payment/monetaweb"], {
      queryParamsHandling: "merge",
      queryParams: { uuid: this.isPaymentHanldeCompleted },
    });
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

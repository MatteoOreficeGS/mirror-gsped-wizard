import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
})
export class PaymentComponent implements OnInit {
  payload: string = "";

  constructor(public status: StatusService, public fb: FormBuilder) {
    console.log(this.selectedProvider);
    this.formPayment = fb.group({
      cardHolderName: "",
      cardHolderEmail: ["", Validators.email],
      cardHolderPhone: "",
    });
  }

  ngOnInit(): void {
    this.status.getConfiguration().subscribe((res) => {
      this.response = res;
      console.log(this.response);
      this.currentModule = this.response.configuration.modules.filter(
        (el: { moduleName: string }) => el.moduleName === "payment"
      )[0].moduleConfig;
      console.log(this.currentModule);
      this.providers = this.currentModule.provider;
    });
  }

  formPayment: FormGroup;
  bodyPayment: any = {};
  response: any = {};
  currentModule: any;
  providers: Array<string> = [];
  selectedProvider: string = "";
  shipmentResponse: any = {};
  isHandledPayment: boolean = false;

  redirectPayment() {
    this.isHandledPayment = true;
    const shipmentResponse = JSON.parse(
      sessionStorage.getItem("shipment") || "{}"
    );

    this.bodyPayment = {
      monetaweb: {
        origine: "resoFacile", //fisso
        item: "trasporto", //fisso
        item_id: shipmentResponse.id, //risposta precedente
        amount: 123.45, //form precedente
        codiceSconto: "test_10", //form precedente
        displayUrl: "http://gsped-wizard.gsped.it/display/", //scelgo io
        utenti_id: 555, //utente dal token
        clienti_id: shipmentResponse.client_id, //utente dalla configurazione
        recoveryUrl: "http://gsped-wizard.gsped.it/recovery/", //scelgo io
        currencycode: 978, //fisso
        language: "it", //fisso
        description: "reso bla bla bla per bla bla ecc ecc", // scelgo io
        cardHolderName: this.formPayment.value.cardHolderName, // questo form
        cardHolderEmail: this.formPayment.value.cardHolderEmail, // questo form
        cardHolderPhone: this.formPayment.value.cardHolderPhone, // questo form
        customField: "reso bla bla bla per bla bla ecc ecc", // scelgo io
      },
      session: {}, //Quello che mi serve per dopo
    };

    alert(JSON.stringify(this.bodyPayment, null, 4));
    // window.open('https://www.google.com', "_blank");
  }
}

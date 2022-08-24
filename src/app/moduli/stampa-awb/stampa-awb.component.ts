import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { environment } from "src/app/enviroment";
import { StoreService } from "src/app/store.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";

@Component({
  selector: "app-stampa-awb",
  templateUrl: "./stampa-awb.component.html",
})
export class StampaAwbComponent {

  //TODO destinatario non compare in testindiamilanoneway

  constructor(
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
    private store: StoreService
  ) {
    this.displayPayment = this.store.displayPayment
      ? this.store.displayPayment
      : {};

    if (this.displayPayment.status === "canceled") {
      this.isPaymentCompleted = false;
      this.retryPayment.monetaweb = this.store.beforePaymentSession.bodyPayment;
      this.retryPayment.session = this.store.beforePaymentSession;
    } else {
      if (this.store.beforePaymentSession) {
        this.summary = this.store.beforePaymentSession.summary;
        this.store.invoice = this.summary.invoice;
        this.store.totalAmount = this.store.beforePaymentSession.totalAmount;
      } else {
        this.summary = {
          sender: this.store.sender,
          invoice: this.store.invoice,
          recipient: this.store.recipient,
        };
      }
      this.isPaymentCompleted = true;
      this.currentModule = this.store.configuration.modules.filter(
        (module: any) => module.moduleName === "awb-printing"
      )[0].moduleConfig;
      this.showSummary = this.currentModule.summary;
      this.translations = this.store.translations;
      this.directDownload = {
        label: this.translations[this.currentModule.directDownload.label],
        text: this.translations[this.currentModule.directDownload.text].split(
          "\r\n"
        ),
      };
      if (this.currentModule.hasOwnProperty("instructions")) {
        this.instructions = {
          label: this.translations[this.currentModule.instructions.label],
          text: this.translations[this.currentModule.instructions.text].split(
            "\r\n"
          ),
        };
      }
      this.getShipments(
        this.store.outwardShipment.id,
        this.store.returnShipment.id
      );
      this.handleLocationFinder(
        this.store.beforePaymentSession
          ? this.store.beforePaymentSession.summary.sender
          : this.store.sender
      ).subscribe((res: any) => {
        this.locationFinder = res.locations[0];
      });

      this.handleLinkLabels(
        this.store.outwardShipment.id,
        this.store.returnShipment.id
      ).subscribe((res: any) => {
        this.labelLink = res.link;
      });
    }
  }

  getShipments(outwardShipmentID: any, returnShipmentID: any) {
    const headers = { "x-api-key": this.store.token };
    this.http
      .get(
        environment.API_URL +
          "testbed" + //TODO da cambiare col token
          "/shipment?id=" +
          // this.store.outwardShipmentID ? this.store.outwardShipmentID : this.store.outwardShipment.id,
          outwardShipmentID,
        { headers: headers }
      )
      .subscribe((response: any) => {
        this.result = response;
        this.b64pdf = this.result.label_pdf[0];
        this.pdfOutward = this.domSanitizer.bypassSecurityTrustUrl(
          "data:application/octet-stream;base64," + this.b64pdf
        );
      });
    if (returnShipmentID) {
      this.http
        .get(
          environment.API_URL +
            "testbed" + //TODO da cambiare col token
            "/shipment?id=" +
            returnShipmentID,
          { headers: headers }
        )
        .subscribe((response: any) => {
          this.result = response;
          this.b64pdf = this.result.label_pdf[0];
          this.pdfReturn = this.domSanitizer.bypassSecurityTrustUrl(
            "data:application/octet-stream;base64," + this.b64pdf
          );
        });
    }
  }

  handleLocationFinder(sender: any): Observable<any> {
    const params = {
      countryCode: sender.sender_country_code,
      addressLocality: sender.sender_city,
      postalCode: sender.sender_cap,
      streetAddress: sender.sender_addr,
      providerType: "express",
      locationType: "servicepoint",
      radius: 2500,
      limit: 1,
    };
    return this.http.get(
      "https://api.dhl.com/location-finder/v1/find-by-address",
      {
        headers: { "DHL-API-Key": "Vg9TTemSNaXE4G6PwAfhbwCeK0x0vswz" },
        params: params,
      }
    );
  }

  handleLinkLabels(
    outwardShipmentID: number,
    returnShipmentID: number = 0
  ): Observable<any> {
    const params = { andata: outwardShipmentID, ritorno: returnShipmentID };
    return this.http.get("https://api.gsped.it/testbed/EtichetteResoFacile", {
      headers: { "X-API-KEY": this.store.token },
      params: params,
    });
  }

  redirectPayment() {
    this.isHandledPayment = true;
    this.handlePayment(this.retryPayment).subscribe((res: any) => {
      // TODO link "problemi col pagamento" tramite merchantOrderId
      // this.isPaymentHanldeCompleted = res.monetaweb.merchantOrderId;
      window.document.location.href =
        res.monetaweb.hostedpageurl + "?PaymentID=" + res.monetaweb.paymentid;
    });
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

  result: any;
  b64pdf: any;
  pdfOutward: any;
  pdfReturn: any;
  displayPayment: any;
  currentModule: any;
  translations: any;
  locationFinder: any;
  labelLink?: string;
  directDownload: any;
  instructions: any;
  isPaymentCompleted: boolean = false;
  showSummary?: boolean;
  summary: any;
  retryPayment: any = {};
  isHandledPayment: boolean = false;
}

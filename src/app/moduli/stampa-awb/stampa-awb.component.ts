import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/app/enviroment";
import { StoreService } from "src/app/store.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";

@Component({
  selector: "app-stampa-awb",
  templateUrl: "./stampa-awb.component.html",
})
export class StampaAwbComponent {
  constructor(
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private store: StoreService
  ) {
    this.displayPayment = this.store.displayPayment
      ? this.store.displayPayment
      : null;
    if (this.displayPayment.status === "canceled") {
      this.isPaymentCompleted = false;
    } else {
      this.isPaymentCompleted = true;
      this.currentModule = this.store.configuration.modules.filter(
        (module: any) => module.moduleName === "awb-printing"
      )[0].moduleConfig;
      console.log(this.currentModule);
      this.translations = this.store.translations;
      this.directDownload = {
        label: this.translations[this.currentModule.directDownload.label],
        text: this.translations[this.currentModule.directDownload.text].split(
          "\r\n"
        ),
      };
      this.instructions = {
        label: this.translations[this.currentModule.instructions.label],
        text: this.translations[this.currentModule.instructions.text].split(
          "\r\n"
        ),
      };
      this.getShipments(
        this.store.outwardShipment.id,
        this.store.returnShipment.id
      );
      this.handleLocationFinder(
        this.store.beforePaymentSession
          ? this.store.beforePaymentSession.sender
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
    console.log(outwardShipmentID, returnShipmentID);
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
}

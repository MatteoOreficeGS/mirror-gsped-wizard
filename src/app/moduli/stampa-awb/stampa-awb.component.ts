import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/app/enviroment";
import { StoreService } from "src/app/store.service";
import { DomSanitizer } from "@angular/platform-browser";

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
    this.displayPayment = this.store.displayPayment;
    this.getShipments(
      this.store.outwardShipment.id,
      this.store.returnShipment.id
    );
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

  result: any;
  b64pdf: any;
  pdfOutward: any;
  pdfReturn: any;
  displayPayment: any;
}

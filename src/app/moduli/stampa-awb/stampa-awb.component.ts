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
    // this.route.queryParams.subscribe((params: any) => {
    //   if (params.uuid) {
    //     this.checkPayment(params.uuid);
    //   }
    // });
    setTimeout(() => {
      this.getShipments();
    }, 500);
  }

  getShipments() {
    console.log(
      this.store.token,
      this.store.outwardShipmentID,
      this.store.returnShipmentID
    );
    const headers = { "x-api-key": this.store.token };
    this.http
      .get(
        environment.API_URL +
          "testbed" + //TODO da cambiare col token
          "/shipment?id=" +
          this.store.outwardShipmentID,
        { headers: headers }
      )
      .subscribe((response: any) => {
        // alert(JSON.stringify(response, null, 4));
        this.result = response;
        this.b64pdf = this.result.label_pdf[0];
        this.pdfOutward = this.domSanitizer.bypassSecurityTrustUrl(
          "data:application/octet-stream;base64," + this.b64pdf
        );
      });
    this.http
      .get(
        environment.API_URL +
          "testbed" + //TODO da cambiare col token
          "/shipment?id=" +
          this.store.returnShipmentID,
        { headers: headers }
      )
      .subscribe((response: any) => {
        // alert(JSON.stringify(response, null, 4));
        this.result = response;
        this.b64pdf = this.result.label_pdf[0];
        this.pdfReturn = this.domSanitizer.bypassSecurityTrustUrl(
          "data:application/octet-stream;base64," + this.b64pdf
        );
      });
  }

  awbPrinting() {

    // const byteArray = new Uint8Array(
    //   atob(this.result.label_pdf[0])
    //     .split("")
    //     .map((char) => char.charCodeAt(0))
    // );
    // this.b64pdf = new Blob([byteArray], { type: "application/pdf" });
  }

  result: any;
  b64pdf: any;
  pdfOutward: any;
  pdfReturn: any;
}

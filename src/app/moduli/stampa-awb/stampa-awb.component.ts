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
    this.route.queryParams.subscribe((params: any) => {
      if (params.uuid) {
        this.checkPayment(params.uuid).subscribe((res: any) => {
          console.log(res);
          this.getShipments(
            res.session.outwardShipmentID,
            res.session.returnShipmentID
          );
        });
      } else {
        this.getShipments(
          this.store.outwardShipment.id,
          this.store.returnShipment.id
        );
      }
    });
    // setTimeout(() => {
    //   this.getShipments();
    // }, 500);

    /* 
          .subscribe((res: any) => {
        this.store.outwardShipment.id = res.session.outwardShipmentID;
        this.store.returnShipment.id = res.session.returnShipmentID;
        console.log(res);
        console.log(this.store.outwardShipment);
      }); */
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
        // alert(JSON.stringify(response, null, 4));
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
          // alert(JSON.stringify(response, null, 4));
          this.result = response;
          this.b64pdf = this.result.label_pdf[0];
          this.pdfReturn = this.domSanitizer.bypassSecurityTrustUrl(
            "data:application/octet-stream;base64," + this.b64pdf
          );
        });
    }
  }

  awbPrinting() {
    // const byteArray = new Uint8Array(
    //   atob(this.result.label_pdf[0])
    //     .split("")
    //     .map((char) => char.charCodeAt(0))
    // );
    // this.b64pdf = new Blob([byteArray], { type: "application/pdf" });
  }

  checkPayment(uuid: string) {
    const headers = { "x-api-key": this.store.token };
    return this.http.get(
      environment.API_URL +
        "/testbed" +
        "/resoFacile/payment/display/monetaweb?uuid=" +
        uuid,
      { headers: headers }
    );
  }

  result: any;
  b64pdf: any;
  pdfOutward: any;
  pdfReturn: any;
  displayPayment: any;
}

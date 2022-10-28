import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StoreService } from "../store.service";

@Component({
  selector: "app-error-payment",
  templateUrl: "./error-payment.component.html",
})
export class ErrorPaymentComponent {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private store: StoreService
  ) {
    // this.route.queryParams.subscribe((params: any) => {
    //   if (params.uuid) {
    //     this.checkPayment(params.uuid, params.instance);
    //   }
    // });
   
  }

  /*   checkPayment(uuid: any, instance: any) {
    this.http
      .get(
        environment.API_URL +
          instance +
          "/resoFacile/payment/recovery/monetaweb?uuid=" +
          uuid
      )
      .subscribe((response: any) => {
        this.result = response;
      });
  }
  result: any; */
}

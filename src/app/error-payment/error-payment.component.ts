import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/app/enviroment";

@Component({
  selector: 'app-error-payment',
  templateUrl: './error-payment.component.html',
})

export class ErrorPaymentComponent {
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    // this.route.queryParams.subscribe((params: any) => {
    //   if (params.uuid) {
    //     this.checkPayment(params.uuid);
    //   }
    // });
  }

  checkPayment(uuid: any) {
    this.http
      .get(
        environment.API_URL +
          "testbed" + //TODO da cambiare col token
          "/resoFacile/payment/recovery/monetaweb?uuid=" +
          uuid
      )
      .subscribe((response: any) => {
        this.result = response;
      });
  }


  result: any;
  
}

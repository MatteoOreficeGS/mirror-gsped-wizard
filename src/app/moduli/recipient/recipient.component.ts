import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-recipient",
  templateUrl: "./recipient.component.html",
})
export class RecipientComponent implements OnInit {
  constructor(public router: Router, public status: StatusService) {
  this.stepSrc = this.status.stepSource;
  }

  ngOnInit(): void {
    this.status.getConfiguration().subscribe(
      (res) => (
        (this.response = res),
        (this.fields = [
          {
            label: "nome",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_name,
          },
          {
            label: "indirizzo",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_address,
          },
          {
            label: "città",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_city,
          },
          {
            label: "cap",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_cap,
          },
          {
            label: "provincia",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_state,
          },
          {
            label: "nazione",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_country_country,
          },
          {
            label: "email",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_email,
          },
          {
            label: "contact",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_contact,
          },
          {
            label: "cellulare",
            value:
              this.response.configuration?.modules[1].moduleConfig.data
                .rcpt_phone,
          },
        ]),
        console.log(res)
      )
    );
  }

  response: any = {};

  fields: Array<any> = [];

  incrementStep() {
    this.status.incrementStep();
    this.next();
  }

  obj: any = {};

  next() {
    this.fields.forEach((element) => {
      this.obj[element.label] = element.value;
    });
    this.status.setStatus(this.obj, "recipient");
    this.status.changestep(this.step++);
    this.router.navigate(["shipment"]);

  }

  stepSrc?: Subject<number>;
  step:number = 2;
}

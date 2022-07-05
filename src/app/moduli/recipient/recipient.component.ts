import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-recipient",
  templateUrl: "./recipient.component.html",
})
export class RecipientComponent implements OnInit {
  constructor(
    public router: Router,
    public service: StatusService,
    public route: ActivatedRoute
  ) {
    this.stepSrc = this.service.stepSource;
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem("sender")) {
      this.route.queryParams.subscribe((params: any) => {
        if (params.lang) {
          this.router.navigate(["sender"], {
            queryParams: { lang: params.lang },
          });
        }
      });
    }

    //set current module
    this.service.response.subscribe((res: any) => {
      if (!res.configuration) {
        location.reload();
      }
      this.currentModule = res.configuration.modules.filter(
        (module: { moduleName: string }) => module.moduleName === "recipient"
      )[0].moduleConfig;

      this.service.translations.subscribe(
        (labels: any) => {
          // this.labels = res;
          this.fields = [
            {
              value: this.currentModule.data.rcpt_name,
              label: labels.rcpt_name,
              type: "text",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_contact,
              label: labels.rcpt_contact,
              type: "text",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_addr,
              label: labels.rcpt_addr,
              type: "text",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_city,
              label: labels.rcpt_city,
              type: "text",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_cap,
              label: labels.rcpt_cap,
              type: "number",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_prov,
              label: labels.rcpt_prov,
              type: "text",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_country_code,
              label: labels.rcpt_country_code,
              type: "text",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_email,
              label: labels.rcpt_email,
              type: "email",
              required: true,
            },
            {
              value: this.currentModule.data.rcpt_phone,
              label: labels.rcpt_phone,
              type: "number",
              required: false,
            },
            {
              value: this.currentModule.data.rcpt_addr,
              label: labels.rcpt_addr,
              type: "text",
              required: true,
            },
          ];
        },
        (err: any) => {
          //console.log(err);
          this.router.navigate(["/"]);
        }
      );
    });
  }

  response: any = {};
  currentModule: any = {};

  fields: Array<any> = [];

  incrementStep() {
    this.service.incrementStep();
    this.next();
  }

  obj: any = {};

  next() {
    //console.log("fields", this.fields);
    this.fields.forEach((element) => {
      this.obj[element.label] = element.value;
    });
    this.obj = this.currentModule.data;
    sessionStorage.setItem("recipient", JSON.stringify(this.obj));
    this.service.setStatus(this.obj, "recipient");
    this.service.changestep(this.step++);
    this.route.queryParams.subscribe((params: any) => {
      if (params.lang) {
        this.router.navigate(["shipment"], {
          queryParams: { lang: params.lang },
        });
      }
    });
    this.service.changestep(this.step++);
  }

  stepSrc?: Subject<number>;
  step: number = 2;
}

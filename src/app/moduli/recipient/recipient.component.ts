import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Routes } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-recipient",
  templateUrl: "./recipient.component.html",
})
export class RecipientComponent implements OnInit {
  status: any = {};

  constructor(
    public fb: FormBuilder,
    public service: StatusService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.stepSrc = this.service.stepSource;

    this.formRecipient = fb.group({
      rcpt_name: ["", Validators.required],
      rcpt_city: [
        this.service.session.recipient.rcpt_city,
        Validators.required,
      ],
      rcpt_contact: [
        this.service.session.recipient.rcpt_contact,
        Validators.required,
      ],
      rcpt_cap: [this.service.session.recipient.rcpt_cap, Validators.required],
      rcpt_prov: [
        this.service.session.recipient.rcpt_prov,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      rcpt_country_code: [
        this.service.session.recipient.rcpt_country_code,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      rcpt_email: [
        this.service.session.recipient.rcpt_email,
        [Validators.required, Validators.email],
      ],
      rcpt_phone: [
        this.service.session.recipient.rcpt_phone,
        Validators.required,
      ],
      rcpt_addr: [
        this.service.session.recipient.rcpt_addr,
        Validators.required,
      ],
    });

    //set current module
    this.service.response.subscribe((res: any) => {
      // console.log(res);
      this.currentModule = res.configuration.modules.filter(
        (module: { moduleName: string }) => module.moduleName === "recipient"
      )[0].moduleConfig;
      console.log(this.currentModule);
      this.editable = this.currentModule.editable;
      Object.keys(this.currentModule.data).forEach((element: any) => {
        console.log(element);

        this.formRecipient.controls[element].setValue(
          this.currentModule.data[element]
        );
      });
    });

    // form init and validation

    this.autocomplete = this.currentModule.autocomplete;

    this.labels =
      JSON.parse(sessionStorage.getItem("translations") || "{}") || {};

    this.fields = [
      {
        value: "rcpt_name",
        label: this.labels.rcpt_name,
        type: "text",
        required: true,
      },
      {
        value: "rcpt_contact",
        label: this.labels.rcpt_contact,
        type: "text",
        required: true,
      },
      {
        value: "rcpt_addr",
        label: this.labels.rcpt_addr || "rcpt_addr",
        type: "text",
        required: true,
      },
      {
        value: "rcpt_city",
        label: this.labels.rcpt_city,
        type: "text",
        required: true,
      },
      {
        value: "rcpt_cap",
        label: this.labels.rcpt_cap,
        type: "number",
        required: true,
      },
      {
        value: "rcpt_prov",
        label: this.labels.rcpt_prov,
        type: "text",
        required: true,
      },
      {
        value: "rcpt_country_code",
        label: this.labels.rcpt_country_code,
        type: "text",
        required: true,
      },
      {
        value: "rcpt_email",
        label: this.labels.rcpt_email,
        type: "email",
        required: true,
      },
      {
        value: "rcpt_phone",
        label: this.labels.rcpt_phone,
        type: "number",
        required: true,
      },
    ];

    let langParam = "";

    this.route.queryParams.subscribe((params: any) => {
      langParam = params.lang;
    });
  }

  ngOnInit() {
    /* this.service.translations.subscribe((message: any) => {
      console.log(message);
      if (message !== "this.myVar") {
        console.log("123");
      } else {
        console.log(321);
      }
    }); */
  }

  googlePlace(address: HTMLInputElement) {
    if (address.value.length > 3) {
      this.showPredictions === false &&
        (this.showPredictions = true) /* : null */;
      this.service
        .getGooglePlace(address.value, "it")
        .subscribe((response: any) => {
          this.predictionsAddress = [];
          response.predictions.map((prediction: any) =>
            this.predictionsAddress.push({
              terms: prediction.terms,
              description: prediction.description,
            })
          );
          console.log(this.predictionsAddress);

          // console.log((JSON.parse(response[0].replaceAll("\n", ""))))
        });
      // console.log(address.value);
    }
  }

  labels: any = {};
  showPredictions: boolean = false;
  autocomplete: boolean = false;
  currentModule: any = {};
  predictionsAddress: Array<any> = [];
  fields: Array<any> = [];
  editable?: boolean;
  formRecipient: FormGroup;

  //Local Variable defined
  formattedaddress = " ";
  options: any = {
    types: ["address"],
    componentRestrictions: { country: ["it"] },
  };

  setAddress(prediction: any) {
    console.log(prediction);
    this.formRecipient.controls["rcpt_addr"].setValue(prediction);
    this.showPredictions = false;
  }

  nextStep() {
    if (this.formRecipient.valid) {
      sessionStorage.setItem(
        "recipient",
        JSON.stringify(this.formRecipient.value)
      );
      this.service.setStatus(this.formRecipient.value, "recipient");
      this.service.incrementStep();
      this.route.queryParams.subscribe((params: any) => {
        if (params.lang || true) {
          this.router.navigate(["shipment"], {
            queryParams: { lang: params.lang },
          });
        }
      });
      this.service.changestep(this.step++);
    }
  }

  stepSrc?: Subject<number>;
  step: number = 1;
}

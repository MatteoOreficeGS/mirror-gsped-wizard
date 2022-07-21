import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Routes } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-recipient",
  templateUrl: "./recipient.component.html",
})
export class RecipientComponent {
  status: any = {};

  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public service: StatusService,
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formRecipient = fb.group({
      rcpt_name: [store.recipient?.rcpt_city, Validators.required],
      rcpt_city: [store.recipient?.rcpt_city, Validators.required],
      rcpt_contact: [store.recipient?.rcpt_contact, Validators.required],
      rcpt_cap: [store.recipient?.rcpt_cap, Validators.required],
      rcpt_prov: [
        store.recipient?.rcpt_prov,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      rcpt_country_code: [
        store.recipient?.rcpt_country_code,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      rcpt_email: [
        store.recipient?.rcpt_email,
        [Validators.required, Validators.email],
      ],
      rcpt_phone: [store.recipient?.rcpt_phone, Validators.required],
      rcpt_addr: [store.recipient?.rcpt_addr, Validators.required],
    });

    //set current module
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "recipient"
    )[0].moduleConfig;
    this.editable = this.currentModule.editable;
    Object.keys(this.currentModule.data).forEach((element: any) => {
      if (this.currentModule.data[element]) {
        this.formRecipient.controls[element].setValue(
          this.currentModule.data[element]
        );
      }
    });

    // form init and validation

    this.autocomplete = this.currentModule.autocomplete;

    this.labels = store.translations;

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

  googlePlace(address: HTMLInputElement, lang: string = "it") {
    const decoded: any = this.store.decodedToken;
    console.log(decoded);
    this.predictionsAddress = [];
    this.showPredictions === false && (this.showPredictions = true);
    return this.http
      .get(
        "https://api.gsped.it/" +
          decoded.instance +
          "/AddressAutocomplete?input=" +
          address.value +
          "&lang=" +
          lang,
        { headers: { "X-API-KEY": this.store.token } }
      )
      .subscribe((response: any) => {
        this.predictionsAddress = response;
        console.log(this.predictionsAddress);
      });
  }

  labels: any = {};
  showPredictions: boolean = false;
  autocomplete: boolean = false;
  editable?: boolean;
  currentModule: any = {};
  predictionsAddress: Array<any> = [];
  fields: Array<any> = [];
  formRecipient: FormGroup;

  setAddress(prediction: any) {
    console.log(prediction);
    this.formRecipient.controls["rcpt_addr"].setValue(
      prediction.street + " " + prediction.streetNumber
    );
    this.formRecipient.controls["rcpt_cap"].setValue(prediction.postalCode);
    this.formRecipient.controls["rcpt_city"].setValue(prediction.city);
    this.formRecipient.controls["rcpt_prov"].setValue(prediction.district);
    this.formRecipient.controls["rcpt_country_code"].setValue(
      prediction.country
    );
    this.showPredictions = false;
  }

  nextStep() {
    if (this.formRecipient.valid) {
      this.store.recipient = this.formRecipient.value;
      this.router.navigate([this.store.modules[this.store.currentStep++]], {
        queryParamsHandling: "merge",
      });
    }
  }
}

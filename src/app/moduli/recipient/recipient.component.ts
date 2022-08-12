import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, Routes } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";
import { ValidateEmail, ValidatePhone } from "src/app/libs/validation";

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
    //set current module
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "recipient"
    )[0].moduleConfig;
    this.readonly = !this.currentModule.editable;
    const autocomplete = this.currentModule.autocomplete;
    this.formRecipient = fb.group({
      rcpt_name: [
        autocomplete ? this.currentModule.data.rcpt_name.split(" ")[0] : "",
        Validators.required,
      ],
      rcpt_surname: [
        autocomplete
          ? this.currentModule.data.rcpt_name.split(" ").slice(1).join(" ")
          : "",
        Validators.required,
      ],
      rcpt_city: [
        autocomplete ? this.currentModule.data.rcpt_city : "",
        Validators.required,
      ],
      rcpt_contact: [autocomplete ? this.currentModule.data.rcpt_contact : ""],
      rcpt_cap: [
        autocomplete ? this.currentModule.data.rcpt_cap : "",
        Validators.required,
      ],
      rcpt_prov: [
        autocomplete ? this.currentModule.data.rcpt_prov : "",
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      rcpt_country_code: [
        autocomplete ? this.currentModule.data.rcpt_country_code : "",
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      rcpt_email: [
        autocomplete ? this.currentModule.data.rcpt_email : "",
        [Validators.required, ValidateEmail],
      ],
      rcpt_phone: [
        autocomplete ? this.currentModule.data.rcpt_phone : "",
        [Validators.required, ValidatePhone],
      ],
      rcpt_addr: [
        autocomplete ? this.currentModule.data.rcpt_addr : "",
        Validators.required,
      ],
      rcpt_addr_secondary: "",
    });

    Object.keys(store.recipient).forEach((element: any) => {
      if (store.recipient.hasOwnProperty(element)) {
        if (store.recipient[element] !== this.formRecipient.value[element]) {
          if (element === "rcpt_name") {
            this.formRecipient.controls["rcpt_name"].setValue(
              store.recipient[element].split(" ")[0]
            );
            this.formRecipient.controls["rcpt_surname"].setValue(
              store.recipient[element].split(" ").slice(1).join(" ")
            );
          } else {
            this.formRecipient.controls[element].setValue(
              store.recipient[element]
            );
          }
        }
      }
    });
    // form init and validation

    this.autocomplete = this.currentModule.autocomplete;

    this.labels = store.translations;

    this.fields = [
      {
        value: "rcpt_name",
        label: this.labels.nome,
        type: "text",
        required: true,
        columnspan: 2,
      },
      {
        value: "rcpt_surname",
        label: this.labels.cognome,
        type: "text",
        required: true,
        columnspan: 2,
      },
      {
        value: "rcpt_contact",
        label: this.labels.rcpt_contact,
        type: "text",
        required: false,
        columnspan: 4,
      },
      {
        value: "rcpt_addr",
        label: this.labels.rcpt_addr || "rcpt_addr",
        type: "text",
        required: true,
        columnspan: 2,
      },
      {
        value: "rcpt_addr_secondary",
        label: this.labels.rcpt_addr_secondary || "",
        type: "text",
        required: false,
        columnspan: 2,
      },
      {
        value: "rcpt_city",
        label: this.labels.rcpt_city,
        type: "text",
        required: true,
        columnspan: 1,
      },
      {
        value: "rcpt_cap",
        label: this.labels.rcpt_cap,
        type: "number",
        required: true,
        columnspan: 1,
      },
      {
        value: "rcpt_prov",
        label: this.labels.rcpt_prov,
        type: "text",
        required: true,
        maxlength: 2,
        columnspan: 1,
      },
      {
        value: "rcpt_country_code",
        label: this.labels.rcpt_country_code,
        type: "text",
        required: true,
        maxlength: 2,
        columnspan: 1,
      },
      {
        value: "rcpt_email",
        label: this.labels.rcpt_email,
        type: "email",
        required: true,
        columnspan: 2,
      },
      {
        value: "rcpt_phone",
        label: this.labels.rcpt_phone,
        type: "number",
        required: true,
        columnspan: 2,
      },
    ];

    this.route.queryParams.subscribe((params: any) => {
      this.langParam = params.lang;
    });
  }

  handleGooglePlace(address: HTMLInputElement, lang: string = this.langParam) {
    this.predictionsAddress = [];
    this.showPredictions === false && (this.showPredictions = true);
    this.service.googlePlace(address.value, lang).subscribe((response: any) => {
      this.predictionsAddress = response;
    });
  }

  langParam = "";
  labels: any = {};
  showPredictions: boolean = false;
  autocomplete: boolean = false;
  readonly?: boolean;
  currentModule: any = {};
  predictionsAddress: Array<any> = [];
  fields: Array<any> = [];
  formRecipient: FormGroup;
  showModal: boolean = false;
  errors: any = {};

  setAddress(prediction: any) {
    this.formRecipient.controls["rcpt_addr"].setValue(
      prediction.street +
        (prediction.streetNumber != undefined
          ? " " + prediction.streetNumber
          : "")
    );
    this.formRecipient.controls["rcpt_cap"].setValue(prediction.postalCode);
    this.formRecipient.controls["rcpt_city"].setValue(prediction.city);
    this.formRecipient.controls["rcpt_prov"].setValue(prediction.district);
    this.formRecipient.controls["rcpt_country_code"].setValue(
      prediction.country
    );
    this.showPredictions = false;
  }

  hidePredictions() {
    setTimeout(() => {
      this.showPredictions = false;
    }, 400);
  }

  nextStep() {
    if (this.formRecipient.valid) {
      this.formRecipient.controls["rcpt_name"].setValue(
        (
          this.formRecipient.value.rcpt_name +
          " " +
          this.formRecipient.value.rcpt_surname
        ).slice(0, 50)
      );
      this.store.recipientExtras.rcpt_surname =
        this.formRecipient.value.rcpt_surname;
      delete this.formRecipient.value.rcpt_surname;

      this.formRecipient.controls["rcpt_addr"].setValue(
        (
          this.formRecipient.value.rcpt_addr +
          " " +
          this.formRecipient.value.rcpt_addr_secondary
        ).slice(0, 50)
      );
      this.store.recipientExtras.rcpt_addr_secondary =
        this.formRecipient.value.rcpt_addr_secondary;
      delete this.formRecipient.value.rcpt_addr_secondary;

      this.store.recipient = this.formRecipient.value;
      this.router.navigate(
        [this.store.modules[this.store.currentStep++].module],
        {
          queryParamsHandling: "merge",
        }
      );
    } else {
      this.showModal = true;
      this.errors = this.service.showModal(this.formRecipient);
    }
  }
  setCloseModal(event: boolean) {
    this.showModal = event;
  }
}

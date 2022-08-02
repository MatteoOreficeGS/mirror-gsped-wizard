import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
})
export class SenderComponent {
  status: any = {};

  constructor(
    public fb: FormBuilder,
    public service: StatusService,
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "sender"
    )[0].moduleConfig;
    this.readonly = !this.currentModule.editable;

    this.formSender = fb.group({
      sender_name: [
        this.currentModule.data.sender_name.split(" ")[0],
        Validators.required,
      ],
      sender_surname: [
        this.currentModule.data.sender_name.split(" ").slice(1).join(" "),
        Validators.required,
      ],
      sender_city: [this.currentModule.data.sender_city, Validators.required],
      sender_contact: [this.currentModule.data.sender_contact],
      sender_cap: [this.currentModule.data.sender_cap, Validators.required],
      sender_prov: [
        this.currentModule.data.sender_prov,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_country_code: [
        this.currentModule.data.sender_country_code,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_email: [this.currentModule.data.sender_email, [ValidateEmail]],
      sender_phone: [this.currentModule.data.sender_phone, [ValidatePhone]],
      sender_addr: [this.currentModule.data.sender_addr, Validators.required],
      sender_addr_secondary: "",
    });

    Object.keys(store.sender).forEach((element: any) => {
      if (store.sender.hasOwnProperty(element)) {
        if (store.sender[element] !== this.formSender.value[element]) {
          if (element === "sender_name") {
            this.formSender.controls["sender_name"].setValue(
              store.sender[element].split(" ")[0]
            );
            this.formSender.controls["sender_surname"].setValue(
              store.sender[element].split(" ").slice(1).join(" ")
            );
          } else {
            this.formSender.controls[element].setValue(store.sender[element]);
          }
        }
      }
    });

    this.autocomplete = this.currentModule.autocomplete;
    this.labels = store.translations;
    this.fields = [
      {
        value: "sender_name",
        label: this.labels.nome,
        type: "text",
        required: true,
      },
      {
        value: "sender_surname",
        label: this.labels.cognome,
        type: "text",
        required: true,
      },
      {
        value: "sender_contact",
        label: this.labels.sender_contact,
        type: "text",
        required: false,
      },
      {
        value: "sender_addr",
        label: this.labels.sender_addr,
        type: "text",
        required: true,
      },
      {
        value: "sender_addr_secondary",
        label: this.labels.sender_addr_secondary || "indirizzo secondario",
        type: "text",
        required: false,
      },
      {
        value: "sender_city",
        label: this.labels.sender_city,
        type: "text",
        required: true,
      },
      {
        value: "sender_cap",
        label: this.labels.sender_cap,
        type: "number",
        required: true,
      },
      {
        value: "sender_prov",
        label: this.labels.sender_prov,
        type: "text",
        required: true,
        maxLenght: 2,
      },
      {
        value: "sender_country_code",
        label: this.labels.sender_country_code,
        type: "text",
        required: true,
        maxLenght: 2,
      },
      {
        value: "sender_email",
        label: this.labels.sender_email,
        type: "email",
        required: true,
      },
      {
        value: "sender_phone",
        label: this.labels.sender_phone,
        type: "number",
        required: true,
      },
    ];

    this.route.queryParams.subscribe((params: any) => {
      this.langParam = params.lang;
    });
  }

  handleGooglePlace(
    address: HTMLInputElement,
    type: string,
    lang: string = this.langParam
  ) {
    this.predictionsAddress = [];
    this.showPredictions === false && (this.showPredictions = type);
    this.service.googlePlace(address.value, lang).subscribe((response: any) => {
      this.predictionsAddress = response;
    });
  }

  step: any;
  labels: any = {};
  showPredictions: any = false;
  autocomplete: string;
  currentModule: any = {};
  predictionsAddress: any = [];
  fields: Array<any> = [];
  readonly?: boolean;
  formSender: FormGroup;
  langParam = "";

  //Local Variable defined
  formattedaddress = " ";

  setAddress(prediction: any) {
    this.formSender.controls["sender_addr"].setValue(
      prediction.street +
        (prediction.streetNumber != undefined
          ? " " + prediction.streetNumber
          : "")
    );
    this.formSender.controls["sender_cap"].setValue(prediction.postalCode);
    this.formSender.controls["sender_city"].setValue(prediction.city);
    this.formSender.controls["sender_prov"].setValue(prediction.district);
    this.formSender.controls["sender_country_code"].setValue(
      prediction.country
    );
    this.showPredictions = false;
  }

  setSingleAddress(prediction: any) {
    this.formSender.controls["sender_addr_secondary"].setValue(
      prediction.toList
    );
    this.showPredictions = false;
  }

  nextStep() {
    if (this.formSender.valid) {
      this.formSender.value.sender_name +=
        " " + this.formSender.value.sender_surname;
      delete this.formSender.value.sender_surname;
      this.store.sender = this.formSender.value;
      this.router.navigate(
        [this.store.modules[this.store.currentStep++].module],
        {
          queryParamsHandling: "merge",
        }
      );
    }
  }
}

function ValidateEmail(
  control: AbstractControl
): { [key: string]: any } | null {
  var validRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;

  if (!control.value.match(validRegex)) {
    return { emailInvalid: true };
  }
  return null;
}

function ValidatePhone(
  control: AbstractControl
): { [key: string]: any } | null {
  var validRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (!control.value.match(validRegex)) {
    return { phoneInvalid: true };
  }
  return null;
}

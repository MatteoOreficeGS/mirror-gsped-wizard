import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
    console.log(this.currentModule);
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
      sender_contact: [
        this.currentModule.data.sender_contact,
        Validators.required,
      ],
      sender_cap: [this.currentModule.data.sender_cap, Validators.required],
      sender_prov: [
        this.currentModule.data.sender_prov,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_country_code: [
        this.currentModule.data.sender_country_code,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_email: [
        this.currentModule.data.sender_email,
        [Validators.required, Validators.email],
      ],
      sender_phone: [this.currentModule.data.sender_phone, Validators.required],
      sender_addr: [this.currentModule.data.sender_addr, Validators.required],
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

    /* this.formSender = fb.group({
      sender_name: [store.sender?.sender_name.split(' ')[0], Validators.required],
      sender_surname: [store.sender?.sender_name.split(' ').slice(1).join(' '), Validators.required],
      sender_city: [store.sender?.sender_city, Validators.required],
      sender_contact: [store.sender?.sender_contact, Validators.required],
      sender_cap: [store.sender?.sender_cap, Validators.required],
      sender_prov: [
        store.sender?.sender_prov,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_country_code: [
        store.sender?.sender_country_code,
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_email: [
        store.sender?.sender_email,
        [Validators.required, Validators.email],
      ],
      sender_phone: [store.sender?.sender_phone, Validators.required],
      sender_addr: [store.sender?.sender_addr, Validators.required],
    });

    Object.keys(this.currentModule.data).forEach((element: any) => {
      if (this.currentModule.data[element]) {
        this.formSender.controls[element].setValue(
          this.currentModule.data[element]
        );
      }
    }); */
    // form init and validation

    this.autocomplete = this.currentModule.autocomplete ? "on" : "off";

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
        required: true,
      },
      {
        value: "sender_addr",
        label: this.labels.sender_addr || "sender_addr",
        type: "text",
        required: true,
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
      },
      {
        value: "sender_country_code",
        label: this.labels.sender_country_code,
        type: "text",
        required: true,
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

    let langParam = "";

    this.route.queryParams.subscribe((params: any) => {
      langParam = params.lang;
    });
  }

  googlePlace(address: HTMLInputElement, lang: string = "it") {
    if (address.value.length >= 10) {
      const decoded: any = this.store.decodedToken;
      this.predictionsAddress = [];
      this.showPredictions === false && (this.showPredictions = true);
      this.http
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
  }
  step: any;
  labels: any = {};
  showPredictions: boolean = false;
  autocomplete: string;
  currentModule: any = {};
  predictionsAddress: any = [];
  fields: Array<any> = [];
  readonly?: boolean;
  formSender: FormGroup;

  //Local Variable defined
  formattedaddress = " ";

  setAddress(prediction: any) {
    console.log(prediction);
    this.formSender.controls["sender_addr"].setValue(
      prediction.street +
      (prediction.streetNumber != undefined ? " " + prediction.streetNumber : "")
    );
    this.formSender.controls["sender_cap"].setValue(prediction.postalCode);
    this.formSender.controls["sender_city"].setValue(prediction.city);
    this.formSender.controls["sender_prov"].setValue(prediction.district);
    this.formSender.controls["sender_country_code"].setValue(
      prediction.country
    );
    this.showPredictions = false;
  }

  nextStep() {
    if (this.formSender.valid) {
      this.formSender.value.sender_name +=
        " " + this.formSender.value.sender_surname;
      delete this.formSender.value.sender_surname;
      this.store.sender = this.formSender.value;
      console.log(this.formSender.value);
      this.router.navigate([this.store.modules[this.store.currentStep++].module], {
        queryParamsHandling: "merge",
      });
    }
  }
}

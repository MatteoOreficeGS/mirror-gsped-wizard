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
    this.step = this.store.modules.filter(
      (module: any) => "/" + module.name === router.url.split("?")[0]
    )[0].step;
    console.log(this.store.sender);
    this.formSender = fb.group({
      sender_name: [store.sender?.sender_name, Validators.required],
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

    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "sender"
    )[0].moduleConfig;
    console.log(this.currentModule);
    this.editable = this.currentModule.editable;
    Object.keys(this.currentModule.data).forEach((element: any) => {
      if (this.currentModule.data[element]) {
        this.formSender.controls[element].setValue(
          this.currentModule.data[element]
        );
      }
    });
    // form init and validation

    this.autocomplete = this.currentModule.autocomplete ? "on" : "off";

    this.labels = store.translations;

    this.fields = [
      {
        value: "sender_name",
        label: this.labels.sender_name,
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
  editable?: boolean;
  formSender: FormGroup;

  //Local Variable defined
  formattedaddress = " ";

  setAddress(prediction: any) {
    console.log(prediction);
    this.formSender.controls["sender_addr"].setValue(
      prediction.street + " " + prediction.streetNumber
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
      this.store.sender = this.formSender.value;
      this.route.queryParams.subscribe((params: any) => {
        if (params.lang || true) {
          this.router.navigate(["recipient"], {
            // TODO cambiare con il vero step successivo
            queryParams: { lang: params.lang },
          });
        }
      });
    }
  }
}

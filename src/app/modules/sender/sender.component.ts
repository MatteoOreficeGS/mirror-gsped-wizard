import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";
import { ValidateEmail, ValidatePhone } from "src/app/libs/validation";

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
    private route: ActivatedRoute
  ) {
    if (this.service.checkConfiguration()) { return; };
    this.service.checkConfiguration()
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "sender"
    )[0].moduleConfig;
    this.readonly = !this.currentModule.editable;
    const autocomplete = this.currentModule.autocomplete;
    this.formSender = fb.group({
      sender_name: [
        autocomplete ? this.currentModule.data.sender_name : "".split(" ")[0],
        Validators.required,
      ],
      sender_surname: [
        autocomplete
          ? this.currentModule.data.sender_name
          : "".split(" ").slice(1).join(" "),
        Validators.required,
      ],
      sender_city: [
        autocomplete ? this.currentModule.data.sender_city : "",
        Validators.required,
      ],
      sender_contact: [
        autocomplete ? this.currentModule.data.sender_contact : "",
      ],
      sender_cap: [
        autocomplete ? this.currentModule.data.sender_cap : "",
        Validators.required,
      ],
      sender_prov: [
        autocomplete ? this.currentModule.data.sender_prov : "",
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_country_code: [
        autocomplete ? this.currentModule.data.sender_country_code : "none",
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      sender_email: [
        autocomplete ? this.currentModule.data.sender_email : "",
        [Validators.required, ValidateEmail],
      ],
      sender_phone: [
        autocomplete ? this.currentModule.data.sender_phone : "",
        [Validators.required, ValidatePhone],
      ],
      sender_addr: [
        autocomplete ? this.currentModule.data.sender_addr : "",
        Validators.required,
      ],
      sender_addr_secondary: "",
      note_sender: [
        this.store.senderExtras.note_sender,
        Validators.maxLength(50),
      ],
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
          } else if (
            element === "sender_addr" &&
            store.senderExtras["sender_addr_secondary"]
          ) {
            this.formSender.controls["sender_addr"].setValue(
              service.getDifference(
                store.sender[element],
                store.senderExtras["sender_addr_secondary"]
              )
            );
            this.formSender.controls["sender_addr_secondary"].setValue(
              store.senderExtras["sender_addr_secondary"]
            );
          } else {
            this.formSender.controls[element].setValue(store.sender[element]);
          }
        }
      }
    });

    this.autocomplete = this.currentModule.autocomplete;
    this.translations = store.translations;
    this.fields = [
      {
        value: "sender_name",
        label: this.translations.nome,
        type: "text",
        required: true,
        columnspan: 2,
      },
      {
        value: "sender_surname",
        label: this.translations.cognome,
        type: "text",
        required: true,
        columnspan: 2,
      },
      {
        value: "sender_contact",
        label: this.translations.sender_contact,
        type: "text",
        required: false,
        columnspan: 4,
      },
      {
        value: "sender_addr",
        label: this.translations.sender_addr,
        type: "text",
        required: true,
        columnspan: 2,
      },
      {
        value: "sender_addr_secondary",
        label: this.translations.sender_addr + " 2",
        type: "text",
        required: false,
        columnspan: 2,
      },
      {
        value: "sender_city",
        label: this.translations.sender_city,
        type: "text",
        required: true,
        columnspan: 1,
        autocompleteLock: true,
      },
      {
        value: "sender_cap",
        label: this.translations.sender_cap,
        type: "number",
        required: true,
        columnspan: 1,
      },
      {
        value: "sender_prov",
        label: this.translations.sender_prov,
        type: "text",
        required: true,
        maxLenght: 2,
        autocompleteLock: true,
        columnspan: 1,
      },
      {
        value: "sender_country_code",
        label: this.translations.sender_country_code,
        type: "text",
        required: true,
        maxLenght: 2,
        autocompleteLock: true,
        columnspan: 1,
      },
      {
        value: "sender_email",
        label: this.translations.sender_email,
        type: "email",
        required: true,
        columnspan: 2,
      },
      {
        value: "sender_phone",
        label: this.translations.sender_phone,
        type: "number",
        required: true,
        columnspan: 2,
      },
    ];

    if (this.store.noteSenderOnSender) {
      this.fields.push({
        value: "note_sender",
        label: this.translations.note_sender,
        type: "text",
        required: false,
        columnspan: 4,
      });
    }

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

  step: any;
  translations: any = {};
  showPredictions: boolean = false;
  autocomplete: string = "";
  currentModule: any = {};
  predictionsAddress: any = [];
  fields: Array<any> = [];
  readonly?: boolean;
  formSender!: FormGroup;
  langParam = "";
  showModal: boolean = false;
  errors: any = {};

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
    this.fields = this.fields.map((field: any) => {
      if (field.autocompleteLock) {
        field.readonly = true;
      }
      return field;
    });
    this.showPredictions = false;
  }

  hidePredictions() {
    this.fields = this.fields.map((field: any) => {
      field.readonly = false;
      return field;
    });
    setTimeout(() => {
      this.showPredictions = false;
    }, 400);
  }

  nextStep() {
    if (this.formSender.valid) {
      this.formSender.controls["sender_name"].setValue(
        (
          this.formSender.value.sender_name +
          " " +
          this.formSender.value.sender_surname
        ).slice(0, 50)
      );
      this.store.senderExtras.sender_surname =
        this.formSender.value.sender_surname;
      this.formSender.removeControl("sender_surname");

      this.formSender.controls["sender_addr"].setValue(
        (
          this.formSender.value.sender_addr +
          " " +
          this.formSender.value.sender_addr_secondary
        ).slice(0, 50)
      );
      this.store.senderExtras.sender_addr_secondary =
        this.formSender.value.sender_addr_secondary;
      this.formSender.removeControl("sender_addr_secondary");
      if (this.store.noteSenderOnSender) {
        this.store.senderExtras.note_sender = this.formSender.value.note_sender;
      }
      this.formSender.removeControl("note_sender");

      this.store.sender = this.formSender.value;
      this.router.navigate(
        [this.store.modules[this.store.currentStep++].module],
        {
          queryParamsHandling: "merge",
        }
      );
    } else {
      this.showModal = true;
      this.errors = this.service.showModal(this.formSender);
    }
  }
  setCloseModal(event: boolean) {
    this.showModal = event;
  }
}

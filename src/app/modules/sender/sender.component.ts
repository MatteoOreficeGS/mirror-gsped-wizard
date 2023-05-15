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
    if (this.service.checkConfiguration()) {
      return;
    }
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "sender"
    )[0].moduleConfig;
    this.forcedCountry = this.currentModule.forcedCountry || "none";
    this.readonly = !this.currentModule.editable;
    const autocomplete = this.currentModule.autocomplete;
    this.formSender = fb.group({
      sender_name: [
        autocomplete ? this.currentModule.data.sender_name : "".split(" ")[0],
        [
          this.isMandatory("sender_name")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      sender_surname: [
        autocomplete
          ? this.currentModule.data.sender_name.split(" ").slice(1).join(" ")
          : "",
        [
          this.isMandatory("sender_name")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      sender_city: [
        autocomplete ? this.currentModule.data.sender_city : "",
        [
          this.isMandatory("sender_city")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      sender_contact: [
        autocomplete ? this.currentModule.data.sender_contact : "",
        [
          this.isMandatory("sender_contact")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      sender_cap: [
        autocomplete ? this.currentModule.data.sender_cap : "",
        [
          this.isMandatory("sender_cap")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      sender_prov: [
        autocomplete ? this.currentModule.data.sender_prov : "",
        [
          this.isMandatory("sender_prov")
            ? Validators.required
            : Validators.nullValidator,
          Validators.maxLength(2),
          Validators.minLength(2),
        ],
      ],
      sender_country_code: [
        this.forcedCountry !== "none"
          ? this.forcedCountry
          : autocomplete
          ? this.currentModule.data.sender_country_code
            ? this.currentModule.data.sender_country_code
            : "none"
          : "none",
        [
          this.isMandatory("sender_country_code")
            ? Validators.required
            : Validators.nullValidator,
          Validators.maxLength(2),
          Validators.minLength(2),
        ],
      ],
      sender_email: [
        autocomplete ? this.currentModule.data.sender_email : "",
        [
          this.isMandatory("sender_email")
            ? Validators.required
            : Validators.nullValidator,
          ValidateEmail,
        ],
      ],
      sender_phone: [
        autocomplete ? this.currentModule.data.sender_phone : "",
        [
          this.isMandatory("sender_phone")
            ? Validators.required
            : Validators.nullValidator,
          ValidatePhone,
        ],
      ],
      sender_addr: [
        autocomplete ? this.currentModule.data.sender_addr : "",
        [
          this.isMandatory("sender_addr")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      sender_addr_secondary: [
        "",
        [
          this.isMandatory("sender_addr_secondary")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      note_sender: [
        this.store.senderExtras.note_sender,
        [
          this.isMandatory("note_sender")
            ? Validators.required
            : Validators.nullValidator,
          Validators.maxLength(50),
        ],
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
        required: this.isMandatory("sender_name"),
        columnspan: 2,
      },
      {
        value: "sender_surname",
        label: this.translations.cognome,
        type: "text",
        required: this.isMandatory("sender_name"),
        columnspan: 2,
      },
      {
        value: "sender_contact",
        label: this.translations.sender_contact,
        type: "text",
        required: this.isMandatory("sender_contact"),
        columnspan: 4,
      },
      {
        value: "sender_addr",
        label: this.translations.sender_addr,
        type: "text",
        required: this.isMandatory("sender_addr"),
        columnspan: 2,
      },
      {
        value: "sender_addr_secondary",
        label: this.translations.sender_addr + " 2",
        type: "text",
        required: this.isMandatory("sender_addr_secondary"),
        columnspan: 2,
      },
      {
        value: "sender_city",
        label: this.translations.sender_city,
        type: "text",
        required: this.isMandatory("sender_city"),
        columnspan: 1,
        autocompleteLock: true,
      },
      {
        value: "sender_cap",
        label: this.translations.sender_cap,
        type: "number",
        required: this.isMandatory("sender_cap"),
        columnspan: 1,
      },
      {
        value: "sender_prov",
        label: this.translations.sender_prov,
        type: "text",
        required: this.isMandatory("sender_prov"),
        maxLenght: 2,
        autocompleteLock: true,
        columnspan: 1,
      },
      {
        value: "sender_country_code",
        label: this.translations.sender_country_code,
        type: "text",
        required: this.isMandatory("sender_country_code"),
        maxLenght: 2,
        autocompleteLock: true,
        columnspan: 1,
      },
      {
        value: "sender_email",
        label: this.translations.sender_email,
        type: "email",
        required: this.isMandatory("sender_email"),
        columnspan: 2,
      },
      {
        value: "sender_phone",
        label: this.translations.sender_phone,
        type: "number",
        required: this.isMandatory("sender_phone"),
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
      let filterd = response;
      if (this.forcedCountry !== "none") {
        filterd = response.filter(
          (address: any) => address.country === this.forcedCountry
        );
      }
      this.predictionsAddress = filterd;
    });
  }

  isMandatory(field: string): boolean {
    if (!this.currentModule.mandatory) {
      return false;
    }
    if (this.currentModule.mandatory.includes(field)) {
      return true;
    }
    return false;
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
  forcedCountry: string = "none";
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
    this.forcedCountry === "none" &&
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

  setParty(party: any, index: number) {
    this.store.sender = party;
    this.currentModule.fixedData = this.currentModule.fixedData.map(
      (fixedDataItem: any) => {
        return { ...fixedDataItem, selected: false };
      }
    );
    this.currentModule.fixedData[index].selected = true;
  }

  nextStep() {
    if (!this.currentModule.useFixedData) {
      if (!this.formSender.valid) {
        this.showModal = true;
        this.errors = this.service.showModal(this.formSender);
        return;
      }
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
    } else {
      if (!this.isFixedDataSelected(this.currentModule.fixedData)) {
        this.showModal = true;
        //TODO: TRADUZIONE
        this.errors = { erorr: "seleziona una card" };
        return;
      }
    }

    this.router.navigate(
      [this.store.modules[this.store.currentStep++].module],
      {
        queryParamsHandling: "merge",
      }
    );
  }

  setCloseModal(event: boolean) {
    this.showModal = event;
  }

  isFixedDataSelected(fixedData: any): boolean {
    if (!this.currentModule.useFixedData) {
      return true;
    }
    return fixedData.some((fixedDataItem: any) => fixedDataItem.selected);
  }
  canContinue(): boolean {
    if (this.currentModule.useFixedData) {
      return this.isFixedDataSelected(this.currentModule.fixedData);
    } else {
      return this.formSender.valid;
    }
  }
}

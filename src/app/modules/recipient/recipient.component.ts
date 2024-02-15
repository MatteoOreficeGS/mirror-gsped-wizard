import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ValidateEmail, ValidatePhone } from "src/app/libs/validation";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-recipient",
  templateUrl: "./recipient.component.html",
})
export class RecipientComponent {
  status: any = {};

  constructor(
    public fb: UntypedFormBuilder,
    public http: HttpClient,
    public service: StatusService,
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }
    //set current module
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "recipient"
    )[0].moduleConfig;
    this.forcedCountry = this.currentModule.forcedCountry || "none";
    this.readonly = !this.currentModule.editable;
    const autocomplete = this.currentModule.autocomplete;
    this.formRecipient = fb.group({
      rcpt_name: [
        autocomplete ? this.currentModule.data.rcpt_name.split(" ")[0] : "",
        [
          this.isMandatory("rcpt_name")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      rcpt_surname: [
        autocomplete
          ? this.currentModule.data.rcpt_name.split(" ").slice(1).join(" ")
          : "",
        [
          this.isMandatory("rcpt_name")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      rcpt_city: [
        autocomplete ? this.currentModule.data.rcpt_city : "",
        [
          this.isMandatory("rcpt_city")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      rcpt_contact: [
        autocomplete ? this.currentModule.data.rcpt_contact : "",
        [
          this.isMandatory("rcpt_contact")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      rcpt_cap: [
        autocomplete ? this.currentModule.data.rcpt_cap : "",
        [
          this.isMandatory("rcpt_cap")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      rcpt_prov: [
        autocomplete ? this.currentModule.data.rcpt_prov : "",
        [
          this.isMandatory("rcpt_prov")
            ? Validators.required
            : Validators.nullValidator,
          Validators.maxLength(2),
          Validators.minLength(2),
        ],
      ],
      rcpt_country_code: [
        this.forcedCountry !== "none"
          ? this.forcedCountry
          : autocomplete
          ? this.currentModule.data.rcpt_country_code
            ? this.currentModule.data.rcpt_country_code
            : "none"
          : "none",
        [
          this.isMandatory("rcpt_country_code")
            ? Validators.required
            : Validators.nullValidator,
          Validators.maxLength(2),
          Validators.minLength(2),
        ],
      ],
      rcpt_email: [
        autocomplete ? this.currentModule.data.rcpt_email : "",
        [
          this.isMandatory("rcpt_email")
            ? Validators.required
            : Validators.nullValidator,
          ValidateEmail,
        ],
      ],
      rcpt_phone: [
        autocomplete ? this.currentModule.data.rcpt_phone : "",
        [
          this.isMandatory("rcpt_phone")
            ? Validators.required
            : Validators.nullValidator,
          ValidatePhone,
        ],
      ],
      rcpt_addr: [
        autocomplete ? this.currentModule.data.rcpt_addr : "",
        [
          this.isMandatory("rcpt_addr")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      rcpt_addr_secondary: [
        "",
        [
          this.isMandatory("rcpt_addr_secondary")
            ? Validators.required
            : Validators.nullValidator,
        ],
      ],
      note_sender: [
        this.store.recipientExtras.note_sender,
        [
          this.isMandatory("note_sender")
            ? Validators.required
            : Validators.nullValidator,
          Validators.maxLength(50),
        ],
      ],
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
          } else if (
            element === "rcpt_addr" &&
            store.recipientExtras["rcpt_addr_secondary"]
          ) {
            this.formRecipient.controls["rcpt_addr"].setValue(
              service.getDifference(
                store.recipient[element],
                store.recipientExtras["rcpt_addr_secondary"]
              )
            );
            this.formRecipient.controls["rcpt_addr_secondary"].setValue(
              store.recipientExtras["rcpt_addr_secondary"]
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

    this.translations = store.translations;

    this.fields = [
      {
        value: "rcpt_name",
        label: this.translations.nome,
        type: "text",
        required: this.isMandatory("rcpt_name"),
        columnspan: 2,
      },
      {
        value: "rcpt_surname",
        label: this.translations.cognome,
        type: "text",
        required: this.isMandatory("rcpt_name"),
        columnspan: 2,
      },
      {
        value: "rcpt_contact",
        label: this.translations.rcpt_contact,
        type: "text",
        required: this.isMandatory("rcpt_contact"),
        columnspan: 4,
      },
      {
        value: "rcpt_addr",
        label: this.translations.rcpt_addr,
        type: "text",
        required: this.isMandatory("rcpt_addr"),
        columnspan: 2,
      },
      {
        value: "rcpt_addr_secondary",
        label: this.translations.rcpt_addr + " 2",
        type: "text",
        required: this.isMandatory("rcpt_addr_secondary"),
        columnspan: 2,
      },
      {
        value: "rcpt_country_code",
        label: this.translations.rcpt_city,
        type: "text",
        required: this.isMandatory("rcpt_country_code"),
        maxLenght: 2,
        autocompleteLock: true,
        columnspan: 1,
      },
      {
        value: "rcpt_city",
        label: this.translations.rcpt_city,
        type: "text",
        required: this.isMandatory("rcpt_city"),
        columnspan: 1,
        autocompleteLock: true,
      },
      {
        value: "rcpt_cap",
        label: this.translations.rcpt_cap,
        type: "number",
        required: this.isMandatory("rcpt_cap"),
        columnspan: 1,
      },
      {
        value: "rcpt_prov",
        label: this.translations.rcpt_prov,
        type: "text",
        required: this.isMandatory("rcpt_prov"),
        maxLenght: 2,
        autocompleteLock: true,
        columnspan: 1,
      },
      {
        value: "rcpt_email",
        label: this.translations.rcpt_email,
        type: "email",
        required: this.isMandatory("rcpt_email"),
        columnspan: 2,
      },
      {
        value: "rcpt_phone",
        label: this.translations.rcpt_phone,
        type: "number",
        required: this.isMandatory("rcpt_phone"),
        columnspan: 2,
      },
    ];

    if (!this.store.noteSenderOnSender) {
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

  handleAddressAutocomplete(
    address: HTMLInputElement,
    value: string,
  ) {
    if (!["rcpt_city", "rcpt_cap"].includes(value)) return;
    const type = value === "rcpt_city" ? "city" : "zipcode";
    this.showPredictions = value;
    this.predictionsAddress = [];
    const _lang = this.formRecipient.value.rcpt_country_code;
    this.service
      .addressAutocomplete(address.value, type, _lang)
      .subscribe((response: any) => {
        let filterd = response;
        this.predictionsAddress = filterd.slice(0, 4);
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

  langParam = "";
  translations: any = {};
  showPredictions: boolean | string = false;
  autocomplete: string = "";
  readonly?: boolean;
  currentModule: any = {};
  predictionsAddress: Array<any> = [];
  fields: Array<any> = [];
  formRecipient!: UntypedFormGroup;
  forcedCountry: string = "none";
  showModal: boolean = false;
  errors: any = {};

  setAddress(prediction: any) {
    this.formRecipient.controls["rcpt_cap"].setValue(prediction.postalCode);
    this.formRecipient.controls["rcpt_city"].setValue(prediction.city);
    this.formRecipient.controls["rcpt_prov"].setValue(prediction.district);
    this.formRecipient.controls["rcpt_country_code"].setValue(prediction.country);
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

  saveData() {
    this.formRecipient.controls["rcpt_name"].setValue(
      (
        this.formRecipient.value.rcpt_name +
        " " +
        this.formRecipient.value.rcpt_surname
      ).slice(0, 50)
    );
    this.store.recipientExtras.rcpt_surname =
      this.formRecipient.value.rcpt_surname;
    this.formRecipient.removeControl("rcpt_surname");

    this.formRecipient.controls["rcpt_addr"].setValue(
      (
        this.formRecipient.value.rcpt_addr +
        " " +
        this.formRecipient.value.rcpt_addr_secondary
      ).slice(0, 50)
    );
    this.store.recipientExtras.rcpt_addr_secondary =
      this.formRecipient.value.rcpt_addr_secondary;
    this.formRecipient.removeControl("rcpt_addr_secondary");

    if (!this.store.noteSenderOnSender) {
      this.store.recipientExtras.note_sender =
        this.formRecipient.value.note_sender;
    }
    this.formRecipient.removeControl("note_sender");

    this.store.recipient = this.formRecipient.value;
  }
  setParty(party: any, index: number) {
    this.store.recipient = party;
    this.currentModule.fixedData = this.currentModule.fixedData.map(
      (fixedDataItem: any) => {
        return { ...fixedDataItem, selected: false };
      }
    );
    this.currentModule.fixedData[index].selected = true;
  }

  nextStep() {
    if (!this.currentModule.useFixedData) {
      if (!this.formRecipient.valid) {
        this.showModal = true;
        this.errors = this.service.showModal(this.formRecipient);
        return;
      }
      this.saveData();
    } else {
      if (!this.isFixedDataSelected(this.currentModule.fixedData)) {
        this.showModal = true;
        this.errors = {
          error: this.store.translations.lbl_card_required_recipient,
        };
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
      return this.formRecipient.valid;
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";
import {
  ValidateCF,
  ValidateEmail,
  ValidateEsteroCountry,
  ValidatePhone,
  ValidatePIva,
} from "src/app/libs/validation";

@Component({
  selector: "app-fattura-dhl",
  templateUrl: "./fattura-dhl.component.html",
})
export class FatturaDHLComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    private router: Router,
    public store: StoreService,
    public service: StatusService
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "fatturaDHL"
    )[0].moduleConfig;
    this.translations = this.store.translations;
    this.selected = this.store.invoiceType ? this.store.invoiceType : "privato";
    this.setInvoiceModules(this.selected);
  }

  ngOnInit(): void {}

  currentModule: any = {};
  formInvoice: FormGroup = this.fb.group({});
  selected!: string;
  invoiceModules: any;
  predictionsAddress: any;
  showPredictions: boolean = false;
  otherType: string =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  currentType: any =
    "border-red-dhl text-red-dhl-dark w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  errors: any = {};
  showModal: boolean = false;
  translations: any = {};

  handleSetInvoiceModules(type: string) {
    if (confirm(this.translations.lbl_invoice_warning)) {
      this.setInvoiceModules(type);
    }
  }

  setInvoiceModules(type: string) {
    this.selected = type;

    switch (type) {
      case "privato":
        this.formInvoice = this.fb.group({
          lbl_italian_tax_code: [
            this.store.invoice.lbl_italian_tax_code,
            [Validators.required, ValidateCF],
          ],
          pec: [this.store.invoice.pec, [ValidateEmail]],
          sdi: [
            this.store.invoice.sdi ? this.store.invoice.sdi : "0000000",
            [Validators.maxLength(10)],
          ],
          [this.translations.nome]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_name
            : this.store.sender.sender_name,
          [this.translations.lbl_address]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_addr
            : this.store.sender.sender_addr,
          [this.translations.lbl_zipcode]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_cap
            : this.store.sender.sender_cap,
          [this.translations.lbl_city]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_city
            : this.store.sender.sender_city,
          [this.translations.lbl_prov]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_prov
            : this.store.sender.sender_prov,
          [this.translations.lbl_country]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_country_code
            : this.store.sender.sender_country_code,
          type: type,
        });

        this.invoiceModules = [
          {
            value: "lbl_italian_tax_code",
            label: this.translations.lbl_italian_tax_code,
            type: "text",
            required: true,
          },
          {
            value: "pec",
            label: "PEC",
            type: "email",
            required: false,
          },
          { value: "sdi", label: "CFE/SDI", type: "text", required: false },
        ];
        break;
      case "piva":
        this.formInvoice = this.fb.group({
          lbl_vat_number: [
            this.store.invoice.codice_fiscale,
            [Validators.required, ValidatePIva],
          ],
          pec: [this.store.invoice.pec, [ValidateEmail]],
          sdi: [
            this.store.invoice.sdi ? this.store.invoice.sdi : "0000000",
            [Validators.maxLength(10)],
          ],
          [this.translations.nome]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_name
            : this.store.sender.sender_name,
          [this.translations.lbl_address]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_addr
            : this.store.sender.sender_addr,
          [this.translations.lbl_zipcode]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_cap
            : this.store.sender.sender_cap,
          [this.translations.lbl_city]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_city
            : this.store.sender.sender_city,
          [this.translations.lbl_prov]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_prov
            : this.store.sender.sender_prov,
          [this.translations.lbl_country]: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_country_code
            : this.store.sender.sender_country_code,
          type: type,
        });

        this.invoiceModules = [
          {
            value: "lbl_vat_number",
            label: this.translations.lbl_vat_number,
            type: "text",
            required: true,
          },
          { value: "pec", label: "PEC", type: "email", required: false },
          { value: "sdi", label: "CFE/SDI", type: "text", required: true },
        ];
        break;
      case "estero":
        this.formInvoice = this.fb.group({
          nome: [
            this.store.isSenderPrefilled
              ? this.service.getDifference(
                  this.store.recipient.rcpt_name,
                  this.store.recipientExtras.rcpt_surname
                )
              : this.service.getDifference(
                  this.store.sender.sender_name,
                  this.store.senderExtras.sender_surname
                ),
            Validators.required,
          ],
          cognome: [
            this.store.isSenderPrefilled
              ? this.store.recipientExtras.rcpt_surname
              : this.store.senderExtras.sender_surname,
            Validators.required,
          ],
          lbl_company: "",
          lbl_address: ["", Validators.required],
          lbl_country: ["KOKO", [Validators.required, ValidateEsteroCountry]],
          lbl_zipcode: ["", Validators.required],
          lbl_city: ["", Validators.required],
          lbl_prov: ["", Validators.required],
          email: ["", [Validators.required, ValidateEmail]],
          lbl_phone: ["", [Validators.required, ValidatePhone]],
        });
        this.invoiceModules = [
          {
            value: "nome",
            label: this.translations.nome,
            type: "text",
            required: true,
            columnspan: 2,
          },
          {
            value: "cognome",
            label: this.translations.cognome,
            type: "text",
            required: true,
            columnspan: 2,
          },
          {
            value: "lbl_company",
            label: this.translations.lbl_company,
            type: "text",
            required: false,
            columnspan: 4,
          },
          {
            value: "lbl_address",
            label: this.translations.lbl_address,
            type: "text",
            required: true,
            columnspan: 4,
          },
          {
            value: "lbl_zipcode",
            label: this.translations.lbl_zipcode,
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "lbl_city",
            label: this.translations.lbl_city,
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "lbl_prov",
            label: this.translations.lbl_prov,
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "lbl_country",
            label: this.translations.lbl_country,
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "email",
            label: "e-mail",
            type: "email",
            required: true,
            columnspan: 2,
          },
          {
            value: "lbl_phone",
            label: this.translations.lbl_phone,
            type: "text",
            required: true,
            columnspan: 2,
          },
        ];
        break;
    }
  }

  handleGooglePlace(address: HTMLInputElement) {
    this.predictionsAddress = [];
    this.showPredictions === false && (this.showPredictions = true);
    this.service.googlePlace(address.value, "it").subscribe((response: any) => {
      this.predictionsAddress = response;
    });
  }
  setAddress(prediction: any) {
    this.formInvoice.controls["indirizzo"].setValue(
      prediction.street +
        (prediction.streetNumber != undefined
          ? " " + prediction.streetNumber
          : "")
    );
    this.formInvoice.controls["cap"].setValue(prediction.postalCode);
    this.formInvoice.controls["citta"].setValue(prediction.city);
    this.formInvoice.controls["nazione"].setValue(prediction.country);
    this.showPredictions = false;
  }

  nextStep() {
    if (this.formInvoice.valid) {
      if (this.selected === "estero") {
        this.formInvoice.controls["nome"].setValue(
          this.formInvoice.value.nome + " " + this.formInvoice.value.cognome
        );
        this.formInvoice.removeControl("cognome");
        this.store.invoice = this.formInvoice.value;
      } else {
        this.store.invoice = this.formInvoice.value;
        if (this.formInvoice.value.hasOwnProperty("lbl_vat_number")) {
          this.store.invoice.codice_fiscale =
            this.formInvoice.value.lbl_vat_number;
          delete this.store.invoice.lbl_vat_number;
        }
        if (this.formInvoice.value.hasOwnProperty("lbl_italian_tax_code")) {
          this.store.invoice.codice_fiscale =
            this.formInvoice.value.lbl_italian_tax_code.toUpperCase();
          delete this.store.invoice.lbl_italian_tax_code;
        }
        this.store.invoice["email"] = this.store.isSenderPrefilled
          ? this.store.recipient.rcpt_email
          : this.store.sender.sender_email;
      }
      this.store.invoiceType = this.selected;
      this.router.navigate(
        [this.store.modules[this.store.currentStep++].module],
        {
          queryParamsHandling: "merge",
        }
      );
    } else {
      this.showModal = true;
      this.errors = this.service.showModal(this.formInvoice);
    }
  }
  setCloseModal(event: boolean) {
    this.showModal = event;
  }
}

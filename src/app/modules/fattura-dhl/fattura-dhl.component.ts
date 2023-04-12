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
    this.store.translations = this.store.translations;
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

  handleSetInvoiceModules(type: string) {
    if (confirm(this.store.translations.lbl_invoice_warning)) {
      this.setInvoiceModules(type);
    }
  }

  setInvoiceModules(type: string) {
    this.selected = type;

    switch (type) {
      case "privato":
        this.formInvoice = this.fb.group({
          codice_fiscale: [
            this.store.invoice.lbl_italian_tax_code,
            [Validators.required, ValidateCF],
          ],
          pec: [this.store.invoice.pec, [ValidateEmail]],
          sdi: [
            this.store.invoice.sdi ? this.store.invoice.sdi : "0000000",
            [Validators.maxLength(10)],
          ],
          nome: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_name
            : this.store.sender.sender_name,
          indirizzo: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_addr
            : this.store.sender.sender_addr,
          cap: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_cap
            : this.store.sender.sender_cap,
          citta: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_city
            : this.store.sender.sender_city,
          provincia: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_prov
            : this.store.sender.sender_prov,
          nazione: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_country_code
            : this.store.sender.sender_country_code,
          type: type,
        });

        this.invoiceModules = [
          {
            value: "codice_fiscale",
            label: this.store.translations.lbl_italian_tax_code,
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
          codice_fiscale: [
            this.store.invoice.codice_fiscale,
            [Validators.required, ValidatePIva],
          ],
          pec: [this.store.invoice.pec, [ValidateEmail]],
          sdi: [
            this.store.invoice.sdi ? this.store.invoice.sdi : "0000000",
            [Validators.maxLength(10)],
          ],
          nome: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_name
            : this.store.sender.sender_name,
          indirizzo: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_addr
            : this.store.sender.sender_addr,
          cap: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_cap
            : this.store.sender.sender_cap,
          citta: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_city
            : this.store.sender.sender_city,
          provincia: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_prov
            : this.store.sender.sender_prov,
          nazione: this.store.isSenderPrefilled
            ? this.store.recipient.rcpt_country_code
            : this.store.sender.sender_country_code,
          type: type,
        });

        this.invoiceModules = [
          {
            value: "codice_fiscale",
            label: this.store.translations.lbl_vat_number,
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
          societa: "",
          indirizzo: ["", Validators.required],
          nazione: ["none", [Validators.required, ValidateEsteroCountry]],
          cap: ["", Validators.required],
          citta: ["", Validators.required],
          provincia: [""],
          email: ["", [Validators.required, ValidateEmail]],
          telefono: ["", [Validators.required, ValidatePhone]],
        });
        this.invoiceModules = [
          {
            value: "nome",
            label: this.store.translations.nome,
            type: "text",
            required: true,
            columnspan: 2,
          },
          {
            value: "cognome",
            label: this.store.translations.cognome,
            type: "text",
            required: true,
            columnspan: 2,
          },
          {
            value: "societa",
            label: this.store.translations.lbl_company,
            type: "text",
            required: false,
            columnspan: 4,
          },
          {
            value: "indirizzo",
            label: this.store.translations.lbl_address,
            type: "text",
            required: true,
            columnspan: 4,
          },
          {
            value: "cap",
            label: this.store.translations.lbl_zipcode,
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "citta",
            label: this.store.translations.lbl_city,
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "provincia",
            label: this.store.translations.lbl_prov,
            type: "text",
            required: false,
            columnspan: 1,
          },
          {
            value: "nazione",
            label: this.store.translations.lbl_country,
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
            value: "telefono",
            label: this.store.translations.lbl_phone,
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
      // delete this.store.invoice.type;
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

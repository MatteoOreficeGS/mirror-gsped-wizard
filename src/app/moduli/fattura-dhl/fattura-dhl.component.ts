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
    this.selected = this.store.invoiceType ? this.store.invoiceType : "privato";
    this.setInvoiceModules(this.selected);
    this.translations = this.store.translations;
  }

  ngOnInit(): void {}

  formInvoice: FormGroup = this.fb.group({});
  selected: string;
  invoiceModules: any;
  predictionsAddress: any;
  showPredictions: boolean = false;
  otherModule: string =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  currentModule: any =
    "border-red-dhl text-red-dhl-dark w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  errors: any = {};
  showModal: boolean = false;
  translations: any = {};

  handleSetInvoiceModules(type: string) {
    if (
      confirm(
        "Sei sicuro di cambiare modulo? i dati fin'ora inseriti andranno persi"
      )
    ) {
      this.setInvoiceModules(type);
    }
  }

  setInvoiceModules(type: string) {
    this.selected = type;

    switch (type) {
      case "privato":
        this.formInvoice = this.fb.group({
          codice_fiscale: [
            this.store.invoice.codice_fiscale,
            [Validators.required, ValidateCF],
          ],
          pec: [this.store.invoice.pec, [ValidateEmail]],
          sdi: [this.store.invoice.sdi ? this.store.invoice.sdi : "0000000"],
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
          provicia: this.store.isSenderPrefilled
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
            label: this.translations["lbl_italian_tax_code"],
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
            [Validators.required, ValidateCF],
          ],
          pec: [this.store.invoice.pec, [ValidateEmail]],
          sdi: [this.store.invoice.sdi ? this.store.invoice.sdi : "0000000"],
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
          provicia: this.store.isSenderPrefilled
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
            label: "partita iva",
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
          societa: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_contact
              : this.store.sender.sender_contact,
          ],
          indirizzo: [
            this.store.isSenderPrefilled
              ? this.service.getDifference(
                  this.store.recipient.rcpt_addr,
                  this.store.recipientExtras.rcpt_addr_secondary
                )
              : this.service.getDifference(
                  this.store.sender.sender_addr,
                  this.store.senderExtras.sender_addr_secondary
                ),
            Validators.required,
          ],
          nazione: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_country_code
              : this.store.sender.sender_country_code,
            [Validators.required, ValidateEsteroCountry],
          ],
          cap: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_cap
              : this.store.sender.sender_cap,
            Validators.required,
          ],
          citta: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_city
              : this.store.sender.sender_city,
            Validators.required,
          ],
          provincia: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_prov
              : this.store.sender.sender_prov,
            Validators.required,
          ],
          email: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_email
              : this.store.sender.sender_email,
            [Validators.required, ValidateEmail],
          ],
          phone: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_phone
              : this.store.sender.sender_phone,
            [Validators.required, ValidatePhone],
          ],
        });
        this.invoiceModules = [
          {
            value: "nome",
            label: "nome",
            type: "email",
            required: true,
            columnspan: 2,
          },
          {
            value: "cognome",
            label: "cognome",
            type: "text",
            required: true,
            columnspan: 2,
          },
          {
            value: "societa",
            label: "società",
            type: "text",
            required: false,
            columnspan: 4,
          },
          {
            value: "indirizzo",
            label: "indirizzo",
            type: "text",
            required: true,
            columnspan: 4,
          },
          {
            value: "cap",
            label: "CAP",
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "citta",
            label: "Città",
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "provincia",
            label: "Provincia",
            type: "text",
            required: true,
            columnspan: 1,
          },
          {
            value: "nazione",
            label: "nazione",
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
            value: "phone",
            label: "phone",
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
      }
      this.store.invoice = this.formInvoice.value;
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

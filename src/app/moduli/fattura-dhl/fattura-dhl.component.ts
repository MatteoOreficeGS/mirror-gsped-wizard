import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";
import { ValidateEmail, ValidatePhone } from "src/app/libs/validation";

@Component({
  selector: "app-fattura-dhl",
  templateUrl: "./fattura-dhl.component.html",
})
export class FatturaDHLComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private store: StoreService,
    private status: StatusService
  ) {
    this.selected = this.store.invoiceType ? this.store.invoiceType : "privato";
    this.setInvoiceModules(this.selected);
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
        if (!this.store.invoice) {
          this.formInvoice = this.fb.group({
            codice_fiscale: [
              "",
              [Validators.required, Validators.maxLength(16)],
            ],
            pec: ["", [ValidateEmail]],
            sdi: ["0000000"],
            type: type,
          });
        } else {
          this.formInvoice = this.fb.group({
            codice_fiscale: [
              this.store.invoice.codice_fiscale,
              [Validators.required, Validators.maxLength(16)],
            ],
            pec: [this.store.invoice.pec, [ValidateEmail]],
            sdi: [this.store.invoice.sdi],
            type: type,
          });
        }

        this.invoiceModules = [
          {
            value: "codice_fiscale",
            label: "codice fiscale",
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
        if (!this.store.invoice) {
          this.formInvoice = this.fb.group({
            codice_fiscale: [
              "",
              [Validators.required, Validators.maxLength(11)],
            ],
            pec: ["", ValidateEmail],
            sdi: ["", Validators.required],
            type: type,
          });
        } else {
          this.formInvoice = this.fb.group({
            codice_fiscale: [
              this.store.invoice.codice_fiscale,
              [Validators.required, Validators.maxLength(16)],
            ],
            pec: [this.store.invoice.pec, [ValidateEmail]],
            sdi: [this.store.invoice.sdi],
            type: type,
          });
        }

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
              ? this.status.getDifference(
                  this.store.recipient.rcpt_name,
                  this.store.recipientExtras.rcpt_surname
                )
              : this.status.getDifference(
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
              ? this.store.recipient.rcpt_addr
              : this.store.sender.sender_addr,
            Validators.required,
          ],
          nazione: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_country_code
              : this.store.sender.sender_country_code,
            Validators.required,
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
            ValidateEmail,
          ],
          phone: [
            this.store.isSenderPrefilled
              ? this.store.recipient.rcpt_phone
              : this.store.sender.sender_phone,
            ValidatePhone,
          ],
        });
        this.invoiceModules = [
          { value: "nome", label: "nome", type: "email", required: true },
          { value: "cognome", label: "cognome", type: "text", required: true },
          { value: "societa", label: "società", type: "text", required: false },
          {
            value: "indirizzo",
            label: "indirizzo",
            type: "text",
            required: true,
          },
          { value: "nazione", label: "nazione", type: "text", required: true },
          { value: "cap", label: "CAP", type: "text", required: true },
          { value: "citta", label: "Città", type: "text", required: true },
          {
            value: "provincia",
            label: "Provincia",
            type: "text",
            required: true,
          },
          { value: "email", label: "e-mail", type: "email", required: true },
          { value: "phone", label: "phone", type: "text", required: true },
        ];
        break;
    }
  }

  handleGooglePlace(address: HTMLInputElement) {
    this.predictionsAddress = [];
    this.showPredictions === false && (this.showPredictions = true);
    this.status.googlePlace(address.value, "it").subscribe((response: any) => {
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
    if (this.formInvoice.valid && this.formInvoice.controls["nome"] != null) {
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
  }
}

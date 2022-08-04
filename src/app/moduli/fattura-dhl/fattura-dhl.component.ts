import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";
import { ValidateEmail, ValidatePhone } from "src/app/moduli/libs/validation";

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
    this.selected = "privato";
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
    "border-indigo-500 text-indigo-600 w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";

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
          codice_fiscale: ["", [Validators.required, Validators.maxLength(16)]],
          pec: ["", [ValidateEmail]],
          sdi: ["0000000"],
        });
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
        this.formInvoice = this.fb.group({
          codice_fiscale: ["", [Validators.required, Validators.maxLength(11)]],
          pec: ["", ValidateEmail],
          sdi: ["", Validators.required],
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
            this.store.sender.sender_name,
            Validators.required,
          ],
          cognome: [
            this.store.sender.sender_surname,
            Validators.required,
          ],
          societa: [this.store.sender.sender_contact],
          indirizzo: ["", Validators.required],
          nazione: ["", Validators.required],
          cap: ["", Validators.required],
          citta: ["", Validators.required],
          email: [this.store.sender.sender_email, ValidateEmail],
          phone: [this.store.sender.sender_phone, ValidatePhone],
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
          { value: "email", label: "e-mail", type: "email", required: true },
          { value: "phone", label: "phone", type: "text", required: true },
        ];
        break;
    }
  }

  handleGooglePlace(address: HTMLInputElement) {
    console.log(address.value);
    this.predictionsAddress = [];
    this.showPredictions === false && (this.showPredictions = true);
    this.status.googlePlace(address.value, "it").subscribe((response: any) => {
      this.predictionsAddress = response;
      console.log(this.predictionsAddress);
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
    // this.formInvoice.controls["sender_prov"].setValue(prediction.district);
    this.formInvoice.controls["nazione"].setValue(prediction.country);
    this.showPredictions = false;
  }

  nextStep() {
    if (this.formInvoice.valid) {
      this.store.invoice = this.formInvoice.value;
      this.router.navigate(
        [this.store.modules[this.store.currentStep++].module],
        {
          queryParamsHandling: "merge",
        }
      );
    }
  }
}

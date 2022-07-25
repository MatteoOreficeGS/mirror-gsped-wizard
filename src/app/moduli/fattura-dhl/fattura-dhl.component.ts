import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

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
    this.formInvoice = fb.group({
      codice_fiscale: ["", [Validators.required, Validators.maxLength(16)]],
      pec: [""],
      sdi: [""],
    });
  }

  ngOnInit(): void {}

  invoiceModules: any = [
    {
      value: "codice_fiscale",
      label: "codice fiscale",
      type: "text",
      required: true,
      max: 16,
    },
    { value: "pec", label: "PEC", type: "email", required: false },
    { value: "sdi", label: "CFE/SDI", type: "text", required: false },
  ];
  formInvoice: FormGroup;
  selected: string;
  otherModule: string =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  currentModule: any =
    "border-indigo-500 text-indigo-600 w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";

  handleSetInvoiceModules(type: string) {
    if (
      confirm(
        "Sei sucuro di cambaire modulo? i dati fin'ora inseriti andranno persi"
      )
    ) {
      this.setInvoiceModules(type);
    }
  }

  setInvoiceModules(type: string) {
    this.selected = type;
    this.formInvoice = this.fb.group({});
    switch (type) {
      case "privato":
        this.formInvoice = this.fb.group({
          codice_fiscale: ["", [Validators.required, Validators.maxLength(16)]],
          pec: [""],
          sdi: [""],
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
          codice_fiscale: ["", [Validators.required, Validators.maxLength(16)]],
          pec: [""],
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
          nome: ["", Validators.required],
          cognome: ["", Validators.required],
          societa: [""],
          indirizzo: ["", Validators.required],
          nazione: ["", Validators.required],
          cap: ["", Validators.required],
          citta: ["", Validators.required],
          email: ["", Validators.required],
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
        ];
        break;
    }
  }

  nextStep() {
    // TODO settare il form
    if (this.formInvoice.valid) {
      this.store.payloadShipment.fattura_dhl = [this.formInvoice.value];
      this.store.payloadShipment.documenti =
        this.store.configuration.modules[2].moduleConfig.documentFlag;
      this.store.invoice = this.formInvoice.value;
      this.status
        .handleShipment(this.store.payloadShipment)
        .subscribe((res) => {
          this.store.outwardShipment = res;
        });

      console.log(this.store.payloadShipment);
      this.store.payloadShipment = {
        ...this.store.payloadShipment,
        ...this.store.recipient,
      };

      // inverto il mittente con il destinatario per la spedizione di ritorno
      // let returnPayloadShipment: any = {};
      let returnPayloadShipment: any = this.store.payloadShipment;

      // this.store.sender.forEach((element:any) => {
      //   returnPayloadShipment[element]
      // });

      let senderValues = Object.keys(this.store.sender);
      let recipientValues = Object.keys(this.store.recipient);

      // for (let i = 0; i < senderValues.length; i++) {
      // delete returnPayloadShipment[recipientValues[i]];
      // delete returnPayloadShipment[senderValues[i]];
      // }

      let auxReturnPayloadShipment: any = {};

      for (let i = 0; i < senderValues.length; i++) {
        auxReturnPayloadShipment[senderValues[i]] =
          this.store.payloadShipment[recipientValues[i]];
        auxReturnPayloadShipment[recipientValues[i]] =
          this.store.payloadShipment[senderValues[i]];
      }

      Object.keys(returnPayloadShipment).forEach((element) => {
        if (!auxReturnPayloadShipment.hasOwnProperty(element)) {
          auxReturnPayloadShipment[element] = returnPayloadShipment[element];
        }
      });

      alert(JSON.stringify(auxReturnPayloadShipment, null, 4));

      this.status.handleShipment(auxReturnPayloadShipment).subscribe((res) => {
        console.log(res);
        this.store.returnShipment = res;
      });
      this.router.navigate([this.store.modules[this.store.currentStep++]], {
        queryParamsHandling: "merge",
      });
    }
  }
}

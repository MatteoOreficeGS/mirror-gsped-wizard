import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-fattura-dhl",
  templateUrl: "./fattura-dhl.component.html",
})
export class FatturaDHLComponent implements OnInit {
  constructor(public fb:FormBuilder, private router: Router, private store: StoreService) {
    this.formInvoice = fb.group({
      sender_name: [],
      sender_city: [],
      sender_contact: [],
      sender_cap: [],
      sender_prov: [],
      sender_country_code: [],
      sender_email: [],
      sender_phone: [],
      sender_addr: [],
    });
  }

  ngOnInit(): void {}

  invoiceModules: any;
  formInvoice: FormGroup;

  setInvoiceModules(type: string) {
    switch (type) {
      case "privato":
        this.invoiceModules = [
          { label: "codice fiscale", type: "text", required: true },
          { label: "PEC", type: "email", required: false },
          { label: "CFE/SDI", type: "text", required: true },
        ];
        break;
      case "piva":
        this.invoiceModules = [
          { label: "partita iva", type: "text", required: true },
          { label: "PEC", type: "email", required: false },
          { label: "CFE/SDI", type: "text", required: true },
        ];
        break;
      case "estero":
        this.invoiceModules = [
          { label: "nome", type: "email", required: true },
          { label: "cognome", type: "text", required: true },
          { label: "società", type: "text", required: false },
          { label: "indirizzo", type: "text", required: true },
          { label: "country", type: "text", required: true },
          { label: "CAP", type: "text", required: true },
          { label: "Città", type: "text", required: true },
          { label: "e-mail", type: "email", required: true },
        ];
        break;
    }
  }

  nextStep() {
    if (this.formInvoice.valid) {
      this.store.sender = this.formInvoice.value;
      this.router.navigate([this.store.modules[this.store.currentStep++]], {
        queryParamsHandling: "merge",
      });
    }
  }
}

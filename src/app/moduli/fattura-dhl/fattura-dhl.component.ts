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
    this.formInvoice = fb.group({
      sender_name: ["", Validators.required],
      sender_city: ["", Validators.required],
      sender_contact: ["", Validators.required],
      sender_cap: ["", Validators.required],
      sender_prov: ["", Validators.required],
      sender_country_code: ["", Validators.required],
      sender_email: ["", Validators.required],
      sender_phone: ["", Validators.required],
      sender_addr: ["", Validators.required],
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
    this.store.payloadShipment.fatturaDHL = [
      {
        cap: 15121,
      },
    ];
    console.log(this.store.payloadShipment);
    // TODO settare il form
    if (this.formInvoice.valid || true) {
      this.store.invoice = this.formInvoice.value;
      this.status
        .handleShipment(this.store.payloadShipment)
        .subscribe((res) => {
          console.log(res);
          this.store.shipment = res;
          this.router.navigate([this.store.modules[this.store.currentStep++]], {
            queryParamsHandling: "merge",
          });
        });
    }
  }
}

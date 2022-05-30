import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SaveStatusService } from "src/app/save-status.service";

@Component({
  selector: "app-dati-mittente",
  templateUrl: "./dati-mittente.component.html",
})
export class DatiMittenteComponent implements OnInit {
  status: any = {};

  constructor(
    public fb: FormBuilder,
    public saveService: SaveStatusService,
    private router: Router
  ) {
    this.status = saveService.getStatus();

    this.formSender = fb.group({
      name: [this.status.sender.name, Validators.required],
      city: [this.status.sender.city, Validators.required],
      zipcode: [this.status.sender.zipcode, Validators.required],
      state: [this.status.sender.state, Validators.required],
      country: [this.status.sender.country, Validators.required],
      email: [this.status.sender.email, Validators.required],
      phone: [this.status.sender.phone, Validators.required],
      address: [this.status.sender.address, Validators.required],
    });
  }

  ngOnInit(): void {}

  fields = [
    { value: "name", label: "nome", type: "text" },
    { value: "city", label: "città", type: "text" },
    { value: "zipcode", label: "codice postale", type: "number" },
    { value: "state", label: "Provincia", type: "text" },
    { value: "country", label: "Paese", type: "text" },
    { value: "email", label: "email", type: "email" },
    { value: "phone", label: "numero di telefono", type: "number" },
    { value: "address", label: "Indirizzo", type: "text" },
  ];

  formSender: FormGroup;

  send() {
    if (this.formSender.valid) {
      this.saveService.setStatus(this.formSender.value);
      this.saveService.incrementStep();
      this.router.navigate(["recipient"]);
    }
  }

  getStatus() {
    this.status = this.saveService.getStatus();
  }
}

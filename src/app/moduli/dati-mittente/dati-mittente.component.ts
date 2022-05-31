import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-dati-mittente",
  templateUrl: "./dati-mittente.component.html",
})
export class DatiMittenteComponent implements OnInit {
  status: any = {};

  constructor(
    public fb: FormBuilder,
    public saveService: StatusService,
    private router: Router
  ) {
    this.status = saveService.getStatus();

    // form init and validation
    this.formSender = fb.group({
      name: [this.status.sender.name, Validators.required],
      city: [this.status.sender.city, Validators.required],
      zipcode: [this.status.sender.zipcode, Validators.required],
      state: [this.status.sender.state, Validators.required],
      country: [this.status.sender.country, Validators.required],
      email: [this.status.sender.email, Validators.required],
      phone: [this.status.sender.phone],
      address: [this.status.sender.address, Validators.required],
    });
  }

  ngOnInit(): void {}

  fields = [
    { value: "name", label: "nome", type: "text", required: true },
    { value: "city", label: "città", type: "text", required: true },
    {
      value: "zipcode",
      label: "codice postale",
      type: "number",
      required: true,
    },
    { value: "state", label: "Provincia", type: "text", required: true },
    { value: "country", label: "Paese", type: "text", required: true },
    { value: "email", label: "email", type: "email", required: true },
    {
      value: "phone",
      label: "numero di telefono",
      type: "number",
      required: false,
    },
    { value: "address", label: "Indirizzo", type: "text", required: true },
  ];

  formSender: FormGroup;

  next() {
    if (this.formSender.valid) {
      this.saveService.setStatus(this.formSender.value, "sender");
      this.saveService.incrementStep();
      this.router.navigate(["recipient"]);
    }
  }
}

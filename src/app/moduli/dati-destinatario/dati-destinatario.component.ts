import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-dati-destinatario",
  templateUrl: "./dati-destinatario.component.html",
})
export class DatiDestinatarioComponent implements OnInit {
  constructor(public router: Router, public statusService: StatusService) {}

  ngOnInit(): void {}

  fields: Array<any> = [
    { label: "nome", value: "Rossi Gino" },
    { label: "indirizzo", value: "via dei tigli 12" },
    { label: "città", value: "Milano" },
    { label: "cap", value: "12345" },
    { label: "provincia", value: "MI" },
    { label: "nazione", value: "IT" },
    { label: "email", value: "test@test.it" },
    { label: "cellulare", value: "123445679" },
  ];

  incrementStep() {
    this.statusService.incrementStep();
    this.next();
  }

  obj: any = {};

  next() {
    this.fields.forEach((element) => {
      this.obj[element.label] = element.value;
    });

    if (true) {
      this.statusService.setStatus(this.obj, "recipient");
      this.statusService.incrementStep();
      this.router.navigate(["shipment"]);
    }
  }
}

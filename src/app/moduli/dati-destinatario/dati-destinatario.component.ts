import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dati-destinatario",
  templateUrl: "./dati-destinatario.component.html",
})
export class DatiDestinatarioComponent implements OnInit {
  constructor() {}

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
}

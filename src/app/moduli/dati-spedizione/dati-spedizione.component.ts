import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-dati-spedizione",
  templateUrl: "./dati-spedizione.component.html",
})
export class DatiSpedizioneComponent implements OnInit {
  constructor(public fb: FormBuilder) {
    this.formShipment = fb.group({});
  }

  ngOnInit(): void {}

  formShipment: FormGroup;

  send() {
    console.log(this.formShipment.value);
  }
  selectCourier(courier: any) {
    this.courierSelected = courier.value;
  }
  courierSelected = null;

  services = ["Spedizione Express", "Spedizione Gratuita", "Spedizione Veloce"];
}

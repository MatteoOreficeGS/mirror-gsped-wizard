import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-dati-spedizione",
  templateUrl: "./dati-spedizione.component.html",
})
export class DatiSpedizioneComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public status: StatusService,
    public router: Router
  ) {
    this.formShipment = fb.group({
      altezza: ["", Validators.required],
      larghezza: ["", Validators.required],
      lunghezza: ["", Validators.required],
      peso: ["", Validators.required],
      volume: ["", Validators.required],
      couriers: [this.status.status.shipment.name, Validators.required],
      Express: [""],
    });
  }

  ngOnInit(): void {}

  formShipment: FormGroup;

  send() {
    console.log(this.formShipment.value);
    this.incrementStep();
  }
  selectCourier(courier: any) {
    this.courierSelected = courier.value;
  }
  courierSelected = null;

  /*   services = this.status.response.configuration.modules
  .filter((module: any) => module.moduleName === "shipment")[0]
  .couriers[0].services.map((s: { name: any }) => s.name); */

  currentModule = this.status.response.configuration.modules.filter(
    (module: any) => module.moduleName === "shipment"
  )[0].moduleConfig;

  couriers: Array<any> = this.currentModule.selectCourier.couriers.list;
  label: string = this.currentModule.packagesDetails.label;
  fieldsLabel: Array<string> = this.currentModule.packagesDetails.fieldsLabel;

  incrementStep() {
    this.status.incrementStep();
    this.next();
  }

  next() {
    console.log(this.formShipment.valid);

    if (this.formShipment.valid) {
      this.status.setStatus(this.formShipment.value, "shipment");
      this.status.incrementStep();
      this.router.navigate(["payment"]);
      this.status.changestep(this.step++);
    }
  }

  stepSrc?: Subject<number>;
  step: number = 2;
}

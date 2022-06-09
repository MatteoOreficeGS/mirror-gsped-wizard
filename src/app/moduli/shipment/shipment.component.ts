import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-shipment",
  templateUrl: "./shipment.component.html",
})
export class ShipmentComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public status: StatusService,
    public router: Router
  ) {
    this.formShipment = fb.group({
      dimensions: this.fb.array([]),
      couriers: ["", Validators.required],
      // courierServices: this.fb.array([{services: ""}]),
    });
    this.stepSrc = this.status.stepSource;
    this.addPackage();
  }

  get dimensions(): FormArray {
    return this.formShipment.get("dimensions") as FormArray;
  }

  get courierServices(): FormArray {
    return this.formShipment.get("courierServices") as FormArray;
  }

  ngOnInit(): void {
    this.status.getConfiguration().subscribe((res) => {
      this.response = res;
      this.currentModule = this.response.configuration?.modules.filter(
        (module: any) => module.moduleName === "shipment"
      )[0].moduleConfig;

      this.couriers = this.currentModule.selectCourier.couriers.list;
      console.log(this.currentModule);

      this.label = this.currentModule.packagesDetails.label;
      // this.fieldsLabel = this.currentModule.packagesDetails.fieldsLabel;
      this.fieldsLabel = [
        { label: "altezza", placeholder: "cm", step: 1 },
        { label: "lunghezza", placeholder: "cm", step: 1 },
        { label: "larghezza", placeholder: "cm", step: 1 },
        { label: "volume", placeholder: "m³", step: 0.01 },
        { label: "peso", placeholder: "kg", step: 0.1 },
      ];
    });
  }

  response: any = {};

  formShipment: FormGroup;

  send() {
    console.log(this.formShipment.value);
    this.incrementStep();
  }
  selectCourier(courier: any) {
    this.courierSelected = courier.value;
    console.log(this.courierSelected);
    this.services = this.currentModule.selectCourier.couriers.list.filter(
      (el: { name: string }) => el.name === this.courierSelected
    )[0].services.list;
  }
  courierSelected = null;
  currentModule: any;
  couriers?: Array<any>;
  label: any;
  fieldsLabel: any;
  services: any;

  /*   services = this.status.response.configuration.modules
  .filter((module: any) => module.moduleName === "shipment")[0]
  .couriers[0].services.map((s: { name: any }) => s.name); */

  setPackageNumber(n: HTMLSelectElement) {
    this.packageNumber = parseInt(n.value);
    this.addPackage();
  }

  newPackage(): FormGroup {
    return this.fb.group({
      lunghezza: "",
      larghezza: "",
      altezza: "",
      peso: "",
      volume: "",
    });
  }

  addPackage() {
    this.dimensions.push(this.newPackage());
  }

  removePackage(i: number) {
    this.dimensions.removeAt(i);
  }

  checkPickUpAviability() {
    console.log("disponibile?");
  }

  packageNumber = 1;

  incrementStep() {
    this.status.incrementStep();
    this.next();
  }

  next() {
    console.log(this.formShipment.value);

    if (this.formShipment.valid) {
      this.status.setStatus(this.formShipment.value, "shipment");
      this.status.incrementStep();
      this.router.navigate(["payment"]);
      this.status.changestep(this.step++);
    }
  }

  stepSrc?: Subject<number>;
  step: number = 3;
}

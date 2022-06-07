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
      altezza: ["", Validators.required],
      larghezza: ["", Validators.required],
      lunghezza: ["", Validators.required],
      peso: ["", Validators.required],
      volume: ["", Validators.required],
      couriers: ["", Validators.required],
      DomesticExpress: [""],
    });
    this.stepSrc = this.status.stepSource;
  }

  ngOnInit(): void {
    this.status.getConfiguration().subscribe(res => {
      this.response = res
      this.currentModule = this.response.configuration?.modules.filter(
        (module: any) => module.moduleName === "shipment"
      )[0].moduleConfig;
    
      this.couriers = this.currentModule.selectCourier.couriers.list;
      console.log(this.currentModule);
      
      this.label = this.currentModule.packagesDetails.label;
      this.fieldsLabel = this.currentModule.packagesDetails.fieldsLabel;
    });
  }

  response: any = {};

  formShipment: FormGroup;

  send() {
    console.log(this.formShipment.value);
    this.incrementStep();
  }
  selectCourier(courier: any) {
    console.log(this.courierSelected);
    this.courierSelected = courier.value;
    this.services = this.currentModule.selectCourier.couriers.list.filter((el: { name: string; }) => el.name === "DHL")[0].services.list
  }
  courierSelected = null;
  currentModule:any;
  couriers?:Array<any>;
  label:any;
  fieldsLabel:any;
  services:any;

  /*   services = this.status.response.configuration.modules
  .filter((module: any) => module.moduleName === "shipment")[0]
  .couriers[0].services.map((s: { name: any }) => s.name); */

  

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
  step: number = 3;
}

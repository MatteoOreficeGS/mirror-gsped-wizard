import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StatusService } from "../status.service";

@Component({
  selector: "app-widzard",
  templateUrl: "./widzard.component.html",
})
export class WidzardComponent implements OnInit {
  constructor(private router: Router, public status: StatusService) {}

  ngOnInit(): void {}

  @Input() theme: any;

  activeStep: number = this.status.getActiveStep();

  configuration = this.status.response.configuration;
  bannerExtra = this.configuration.bannerExtra;

  /* incrementStep() {
    if (this.activeStep !== this.widzard[0].steps.fields.length - 1) {
      this.activeStep += 1;
    }
    this.router.navigate([
      this.configuration.modules[this.activeStep].moduleName,
    ]);
  }
  */

  setStep(i: number) {
    this.activeStep = this.status.getActiveStep();
  }
}

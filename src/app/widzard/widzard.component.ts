import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "../status.service";

@Component({
  selector: "app-widzard",
  templateUrl: "./widzard.component.html",
})
export class WidzardComponent implements OnInit {
  constructor(private router: Router, public status: StatusService) {
    this.stepSrc = this.status.stepSource;

    this.stepSrc.subscribe((value) => {
      this.activeStep = value;
      console.log(this.stepSrc, this.activeStep);
    });
  }

  ngOnInit(): void {}

  @Input() theme: any;

  configuration = this.status.response.configuration;
  bannerExtra = this.configuration.bannerExtra;

  stepSrc?: Subject<number>;
  public activeStep: number = 0;

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

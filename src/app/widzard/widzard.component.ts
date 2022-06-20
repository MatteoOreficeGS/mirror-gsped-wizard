import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
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
    // console.log(this.configuration);
    router.events.subscribe(() => {
      // console.log(this.router.url);
      this.setStep(1);
    });

  }

  ngOnInit(): void {
    this.status.getConfiguration().subscribe((res) => (this.response = res, console.log(res)));
  }

  response: any = {};

  /*   configuration = this.status
    .getConfiguration()
    .subscribe((res) => console.log(res)); */
  // bannerExtra = this.response.configuration.bannerExtra;

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

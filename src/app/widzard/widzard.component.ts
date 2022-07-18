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
    this.translations = JSON.parse(sessionStorage.getItem("translations") || "{}")
    this.stepSrc.subscribe((value) => {
      this.activeStep = value;
    });
    // console.log(this.configuration);
    router.events.subscribe(() => {
      this.setStep(1);
      this.stepName = this.router.url.slice(1).split("?")[0];
    });
  }

  ngOnInit(): void {
    // this.status.getResponse().subscribe((res: any) => console.log(res));
    this.status.getConfiguration().subscribe((res) => {
      this.response = res;
      // this.response.configuration.modules =
      const index = this.response.configuration.modules.findIndex(
        (object: { moduleName: string }) => {
          return object.moduleName === this.stepName;
        }
      );
      console.log(index + 1);
      this.setStep(index);
    });
  }

  response: any = {};
  translations:any = {}
  stepName = "";

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
    // this.activeStep = this.status.getActiveStep();
    this.router.navigate([
      // this.configuration.modules[this.activeStep].moduleName,
    ]);
    this.activeStep = i;
  }
}

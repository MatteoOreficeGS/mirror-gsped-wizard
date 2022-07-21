import { Component } from "@angular/core";
import {  Router } from "@angular/router";
import { environment } from "../enviroment";
import { StatusService } from "../status.service";
import { StoreService } from "../store.service";

@Component({
  selector: "app-widzard",
  templateUrl: "./widzard.component.html",
})
export class WidzardComponent {
  constructor(
    private router: Router,
    public status: StatusService,
    public store: StoreService
  ) {
    this.step = store.currentStep;
    this.response = store.configuration;
    this.translations = store.translations;
  }
  title: string = environment.TITLE;
  step: number;
  response: any = {};
  translations: any = {};

  setStep(i: number) {
    const navigateTo = this.store.modules[i];
    this.store.currentStep = i+1;
    this.router.navigate([navigateTo], {
      queryParamsHandling: "merge",
    });
  }
}

import { Component } from "@angular/core";
import { Router } from "@angular/router";
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
    this.modules = store.modules;
    this.bannerExtra = store.configuration.bannerExtra;
    this.translations = store.translations;
  }
  step: number;
  modules: any;
  translations: any = {};
  bannerExtra: any;

  setStep(i: number) {
    const navigateTo = this.store.modules[i].module;
    this.store.currentStep = i + 1;
    this.router.navigate([navigateTo], {
      queryParamsHandling: "merge",
    });
  }
}

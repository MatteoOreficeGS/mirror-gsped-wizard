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
    this.currentStep = store.currentStep;
    this.modules = store.modules;
    this.bannerExtra = store.configuration.bannerExtra;
    this.translations = store.translations;
    this.isLastModule = this.store.isLastModule;
  }

  handlePreviousStep() {
    if (this.store.currentStep > 1) {
      this.store.currentStep -= 1;
      this.router.navigate(
        [this.store.modules[this.store.currentStep - 1].module],
        {
          queryParamsHandling: "merge",
        }
      );
    }
  }

  isLastModule: boolean;
  currentStep: number;
  modules: any;
  translations: any = {};
  bannerExtra: any;
}

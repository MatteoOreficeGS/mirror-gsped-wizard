import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../enviroment";
import { StatusService } from "../status.service";
import { StoreService } from "../store.service";

@Component({
  selector: "app-wizard",
  templateUrl: "./wizard.component.html",
})
export class WizardComponent {
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

  isLastModule: boolean;
  currentStep: number;
  modules: any;
  translations: any = {};
  bannerExtra: any;
  @Input() showSteps = true;
}

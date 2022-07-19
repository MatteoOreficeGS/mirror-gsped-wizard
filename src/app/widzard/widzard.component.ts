import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StatusService } from "../status.service";
import { StoreService } from "../store.service";

@Component({
  selector: "app-widzard",
  templateUrl: "./widzard.component.html",
})
export class WidzardComponent {
  @Input() step = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public status: StatusService,
    public store: StoreService
  ) {
    this.response = store.configuration;
    this.translations = store.translations;
  }

  response: any = {};
  translations: any = {};
  stepName = "";

  setStep(i: number) {
    const navigateTo = this.store.modules.filter(
      (module: any) => module.step === i + 1
    );
    this.route.queryParams.subscribe((params: any) => {
      if (params.lang) {
        this.router.navigate([navigateTo[0].name], {
          queryParams: { lang: params.lang },
        });
      }
    });
  }
}

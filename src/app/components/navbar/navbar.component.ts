import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  constructor(
    public store: StoreService,
    private router: Router,
    private service: StatusService,
    private activatedRoute: ActivatedRoute
  ) {
    this.response = this.store.configuration;
    this.customerLogo = this.store.configuration.hasOwnProperty("customerLogo")
      ? this.store.configuration.customerLogo
      : null;
    this.theme = "#" + this.response.mainColor;
    this.lenguages = this.response.i18n.length > 1 ? this.response.i18n : [];
  }

  customerLogo?: string;
  response: any = {};
  currentUrl = "";
  theme = "";
  lenguages: Array<string> = [];

  handleSetTranslations(lang: string) {
    if (this.store.action) {
      this.service
        .getTranslations(lang, this.store.action)
        .subscribe((res: any) => {
          this.store.translations = res;
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { lang: lang },
            queryParamsHandling: "merge", // remove to replace all query params by provided
          });
        });
      return;
    }

    this.service.getTranslations(lang).subscribe((res: any) => {
      this.store.translations = res;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate(
          [this.store.modules[this.store.currentStep - 1].module],
          {
            queryParams: { lang: lang },
            queryParamsHandling: "merge",
          }
        );
      });
    });
  }
}

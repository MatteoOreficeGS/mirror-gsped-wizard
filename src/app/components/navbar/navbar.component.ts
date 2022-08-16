import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/app/enviroment";
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
    private status: StatusService
  ) {
    this.response = this.store.configuration;
    this.customerLogo = this.store.configuration.hasOwnProperty("customerLogo")
      ? this.store.configuration.customerLogo
      : null;
    this.theme = "#" + this.response.mainColor;
    this.lenguages = this.response.i18n.length > 1 ? this.response.i18n : [];
  }

  customerLogo: string;
  response: any = {};
  currentUrl = "";
  theme = "";
  lenguages: Array<string> = [];

  handleSetTranslations(lang: string) {
    this.status.getTranslations(lang).subscribe((res: any) => {
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

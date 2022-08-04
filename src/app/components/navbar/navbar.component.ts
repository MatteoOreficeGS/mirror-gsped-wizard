import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/app/enviroment";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  constructor(public store: StoreService, private router: Router) {
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
    this.currentUrl = this.router.url.slice(1).split("?")[0];
    window.document.location.href =
      environment.CURRENT_URL +
      "?origin=" +
      this.store.origin +
      "&lang=" +
      lang;
    // TODO da vederre se è possibile cambiare le traduzioni senza refreshare la pagina
    // qui devo chiamare /Translations e cambaire la store.translation
  }
}

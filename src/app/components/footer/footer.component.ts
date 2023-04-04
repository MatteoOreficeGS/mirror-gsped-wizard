import { Component } from "@angular/core";
import { environment } from "src/app/enviroment";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
})
export class FooterComponent {
  constructor(public store: StoreService, public service: StatusService) {
    if (this.service.checkConfiguration()) {
      return;
    }
    this.labels = this.store.configuration.staticPages.filter(
      (staticPage: { pageName: string | undefined }) =>
        staticPage.pageName === "footer"
    )[0];
    this.linkToRetrive =
      environment.CURRENT_URL +
      "/?origin=" +
      this.store.origin +
      "&action=retrievedoc";
  }

  labels: any = {};
  linkToRetrive?: string;
}

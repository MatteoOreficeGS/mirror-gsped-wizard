import { Component } from "@angular/core";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
})
export class SummaryComponent {
  constructor(public store: StoreService) {
    this.showInvoice = Object.keys(this.store.invoice).length > 0;
  }
  showInvoice: boolean;
}

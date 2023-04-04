import { Component, Input } from "@angular/core";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
})
export class SummaryComponent {
  constructor(public store: StoreService) {
    if (this.store.invoice) {
      this.showInvoice = Object.keys(this.store.invoice).length > 0;
    }
  }
  showInvoice: boolean = false;
  @Input() senderHidden: boolean = false;
  @Input() recipientHidden: boolean = false;
  @Input() invoiceHidden: boolean = false;
}

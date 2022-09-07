import { Component, Input, Output, EventEmitter } from "@angular/core";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-courier-card",
  templateUrl: "./courier-card.component.html",
})
export class CourierCardComponent {
  constructor(public store: StoreService) {}

  @Input() service: any = {};
  @Input() i: any;
  @Input() iva: any;
  @Input() type: any;
  @Output() selectCourierEvent = new EventEmitter();

  getFloat(number: any) {
    return Number.parseFloat(number).toFixed(2);
  }
 // @Output() closeModal2 = new EventEmitter();
}

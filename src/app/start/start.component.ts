import { Component } from "@angular/core";

@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
})
export class StartComponent {
  constructor() {
    if (window.location.href.split("?").length < 2 || false) {
      window.location.href = "http://localhost:4200/?origin=moldavia";
    }
  }
}

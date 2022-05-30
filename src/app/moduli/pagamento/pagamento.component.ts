import { Component, OnInit } from "@angular/core";
import { SaveStatusService } from "src/app/save-status.service";

@Component({
  selector: "app-pagamento",
  templateUrl: "./pagamento.component.html",
})
export class PagamentoComponent implements OnInit {
  status = {};
  payload: string = "";

  constructor(public statusService: SaveStatusService) {}

  ngOnInit(): void {}

  redirectPayment() {
    this.status = this.statusService.getStatus();
    this.payload = btoa(JSON.stringify(this.status));
    console.log(this.payload);
  }
}

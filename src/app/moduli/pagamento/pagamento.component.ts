import { Component, OnInit } from "@angular/core";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-pagamento",
  templateUrl: "./pagamento.component.html",
})
export class PagamentoComponent implements OnInit {
  status = {};
  payload: string = "";

  constructor(public statusService: StatusService) {}

  ngOnInit(): void {}

  redirectPayment() {
    this.status = this.statusService.getStatus();
    this.payload = btoa(JSON.stringify(this.status));
    console.log(this.payload);
  }
}

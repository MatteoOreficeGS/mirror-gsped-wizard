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
    this.status = this.statusService.getSession();
    this.payload = btoa(JSON.stringify(this.status));
    console.log(this.payload);
    console.log(this.status);
  }
}

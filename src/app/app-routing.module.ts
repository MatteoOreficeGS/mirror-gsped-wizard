import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipientComponent } from "./moduli/recipient/recipient.component";
import { SenderComponent } from "./moduli/sender/sender.component";
import { ShipmentComponent } from "./moduli/shipment/shipment.component";
import { PagamentoComponent } from "./moduli/pagamento/pagamento.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";

const routes: Routes = [
  { path: "sender", component: SenderComponent },
  { path: "recipient", component: RecipientComponent },
  { path: "shipment", component: ShipmentComponent },
  { path: "payment", component: PagamentoComponent },
  { path: "awbPrinting", component: StampaAwbComponent },
  { path: "", redirectTo: "/sender", pathMatch: "full" },
  { path: "**", redirectTo: "/sender", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

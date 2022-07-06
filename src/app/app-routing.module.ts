import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipientComponent } from "./moduli/recipient/recipient.component";
import { SenderComponent } from "./moduli/sender/sender.component";
import { ShipmentComponent } from "./moduli/shipment/shipment.component";
import { PaymentComponent } from "./moduli/payment/payment.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";

const routes: Routes = [
  { path: "sender", component: SenderComponent },
  { path: "recipient", component: RecipientComponent },
  { path: "shipment", component: ShipmentComponent },
  { path: "payment", component: PaymentComponent },
  { path: "awbPrinting", component: StampaAwbComponent },
  { path: "", redirectTo: "/sender?lang=it_IT", pathMatch: "full" },
  { path: "**", redirectTo: "/sender?lang=it_IT", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

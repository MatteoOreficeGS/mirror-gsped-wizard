import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipientComponent } from "./moduli/recipient/recipient.component";
import { SenderComponent } from "./moduli/sender/sender.component";
import { ShipmentComponent } from "./moduli/shipment/shipment.component";
import { PaymentComponent } from "./moduli/payment/payment.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { StartComponent } from "./start/start.component";
import { ErrorPaymentComponent } from "./error-payment/error-payment.component";

const routes: Routes = [
  { path: "sender", component: SenderComponent /* outlet: "steps" */ },
  { path: "recipient", component: RecipientComponent /* outlet: "steps" */ },
  { path: "shipment", component: ShipmentComponent /* outlet: "steps" */ },
  { path: "payment", component: PaymentComponent /* outlet: "steps" */ },
  { path: "awb-printing", component: StampaAwbComponent /* outlet: "steps" */ },
  {
    path: "error-payment",
    component: ErrorPaymentComponent,
    children: [{ path: "monetaweb", component: ErrorPaymentComponent }],
  },
  { path: "", component: StartComponent /* outlet: "page" */ },
  { path: "**", component: ErrorPageComponent /* outlet: "page" */ },
  // { path: "", redirectTo: "/sender?lang=it_IT", pathMatch: "full" },
  // { path: "**", redirectTo: "/sender?lang=it_IT", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

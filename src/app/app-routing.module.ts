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
import { FatturaDHLComponent } from "./moduli/fattura-dhl/fattura-dhl.component";
import { VodafoneComponent } from "./vodafone/vodafone.component";

const routes: Routes = [
  { path: "sender", component: SenderComponent },
  { path: "recipient", component: RecipientComponent },
  { path: "vodafone", component: VodafoneComponent },
  { path: "shipment", component: ShipmentComponent },
  { path: "payment", component: PaymentComponent },
  {
    path: "awb-printing",
    component: StampaAwbComponent,
    children: [{ path: "monetaweb", component: StampaAwbComponent }],
  },
  { path: "fatturaDHL", component: FatturaDHLComponent },
  {
    path: "error-payment",
    children: [{ path: "monetaweb", component: ErrorPaymentComponent }],
  },
  { path: "", component: StartComponent },
  { path: "**", component: ErrorPageComponent },
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

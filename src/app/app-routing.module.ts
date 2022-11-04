import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipientComponent } from "./modules/recipient/recipient.component";
import { SenderComponent } from "./modules/sender/sender.component";
import { ShipmentDataComponent } from "./modules/shipment-data/shipment-data.component";
import { PaymentComponent } from "./modules/payment/payment.component";
import { StampaAwbComponent } from "./modules/stampa-awb/stampa-awb.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { StartComponent } from "./start/start.component";
import { FatturaDHLComponent } from "./modules/fattura-dhl/fattura-dhl.component";
import { VodafoneComponent } from "./modules/vodafone/vodafone.component";
import { SelectCourierComponent } from "./modules/select-courier/select-courier.component";
import { DocumentRecoveryComponent } from "./document-recovery/document-recovery.component";

const routes: Routes = [
  { path: "sender", component: SenderComponent },
  { path: "recipient", component: RecipientComponent },
  { path: "fatturaDHL", component: FatturaDHLComponent },
  { path: "vodafone", component: VodafoneComponent },
  { path: "shipment-data", component: ShipmentDataComponent },
  { path: "select-courier", component: SelectCourierComponent },
  { path: "payment", component: PaymentComponent },
  {
    path: "awb-printing",
    component: StampaAwbComponent,
    children: [{ path: "monetaweb", component: StampaAwbComponent }],
  },
  { path: "document-recovery", component: DocumentRecoveryComponent },
  { path: "", component: StartComponent, children: [{ path: "monetaweb", component: StartComponent }], },
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

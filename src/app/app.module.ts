import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSliderModule } from "@angular/material/slider";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { WidzardComponent } from "./widzard/widzard.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SenderComponent } from "./moduli/sender/sender.component";
import { RecipientComponent } from "./moduli/recipient/recipient.component";
import { ShipmentComponent } from "./moduli/shipment/shipment.component";
import { PaymentComponent } from "./moduli/payment/payment.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    WidzardComponent,
    FooterComponent,
    SenderComponent,
    RecipientComponent,
    ShipmentComponent,
    PaymentComponent,
    StampaAwbComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

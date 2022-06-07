import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSliderModule } from "@angular/material/slider";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { WidzardComponent } from "./widzard/widzard.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { SenderComponent } from "./moduli/sender/sender.component";
import { RecipientComponent } from "./moduli/recipient/recipient.component";
import { ShipmentComponent } from "./moduli/shipment/shipment.component";
import { CustomComponent } from "./moduli/custom/custom.component";
import { RatingSpedizioneComponent } from "./moduli/rating-spedizione/rating-spedizione.component";
import { PaymentComponent } from "./moduli/payment/payment.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    WidzardComponent,
    NavbarComponent,
    FooterComponent,
    SenderComponent,
    RecipientComponent,
    ShipmentComponent,
    CustomComponent,
    RatingSpedizioneComponent,
    PaymentComponent,
    StampaAwbComponent,
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

import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { BrowserModule } from "@angular/platform-browser";
// import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
// import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { PaymentComponent } from "./modules/payment/payment.component";
import { RecipientComponent } from "./modules/recipient/recipient.component";
import { SenderComponent } from "./modules/sender/sender.component";
import { ShipmentDataComponent } from "./modules/shipment-data/shipment-data.component";
import { StampaAwbComponent } from "./modules/stampa-awb/stampa-awb.component";
import { StartComponent } from "./start/start.component";
import { WizardComponent } from "./wizard/wizard.component";
// import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CourierCardComponent } from './components/courier-card/courier-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ModalInfoComponent } from "./components/modal-info/modal-info.component";
import { ModalComponent } from './components/modal/modal.component';
import { SummaryComponent } from './components/summary/summary.component';
import { DocumentRecoveryComponent } from './document-recovery/document-recovery.component';
import { AlertInfoComponent } from "./icons/open-in-new/open-in-new.component";
import { FatturaDHLComponent } from './modules/fattura-dhl/fattura-dhl.component';
import { ResiCustomComponent } from './modules/resi-custom/resi-custom.component';
import { SelectCourierComponent } from "./modules/select-courier/select-courier.component";
import { VodafoneComponent } from './modules/vodafone/vodafone.component';

@NgModule({
  declarations: [
    AppComponent,
    WizardComponent,
    FooterComponent,
    SenderComponent,
    RecipientComponent,
    ShipmentDataComponent,
    PaymentComponent,
    StampaAwbComponent,
    NavbarComponent,
    ErrorPageComponent,
    StartComponent,
    FatturaDHLComponent,
    VodafoneComponent,
    ModalComponent,
    ModalInfoComponent,
    LoaderComponent,
    SummaryComponent,
    SelectCourierComponent,
    CourierCardComponent,
    DocumentRecoveryComponent,
    ResiCustomComponent
  ],
  imports: [
    BrowserAnimationsModule,
    // MatInputModule,
    // MatFormFieldModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // MatSelectModule,
    AlertInfoComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

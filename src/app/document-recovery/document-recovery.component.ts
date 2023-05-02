import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { environment } from "../enviroment";
import { StoreService } from "../store.service";
import { StatusService } from "../status.service";

@Component({
  selector: "app-document-recovery",
  templateUrl: "./document-recovery.component.html",
})
export class DocumentRecoveryComponent {
  constructor(
    public store: StoreService,
    private http: HttpClient,
    public service: StatusService
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }
    this.currentModule = this.store.configuration.staticPages.filter(
      (staticPage: { pageName: string | undefined }) =>
        staticPage.pageName === this.store.action
    )[0];
    this.fields = [
      {
        label: this.currentModule.retrieve_by_awb_number_label,
        type: "nspedizione",
      },
      {
        label: this.currentModule.retrieve_by_payment_reference_label,
        type: "transazione",
      },
      {
        label: this.currentModule.retrieve_by_invoice_number_label,
        type: "nfattura",
      },
    ];

    this.fields = this.fields
      .map((field: any) => {
        if (field.label) {
          return field;
        }
      })
      .filter((item: any) => item);
  }
  fields: any;
  showLink: any = { nspedizione: "", transazione: "", nfattura: "" };
  showError: any = { nspedizione: "", transazione: "", nfattura: "" };
  currentModule: any = {};

  recoverDocument(type: string, value: any) {
    if (value.length === 0) {
      return;
    }
    this.showLink[type] = "";
    this.showError[type] = "";
    const headers = { "x-api-key": this.store.token };
    const params = { tipo: type, valore: value };
    this.http
      .get(
        environment.API_URL +
          this.store.decodedToken.instance +
          "/RecuperoEtichetteResoFacile",
        { headers: headers, params: params }
      )
      .subscribe({
        next: (res: any) => {
          this.showLink[type] = res.link;
        },
        error: (error: any) => {
          this.showError[type] = "retrieve_doc_not_found";
        },
      });
  }
}

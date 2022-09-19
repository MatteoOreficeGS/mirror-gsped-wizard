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
    this.labels = this.store.configuration.staticPages.filter(
      (staticPage: { pageName: string | undefined }) =>
        staticPage.pageName === this.store.action
    )[0];
    this.fields = [
      {
        label: this.labels.retrieve_by_awb_number_label,
        type: "nspedizione",
      },
      {
        label: this.labels.retrieve_by_payment_reference_label,
        type: "transazione",
      },
      {
        label: this.labels.retrieve_by_invoice_number_label, // ??? label
        type: "nfattura",
      },
    ];
  }
  fields: any;
  showLink: any = { nspedizione: "", transazione: "", nfattura: "" };
  showError: any = { nspedizione: "", transazione: "" , nfattura: ""};
  labels: any;

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
      .subscribe(
        (res: any) => {
          this.showLink[type] = res.link;
        },
        (error: any) => {
          this.showError[type] = "retrieve_doc_not_found";
        }
      );
  }
}

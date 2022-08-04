import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/app/enviroment";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-shipment",
  templateUrl: "./shipment.component.html",
})
export class ShipmentComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public status: StatusService,
    public store: StoreService,
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpClient
  ) {
    this.currentModule = this.store.configuration.modules.filter(
      (module: any) => module.moduleName === "shipment"
    )[0].moduleConfig;
    this.store.hasReturnShipment = this.currentModule.returnLabel.enable;
    this.translations = store.translations;
    this.store.isDocumentShipment = this.currentModule.documentFlag;
    this.isDocumentShipment = this.currentModule.documentFlag;
    this.formShipment = fb.group({
      dimensions: this.fb.array([]),
      outwardInsurance: "",
      codiceSconto: "",
      returnInsurance: "",
      termsconditions: "",
    });
  }

  ngOnInit(): void {
    if (this.currentModule.packagesDetails.enable) {
      this.addPackage();
    } else {
      this.datacolli = {
        colli: 1,
        peso: 0.5,
        volume: 0,
      };
    }

    this.couriers = this.currentModule.selectCourier.couriers.list;
    this.label = this.currentModule.packagesDetails.fieldsLabel;
    this.fieldsLabel = [
      { label: "altezza", placeholder: "cm", step: 1, min: 1, max: 100 },
      { label: "lunghezza", placeholder: "cm", step: 1, min: 1, max: 100 },
      { label: "larghezza", placeholder: "cm", step: 1, min: 1, max: 100 },
      { label: "peso", placeholder: "kg", step: 0.1, min: 0.5, max: 10 },
    ];

    this.bodyRateComparativa = {
      tipo_listino: "passivo",
      client_id: this.store.configuration.client_id,
    };
  }

  get dimensions(): FormArray {
    return this.formShipment.get("dimensions") as FormArray;
  }

  newPackage(): FormGroup {
    return this.fb.group({
      lunghezza: ["", Validators.required],
      larghezza: ["", Validators.required],
      altezza: ["", Validators.required],
      peso: ["", Validators.required],
    });
  }

  addPackage() {
    if (
      this.packageNumber <
      this.currentModule.packagesDetails.fixedPackagesNumber
    ) {
      this.packageNumber++;
      this.dimensions.push(this.newPackage());
    }
  }

  removePackage() {
    if (this.packageNumber > 1) {
      this.packageNumber--;
      this.dimensions.removeAt(-1);
    }
  }

  showCourierSelection: boolean = false;
  courierSelected = { name: "", gspedCourierCode: 104 };
  courierSelectedLogoUrl = null;
  currentModule: any;
  couriers?: Array<any>;
  label: any;
  fieldsLabel: any;
  services: any;
  pickupAvailability: string = "";
  costExposure: any;
  packageNumber = 0;
  varie_dettaglio?: any = {};
  rateComparativeServices?: Array<string>;
  isLoading: boolean = false;
  showInput: boolean = true;
  bodyRateComparativa: any;
  datacolli: any = {};
  dataRateComparative: any = {};
  translations: any;
  formShipment: FormGroup;
  isDocumentShipment: boolean;
  outwardBodyRateComparativa: any;
  returnBodyRateComparativa: any;
  outwardCostExposure: any = [];
  returnCostExposure: any = [];
  chosenCourier: any = {
    outward: { serviceName: "" },
    return: { serviceName: "" },
  };
  canContinue: boolean = false;

  setDataColli() {
    const pesoTot = this.formShipment.value.dimensions
      .map((value: { peso: any }) => value.peso)
      .reduce((a: any, b: any) => a + b, 0);
    const volumeTot = this.formShipment.value.dimensions
      .map(
        (value: { altezza: any; larghezza: any; lunghezza: any }) =>
          (value.lunghezza * value.larghezza * value.altezza) / 1000000
      )
      .reduce((a: any, b: any) => a + b, 0);

    this.datacolli = {
      colli: this.formShipment.value.dimensions.length,
      daticolli: JSON.stringify(this.formShipment.value.dimensions),
      peso: pesoTot,
      volume: volumeTot,
    };
  }

  confirmInsurance() {
    console.log(this.formShipment.value);
    // setting the insurance value at 100 if checkbox is checked at 0 if not
    if (this.formShipment.value.outwardInsurance === true) {
      this.formShipment.controls["outwardInsurance"].setValue(100);
      this.store.outwardInsurance = 100;
    } else if (this.formShipment.value.outwardInsurance === false) {
      this.formShipment.controls["outwardInsurance"].setValue(0);
    }
    if (this.formShipment.value.returnInsurance === true) {
      this.store.returnInsurance = 100;
    } else if (this.formShipment.value.returnInsurance === false) {
      this.formShipment.controls["returnInsurance"].setValue(0);
    }
    if (this.formShipment.valid) {
      if (this.currentModule.packagesDetails.enable) {
        this.setDataColli();
      }
      this.store.codiceSconto = this.formShipment.value.codiceSconto;
      this.isLoading = true;

      this.bodyRateComparativa = {
        ...this.bodyRateComparativa,
        ...this.datacolli,
      };
      this.bodyRateComparativa.documenti = this.store.isDocumentShipment
        ? 1
        : 0;
      this.bodyRateComparativa.codice_sconto =
        this.formShipment.value.codiceSconto;

      this.setShipmentPayload();
      this.showInput = false;

      // rateComparative di andata
      this.outwardBodyRateComparativa = this.bodyRateComparativa;
      this.outwardBodyRateComparativa.valore = this.store.outwardInsurance;
      this.outwardBodyRateComparativa = {
        ...this.outwardBodyRateComparativa,
        ...this.store.sender,
        ...this.store.recipient,
      };
      this.handleRateComparative(this.outwardBodyRateComparativa).subscribe(
        (res: any) => {
          Object.keys(res.passivo).forEach((courier: any) => {
            Object.keys(res.passivo[courier]).forEach((service: any) => {
              this.outwardCostExposure.push({
                courier: courier,
                serviceName: service,
                courierCode: parseInt(
                  res.passivo[courier][service].codice_corriere
                ),
                serviceCode: parseInt(
                  res.passivo[courier][service].codice_servizio
                ),
                data: res.passivo[courier][service],
              });
            });
          });
          this.outwardCostExposure = this.filterRateComparativeResults(
            false, //is outward
            this.currentModule.selectCourier.couriers.selectionMode,
            this.outwardCostExposure
          );
          if (!this.store.hasReturnShipment) {
            this.isLoading = false;
          }
        }
      );

      // rateComparative di ritorno
      if (this.store.hasReturnShipment) {
        this.returnBodyRateComparativa = this.bodyRateComparativa;
        this.returnBodyRateComparativa.valore = this.store.returnInsurance;
        this.returnBodyRateComparativa = {
          ...this.returnBodyRateComparativa,
          ...this.status.invertAddressData({
            ...this.store.sender,
            ...this.store.recipient,
          }),
        };
        this.handleRateComparative(this.returnBodyRateComparativa).subscribe(
          (res: any) => {
            Object.keys(res.passivo).forEach((courier: any) => {
              Object.keys(res.passivo[courier]).forEach((service: any) => {
                this.returnCostExposure.push({
                  courier: courier,
                  serviceName: service,
                  courierCode: parseInt(
                    res.passivo[courier][service].codice_corriere
                  ),
                  serviceCode: parseInt(
                    res.passivo[courier][service].codice_servizio
                  ),
                  data: res.passivo[courier][service],
                });
              });
            });
            this.returnCostExposure = this.filterRateComparativeResults(
              true, //is return
              this.currentModule.selectCourier.returnCouriers.selectionMode,
              this.returnCostExposure
            );
            this.isLoading = false;
          }
        );
      }
    }
  }

  setShipmentPayload() {
    this.store.payloadShipment = {
      creazione_postuma: this.store.hasPayment,
      client_id: this.store.configuration.client_id,
      origine: this.store.sender.sender_country_code,
      ...this.store.payloadShipment,
      ...this.datacolli,
    };
  }

  selectCourier(type: string, service: any) {
    this.chosenCourier[type] = service;
    if (this.chosenCourier.outward.serviceName !== "") {
      if (!this.store.hasReturnShipment) {
        this.canContinue = true;
      } else if (this.chosenCourier.return.serviceName !== "") {
        this.canContinue = true;
      }
    }
  }

  handleRateComparative(body: any): Observable<any> {
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    body = Object.entries(body);
    body = body.map((element: any) => {
      return element.join("=");
    });
    body = body.join("&");
    return this.http.get(
      environment.API_URL + decoded.instance + "/RateComparativa?" + body,
      { headers: headers }
    );
  }

  filterRateComparativeResults(isReturn: boolean, mode: string, response: any) {
    switch (mode) {
      case "FIXED":
        let configCouriers: any;
        let configServices: any;
        if (isReturn) {
          configCouriers =
            this.currentModule.selectCourier.returnCouriers.couriers.list.map(
              (courier: any) => {
                return courier.gspedCourierCode;
              }
            );
          configServices =
            this.currentModule.selectCourier.returnCouriers.couriers.list.map(
              (courier: any) => {
                return courier.services.list.map((service: any) => {
                  return service.gspedServiceCode;
                });
              }
            )[0];
        } else {
          configCouriers = this.currentModule.selectCourier.couriers.list.map(
            (courier: any) => {
              return courier.gspedCourierCode;
            }
          );
          configServices = this.currentModule.selectCourier.couriers.list.map(
            (courier: any) => {
              return courier.services.list.map((service: any) => {
                return service.gspedServiceCode;
              });
            }
          )[0];

          this.status
            .pickupAvailability(configCouriers[0])
            .subscribe((res: any) => {
              console.log(res);
            });
        }

        response = response.filter(
          (element: any) =>
            configCouriers.includes(element.courierCode) &&
            configServices.includes(element.serviceCode)
        );
        return response;

        break;
      case "AUTOMATIC":
        // filtrare per il corriere piu economico
        let maxPrice = 10000;
        response.forEach((element: any) => {
          if (element.data.totale < maxPrice) {
            maxPrice = element.data.totale;
            response = [element];
          }
        });
        return response;
        break;

      case "DYNAMIC":
      default:
        return response;
        break;
    }
  }

  handleShipments() {
    this.store.payloadShipment.fattura_dhl = this.store.invoice;
    this.store.payloadShipment.documenti = this.store.isDocumentShipment
      ? 1
      : 0;
    this.store.payloadShipment.creazione_postuma = this.store.hasPayment;
    // this.store.payloadShipment.creazione_postuma = true;
    this.store.payloadShipment.valore = this.store.outwardInsurance;

    const newsender = {
      sender_name: this.store.sender.sender.name +" " + this.store.sender.surname,
      sender_city: this.store.sender.sender_city,
      sender_cap: this.store.sender.sender_cap,
      sender_prov: this.store.sender.sender_cap,
      sender_country_code: this.store.sender.sender_country_code,
      sender_email: this.store.sender.sender_email,
      sender_phone: this.store.sender.phone,
      sender_addr: this.store.sender.sender_addr
  }

    const outwardPayloadShipment = {
      ...this.store.payloadShipment,
      ...newsender,
      ...this.store.recipient,
      corriere: this.store.chosenCourier.outward.courierCode,
      servizio: this.store.chosenCourier.outward.serviceCode,
    };
    if (this.store.selectedProducts) {
      outwardPayloadShipment[this.store.productDestination] =
        this.store.selectedProducts;
    }
    console.log(outwardPayloadShipment);
    this.status.handleShipment(outwardPayloadShipment).subscribe((res) => {
      this.store.outwardShipment = res;
      if (!this.store.hasReturnShipment) {
        this.router.navigate(
          [this.store.modules[this.store.currentStep++].module],
          {
            queryParamsHandling: "merge",
          }
        );
      }
    });

    // inverto il mittente con il destinatario per la spedizione di ritorno
    if (this.store.hasReturnShipment) {
      let returnPayloadShipment: any = this.store.payloadShipment;
      returnPayloadShipment.corriere =
        this.store.chosenCourier.return.courierCode;
      returnPayloadShipment.servizio =
        this.store.chosenCourier.return.serviceCode;

      returnPayloadShipment = {
        ...returnPayloadShipment,
        ...this.status.invertAddressData({
          ...this.store.sender,
          ...this.store.recipient,
        }),
      };
      this.status.handleShipment(returnPayloadShipment).subscribe((res) => {
        console.log(res);
        this.store.returnShipment = res;
        this.router.navigate(
          [this.store.modules[this.store.currentStep++].module],
          {
            queryParamsHandling: "merge",
          }
        );
      });
    }
  }

  incrementStep() {
    if (this.canContinue) {
      this.store.chosenCourier = this.chosenCourier;
      this.handleShipments();
    }
  }
}

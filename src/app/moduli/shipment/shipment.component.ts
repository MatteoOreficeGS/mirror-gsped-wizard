import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/app/enviroment";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";
import { ValidateInsurance, ValidatePackage } from "../../libs/validation";

@Component({
  selector: "app-shipment",
  templateUrl: "./shipment.component.html",
})
export class ShipmentComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public service: StatusService,
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
      outwardInsurance: ["", [ValidateInsurance]],
      codiceSconto: "",
      returnInsurance: ["", [ValidateInsurance]],
    });
    this.iva = this.store.configuration.vatPercentage;
  }

  ngOnInit(): void {
    if (this.currentModule.packagesDetails.enable) {
      this.addPackage();
    } else {
      this.daticolli = {
        colli: 1,
        peso: 0.5,
        volume: 0,
        dimensions: [],
      };
    }

    this.couriers = this.currentModule.selectCourier.couriers.list;
    this.label = this.currentModule.packagesDetails.fieldsLabel;
    this.fieldsLabel = [
      {
        label: "altezza",
        placeholder: "cm",
      },
      {
        label: "lunghezza",
        placeholder: "cm",
      },
      {
        label: "larghezza",
        placeholder: "cm",
      },
      { label: "peso", value: "peso", placeholder: "kg", min: 0.5, max: 10 },
    ];
  }

  get dimensions(): FormArray {
    return this.formShipment.get("dimensions") as FormArray;
  }

  newPackage(): FormGroup {
    return this.fb.group({
      lunghezza: ["", ValidatePackage],
      larghezza: ["", ValidatePackage],
      altezza: ["", ValidatePackage],
      peso: ["", ValidatePackage],
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
  currentModule: any;
  couriers?: Array<any>;
  label: any;
  fieldsLabel: any;
  pickupAvailability: string = "";
  packageNumber = 0;
  isLoading: boolean = false;
  showInput: boolean = true;
  bodyRateComparativa: any;
  daticolli: any = {};
  translations: any;
  formShipment: FormGroup;
  isDocumentShipment: boolean;
  outwardCostExposure: any = [];
  returnCostExposure: any = [];
  chosenCourier: any = {
    outward: { serviceName: "" },
    return: { serviceName: "" },
  };
  canContinue: boolean = false;
  iva: number;
  errors: any = {};
  showModal: boolean = false;

  setDatiColli() {
    let dimensions = this.formShipment.value.dimensions.map(
      (dimension: any) => {
        return {
          lunghezza: parseFloat(dimension.lunghezza.replaceAll(",", ".")),
          larghezza: parseFloat(dimension.larghezza.replaceAll(",", ".")),
          altezza: parseFloat(dimension.altezza.replaceAll(",", ".")),
          peso: parseFloat(dimension.peso.replaceAll(",", ".")),
        };
      }
    );

    const pesoTot = dimensions
      .map((value: { peso: any }) => value.peso)
      .reduce((a: any, b: any) => a + b, 0);
    const volumeTot = dimensions
      .map(
        (value: { altezza: any; larghezza: any; lunghezza: any }) =>
          (value.lunghezza * value.larghezza * value.altezza) / 1000000
      )
      .reduce((a: any, b: any) => a + b, 0);

    this.daticolli = {
      colli: dimensions.length,
      daticolli: dimensions,
      peso: pesoTot,
      volume: volumeTot,
    };
  }

  confirmInsurance() {
    let packageErrors = {};
    this.fieldsLabel.forEach((field: any) => {
      this.dimensions.controls.forEach((control: any) => {
        if (control.get(field.label)?.errors != null) {
          packageErrors = control.get(field.label)?.errors;
        }
      });
    });
    if (this.formShipment.valid) {
      // setting the insurance value at 100 if checkbox is checked at 0 if not
      if (this.formShipment.value.outwardInsurance === true) {
        this.formShipment.controls["outwardInsurance"].setValue(100);
        this.store.outwardInsurance = 100;
      } else if (this.formShipment.value.outwardInsurance === false) {
        this.formShipment.controls["outwardInsurance"].setValue(0);
      } else {
        this.store.outwardInsurance = this.formShipment.value.outwardInsurance;
      }
      if (this.formShipment.value.returnInsurance === true) {
        this.store.returnInsurance = 100;
      } else if (this.formShipment.value.returnInsurance === false) {
        this.formShipment.controls["returnInsurance"].setValue(0);
      } else {
        this.store.returnInsurance = this.formShipment.value.returnInsurance;
      }
      if (this.formShipment.valid) {
        if (this.currentModule.packagesDetails.enable) {
          this.setDatiColli();
        }
        this.store.codiceSconto = this.formShipment.value.codiceSconto;
        this.isLoading = true;

        this.bodyRateComparativa = {
          ...this.daticolli,
          documenti: this.store.isDocumentShipment ? 1 : 0,
          codice_sconto: this.formShipment.value.codiceSconto,
          tipo_listino: "passivo",
          client_id: this.store.configuration.client_id,
        };

        this.setShipmentPayload();
        this.showInput = false;

        // rateComparative di andata
        const outwardBodyRateComparativa = {
          ...this.bodyRateComparativa,
          valore: this.store.outwardInsurance
            ? this.store.outwardInsurance
            : this.formShipment.value.outwardInsurance,
          sender_cap: this.store.sender.sender_cap,
          sender_addr: this.store.sender.sender_addr,
          sender_city: this.store.sender.sender_city,
          sender_country_code: this.store.sender.sender_country_code,
          rcpt_cap: this.store.recipient.rcpt_cap,
          rcpt_addr: this.store.recipient.rcpt_addr,
          rcpt_city: this.store.recipient.rcpt_city,
          rcpt_country_code: this.store.recipient.rcpt_country_code,
        };
        this.handleRateComparative(outwardBodyRateComparativa).subscribe(
          // TODO aggiungere IVA
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
          const returnBodyRateComparativa = {
            ...this.bodyRateComparativa,
            valore: this.store.returnInsurance
              ? this.store.returnInsurance
              : this.formShipment.value.returnInsurance,
            //Inverto gli indirizzi di sender e recipient
            sender_cap: this.store.recipient.rcpt_cap,
            sender_addr: this.store.recipient.rcpt_addr,
            sender_city: this.store.recipient.rcpt_city,
            sender_country_code: this.store.recipient.rcpt_country_code,
            rcpt_cap: this.store.sender.sender_cap,
            rcpt_addr: this.store.sender.sender_addr,
            rcpt_city: this.store.sender.sender_city,
            rcpt_country_code: this.store.sender.sender_country_code,
          };
          this.handleRateComparative(returnBodyRateComparativa).subscribe(
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
    } else {
      this.showModal = true;
      this.errors = {
        ...this.service.showModal(this.formShipment),
        ...packageErrors,
      };
    }
  }
  setCloseModal(event: boolean) {
    this.showModal = event;
  }

  setShipmentPayload() {
    this.store.payloadShipment = {
      creazione_postuma: this.store.hasPayment,
      client_id: this.store.configuration.client_id,
      origine: this.store.sender.sender_country_code,
      ...this.daticolli,
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
    body.daticolli = JSON.stringify(body.daticolli);
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    return this.http.get(
      environment.API_URL + decoded.instance + "/RateComparativa",
      { headers: headers, params: body }
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

          this.service
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

      case "DYNAMIC":
      default:
        return response;
    }
  }

  handleShipments() {
    this.store.invoice &&
      (this.store.payloadShipment.fattura_dhl = [this.store.invoice]),
      (this.store.payloadShipment.documenti = this.store.isDocumentShipment
        ? 1
        : 0);
    this.store.payloadShipment.creazione_postuma = this.store.hasPayment;
    // this.store.payloadShipment.creazione_postuma = true;
    this.store.payloadShipment.valore = this.store.outwardInsurance;

    const outwardPayloadShipment = {
      ...this.store.payloadShipment,
      ...this.store.sender,
      ...this.store.recipient,
      corriere: this.store.chosenCourier.outward.courierCode,
      servizio: this.store.chosenCourier.outward.serviceCode,
    };
    if (this.store.selectedProducts) {
      outwardPayloadShipment[this.store.productDestination] =
        this.store.selectedProducts;
    }

    this.service.handleShipment(outwardPayloadShipment).subscribe((res) => {
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
      const returnPayloadShipment = {
        ...this.store.payloadShipment,
        servizio: this.store.chosenCourier.return.serviceCode,
        corriere: this.store.chosenCourier.return.courierCode,
        ...this.service.invertAddressData({
          ...this.store.sender,
          ...this.store.recipient,
        }),
      };
      this.service.handleShipment(returnPayloadShipment).subscribe((res) => {
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
    } else {
      this.showModal = true;
      this.errors = {};
      this.errors = {
        selectCourier: "required",
      };
    }
  }
}

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
    this.pointPickup = this.currentModule.pickup.dropoff;
    this.homePickup = this.currentModule.pickup.pickup;
    this.formShipment = fb.group({
      dimensions: this.fb.array([]),
      outwardInsurance: [
        this.store.outwardInsurance ? this.store.outwardInsurance : "",
        [ValidateInsurance],
      ],
      codiceSconto: this.store.codiceSconto,
      returnInsurance: [
        this.store.returnInsurance ? this.store.returnInsurance : "",
        [ValidateInsurance],
      ],
    });
    this.iva = this.store.configuration.vatPercentage;
    if (!this.store.hasPayment) {
      this.confirmInsurance();
    }
  }

  ngOnInit(): void {
    if (this.currentModule.packagesDetails.enable) {
      if (this.store.packages.length > 0) {
        this.packageNumber = this.store.packages.length;
        this.addFilledPackages();
      } else {
        this.addPackage();
      }
    } else {
      this.daticolli = {
        colli: 1,
        peso: 0.5,
        volume: 0,
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

  newPackage(
    lunghezza = "",
    larghezza = "",
    altezza = "",
    peso = ""
  ): FormGroup {
    return this.fb.group({
      lunghezza: ["" + lunghezza, ValidatePackage],
      larghezza: ["" + larghezza, ValidatePackage],
      altezza: ["" + altezza, ValidatePackage],
      peso: ["" + peso, ValidatePackage],
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

  addFilledPackages() {
    this.store.packages.forEach((pack: any) => {
      this.dimensions.push(
        this.newPackage(pack.lunghezza, pack.larghezza, pack.altezza, pack.peso)
      );
    });
  }

  showCourierSelection: boolean = false;
  currentModule: any;
  couriers?: Array<any>;
  label: any;
  fieldsLabel: any;
  pickupAvailability: any = {};
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
  homePickup: boolean;
  pointPickup: boolean;
  pickupMode: any = {};

  setDatiColli() {
    const dimensions = this.formShipment.value.dimensions.map(
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
    this.store.packages = dimensions;
  }

  // setting the insurance value at 100 if checkbox is checked at 0 if not
  setInsurances() {
    if (this.formShipment.value.outwardInsurance === true) {
      this.formShipment.controls["outwardInsurance"].setValue(100);
      this.store.outwardInsurance = 100;
    } else if (this.formShipment.value.outwardInsurance === false) {
      this.formShipment.controls["outwardInsurance"].setValue(0);
      this.store.outwardInsurance = 0;
    } else {
      this.store.outwardInsurance = this.formShipment.value.outwardInsurance;
    }
    if (this.formShipment.value.returnInsurance === true) {
      this.store.returnInsurance = 100;
    } else if (this.formShipment.value.returnInsurance === false) {
      this.formShipment.controls["returnInsurance"].setValue(0);
      this.store.returnInsurance = 0;
    } else {
      this.store.returnInsurance = this.formShipment.value.returnInsurance;
    }
  }

  confirmInsurance() {
    let packageErrors = {};
    this.fieldsLabel &&
      this.fieldsLabel.forEach((field: any) => {
        this.dimensions.controls.forEach((control: any) => {
          if (control.get(field.label)?.errors != null) {
            packageErrors = control.get(field.label)?.errors;
          }
        });
      });
    if (this.formShipment.valid) {
      this.setInsurances();
      if (this.currentModule.packagesDetails.enable) {
        this.setDatiColli();
      }
      if (
        this.store.modules.filter((module: any) => {
          return module.module === "vodafone";
        }).length === 1
      ) {
        const packageDimension = 20;
        const volume =
          (packageDimension * packageDimension * packageDimension) / 1000000;
        this.daticolli = {
          colli: 1,
          peso: 1,
          volume: volume,
          daticolli: {
            peso: 1,
            altezza: packageDimension,
            larghezza: packageDimension,
            lunghezza: packageDimension,
            volume: volume,
          },
        };
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
          this.selectCourier("outward", this.outwardCostExposure[0]);
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
            this.selectCourier("return", this.returnCostExposure[0]);
            this.returnCostExposure = this.filterRateComparativeResults(
              true, //is return
              this.currentModule.selectCourier.returnCouriers.selectionMode,
              this.returnCostExposure
            );
            this.isLoading = false;
          }
        );
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
    const noteSender = this.store.noteSenderOnSender
      ? this.store.senderExtras.note_sender
      : this.store.recipientExtras.note_sender;

    this.store.payloadShipment = {
      note_sender: noteSender,
      creazione_postuma: this.store.hasPayment,
      client_id: this.store.configuration.client_id,
      origine: this.store.sender.sender_country_code,
      documenti: this.store.isDocumentShipment ? 1 : 0,
      ...this.daticolli,
    };
  }

  selectCourier(type: string, service: any) {
    this.clearPickupAviability();
    this.chosenCourier[type] = service;
    if (this.chosenCourier.outward.serviceName !== "") {
      if (!this.store.hasReturnShipment) {
        this.canContinue = true;
      } else if (this.chosenCourier.return.serviceName !== "") {
        this.canContinue = true;
      }
    }
  }

  checkPickupAviability(courier: string) {
    let sameDay = false;
    let now = new Date();
    // const offset = now.getTimezoneOffset();
    const currentHours = now.getHours();
    const isWeekend = now.getDay() >= 5 ? true : false;
    console.log(now);
    console.log(currentHours);
    if (
      this.currentModule.pickup.pickupSameDayCheck &&
      currentHours < 15 &&
      now.getDay() <= 5
    ) {
      this.service.pickupAvailability(courier).subscribe(
        (res: any) => {
          console.log(res);
          if (res.result === "OK") {
            this.pickupAvailability[courier] = "oggi dalle 15:00 alle 18:00";
            this.pickupMode = {
              date_req_ritiro:
                now.toISOString().split("T")[0] + " " + "15:00:00",
              opening_time: "15:00:00",
              closing_time: "18:00:00",
            };
          }
        },
        (error: any) => {}
      );
    } else {
      console.log(now.getDay());
      let date_req_ritiro: any =
        now.getFullYear() +
        "-" +
        ("00" + (now.getMonth() + 1)).slice(-2) +
        "-" +
        (
          "00" +
          (isWeekend
            ? now.getDate() + (7 - now.getDay() === 0 ? 7 : now.getDay()) + 1
            : now.getDate() + 1)
        ).slice(-2) +
        " " +
        "09:00:00";
      console.log("date_req_ritiro", date_req_ritiro);
      this.pickupAvailability[courier] =
        "il prossimo giorno lavorativo dalle 09:00 alle 18:00";
      this.pickupMode = {
        date_req_ritiro: date_req_ritiro,
        opening_time: "09:00:00",
        closing_time: "18:00:00",
      };
    }
  }

  clearPickupAviability() {
    this.pickupAvailability = {};
    this.pickupMode = {};
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
    const outwardPayloadShipment = {
      ...this.store.payloadShipment,
      ...this.store.sender,
      ...this.store.recipient,
      ...this.pickupMode,
      valore: this.store.outwardInsurance,
      corriere: this.store.chosenCourier.outward.courierCode,
      servizio: this.store.chosenCourier.outward.serviceCode,
    };
    if (this.store.invoice) {
      const outwardInvoice = {
        nolo: this.store.chosenCourier["outward"].data.nolo,
        totale_fattura: this.store.chosenCourier["outward"].data.totale,
        assicurazione: this.store.outwardInsurance,
        valore: this.store.outwardInsurance,
      };
      outwardPayloadShipment.fattura_dhl = [
        { ...this.store.invoice, ...outwardInvoice },
      ];
    }
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
        valore: this.store.returnInsurance,
        servizio: this.store.chosenCourier.return.serviceCode,
        corriere: this.store.chosenCourier.return.courierCode,
        ...this.service.invertAddressData({
          ...this.store.sender,
          ...this.store.recipient,
        }),
      };
      if (this.store.invoice) {
        const returnInvoice = {
          nolo: this.store.chosenCourier["return"].data.nolo,
          totale_fattura: this.store.chosenCourier["return"].data.totale,
          assicurazione: this.store.returnInsurance,
          valore: this.store.returnInsurance,
        };
        returnPayloadShipment.fattura_dhl = [
          { ...this.store.invoice, ...returnInvoice },
        ];
      }
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

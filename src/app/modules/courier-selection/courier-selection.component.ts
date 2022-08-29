import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/app/enviroment";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-courier-selection",
  templateUrl: "./courier-selection.component.html",
})
export class CourierSelectionComponent {
  constructor(
    public service: StatusService,
    public store: StoreService,
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpClient
  ) {
    console.log(this.router.url);
    this.currentModule = this.store.configuration.modules.filter(
      (module: any) => module.moduleName === "courier-selection"
    )[0].moduleConfig;
    this.store.hasReturnShipment = this.currentModule.returnLabel.enable;
    this.translations = store.translations;
    this.isDocumentShipment = this.currentModule.documentFlag;
    this.store.isDocumentShipment = this.store.isDocumentShipment
      ? this.store.isDocumentShipment
      : this.currentModule.documentFlag;
    this.pointPickup = this.currentModule.pickup.dropoff;
    this.homePickup = this.currentModule.pickup.pickup;
    this.iva = this.store.configuration.vatPercentage;
    this.couriers = this.currentModule.selectCourier.couriers.list;
    
  }

  showCourierSelection: boolean = false;
  currentModule: any;
  couriers?: Array<any>;
  fieldsLabel: any;
  pickupAvailability: any = {};
  packageNumber = 0;
  isLoading: boolean = false;
  showInput: boolean = true;
  bodyRateComparativa: any;
  daticolli: any = {};
  translations: any;
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
  isGoodDocument: number = 1;
  showGoods_type: boolean = false;

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

    // !this.isDocumentShipment
    //   ? (this.store.payloadShipment.merce =
    //       this.formShipmentData.value[this.translations.lbl_goods_type])
    //   : null;
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
    let now = new Date();
    const currentHours = now.getHours();
    const festivities: any = [
      [0, 1],
      [3, 25],
      [4, 1],
      [5, 2],
      [7, 15],
      [10, 1],
      [11, 8],
      [11, 25],
      [11, 26],
      [11, 31],
    ];

    const easter = this.getEaster(now.getFullYear());
    festivities.push(easter);
    festivities.push([easter[0], easter[1] + 1]);
    console.log(festivities);
    const currentDay = [now.getMonth(), now.getDate()];

    if (
      this.currentModule.pickup.pickupSameDayCheck &&
      currentHours < 15 &&
      now.getDay() <= 5 &&
      now.getDay() !== 0 &&
      festivities.filter(
        (day: any) => day[0] === currentDay[0] && day[1] === currentDay[1]
      ).length === 0
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
      let nextWorkingDay = now;

      let isBusinessDay;
      do {
        isBusinessDay = true;
        nextWorkingDay = new Date(
          nextWorkingDay.setDate(nextWorkingDay.getDate() + 1)
        );
        if (nextWorkingDay.getDay() >= 5 || nextWorkingDay.getDay() === 0) {
          isBusinessDay = false;
        }

        if (isBusinessDay) {
          const nextDay = [nextWorkingDay.getMonth(), nextWorkingDay.getDate()];
          if (
            festivities.filter(
              (day: any) => day[0] === nextDay[0] && day[1] === nextDay[1]
            ).length > 0
          ) {
            isBusinessDay = false;
          }
        }
      } while (!isBusinessDay);
      console.log(nextWorkingDay);

      this.pickupAvailability[courier] =
        "il prossimo giorno lavorativo dalle 09:00 alle 18:00";
      this.pickupMode = {
        date_req_ritiro:
          nextWorkingDay.toISOString().split("T")[0] + " " + "09:00:00",
        opening_time: "09:00:00",
        closing_time: "18:00:00",
      };
    }
  }

  clearPickupAviability() {
    this.pickupAvailability = {};
    this.pickupMode = {};
    this.homePickup = true;
  }

  getEaster(year: number) {
    var f = Math.floor,
      // Golden Number - 1
      G = year % 19,
      C = f(year / 100),
      // related to Epact
      H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
      // number of days from 21 March to the Paschal full moon
      I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
      // weekday for the Paschal full moon
      J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
      // number of days from 21 March to the Sunday on or before the Paschal full moon
      L = I - J,
      month = 3 + f((L + 40) / 44),
      day = L + 28 - 31 * f(month / 4);

    return [month, day];
  }

  handleRateComparative(body: any): Observable<any> {
    if (this.currentModule.packagesDetails.enable) {
      body.daticolli = JSON.stringify(body.daticolli);
    }
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    return this.http.get(
      environment.API_URL + decoded.instance + "/RateComparativa",
      { headers: headers, params: body }
    );
  }

  filterRateComparativeResults(isReturn: boolean, mode: string, response: any) {
    const sameDestination =
      this.store.sender.sender_country_code ===
      this.store.recipient.rcpt_country_code
        ? 1
        : 0;
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
                  // if (service.domestic ? service.domestic : 1 === sameDestination) {
                  return service.gspedServiceCode;
                  // }
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
                //if (service.domestic ? service.domestic : 1 === sameDestination) {
                return service.gspedServiceCode;
                // }
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
        assicurazione:
          this.store.chosenCourier["outward"].data.varie_dettaglio[
            this.store.isDocumentShipment
              ? "IB-EXTENDED LIABILITY"
              : "II-SHIPMENT INSURANCE"
          ],
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

    this.service.handleShipment(outwardPayloadShipment).subscribe(
      (res) => {
        this.store.outwardShipment = res;
        if (!this.store.hasReturnShipment) {
          this.router.navigate(
            [this.store.modules[this.store.currentStep++].module],
            {
              queryParamsHandling: "merge",
            }
          );
        } else {
          // inverto il mittente con il destinatario per la spedizione di ritorno
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
              assicurazione:
                this.store.chosenCourier["return"].data.varie_dettaglio[
                  this.store.isDocumentShipment
                    ? "IB-EXTENDED LIABILITY"
                    : "II-SHIPMENT INSURANCE"
                ],
              valore: this.store.returnInsurance,
            };
            returnPayloadShipment.fattura_dhl = [
              { ...this.store.invoice, ...returnInvoice },
            ];
          }
          this.service.handleShipment(returnPayloadShipment).subscribe(
            (res) => {
              this.store.returnShipment = res;
              this.router.navigate(
                [this.store.modules[this.store.currentStep++].module],
                {
                  queryParamsHandling: "merge",
                }
              );
            },
            (error) => {
              this.showModal = true;
              this.errors = {};
              this.errors = {
                errore: "errore temporaneo, riprova più tardi",
              };
              // alert("errore temporaneo, riprova più tardi");
            }
          );
        }
      },
      (error) => {
        this.showModal = true;
        this.errors = {};
        this.errors = {
          errore: "errore temporaneo, riprova più tardi",
        };
      }
    );
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

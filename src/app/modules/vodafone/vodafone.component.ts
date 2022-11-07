import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StatusService } from "../../status.service";
import { StoreService } from "../../store.service";

@Component({
  selector: "app-vodafone",
  templateUrl: "./vodafone.component.html",
})
export class VodafoneComponent {
  constructor(
    public fb: FormBuilder,
    public service: StatusService,
    public store: StoreService,
    private router: Router
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "vodafone"
    )[0].moduleConfig;
    
    // dovrebbe essere nello stesso modulo
    const courierModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "select-courier"
    )[0].moduleConfig;

    this.formVodafone = fb.group({
      description: ["", [Validators.nullValidator]],
    });
    this.store.productDestination = this.currentModule.destination;
    this.translations = this.store.translations;
    this.choices = this.currentModule.choices;
    this.selected = this.choices[0].choice;
    this.choiceText = this.choices[0].text;
    this.products = this.currentModule.productList;
    // dovrebbe essere nello stesso modulo
    this.currentModule.pickup = {
      dropoff: true,
      showServicePoints: true,
      pickup: true,
      pickupSameDayCheck: true,
    };
    this.handleSetProduct(this.selected, 0);
    this.courier =
      courierModule.selectCourier.couriers.list[0].gspedCourierCode;
    this.serviceCourier =
      courierModule.selectCourier.couriers.list[0].services.list[0].gspedServiceCode;
  }

  currentModule: any = {};
  products: any = {};
  selected: any;
  formVodafone!: FormGroup;
  choices: any;
  choiceText!: string;
  otherProducts: string =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  currentProduct: any =
    "border-[#C7312A] text-[#C7312A] w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  translations: any = {};
  loadingPickup: boolean = false;
  loadingShipment: boolean = false;
  selectProductNumber: number = 0;
  pickupAvailability: any = {};
  pickupMode: any;
  courier?: number;
  serviceCourier?: number;
  showModal: boolean = false;
  errors: any = {};

  handleSetProduct(type: any, index: number) {
    if (this.loadingPickup) {
      return;
    }
    this.selected = type;
    this.choiceText = this.choices[index].text;
    if (type === "RITIRO A DOMICILIO") {
      this.loadingPickup = true;
      this.store.isHomePickup = true;
      this.checkPickupAviability(this.courier || 104);
    } else {
      this.store.isHomePickup = false;
      this.clearPickupAviability();
    }
  }

  checkPickupAviability(courier: number) {
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
          if (res.result === "OK") {
            this.pickupAvailability[courier] =
              this.translations.lbl_pickup_same_day;
            this.pickupMode = {
              date_req_ritiro:
                now.toISOString().split("T")[0] + " " + "15:00:00",
              opening_time: "15:00:00",
              closing_time: "18:00:00",
            };
          }
          this.loadingPickup = false;
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
      this.pickupAvailability[courier] =
        this.translations.lbl_pickup_next_working_day;
      this.pickupMode = {
        date_req_ritiro:
          nextWorkingDay.toISOString().split("T")[0] + " " + "09:00:00",
        opening_time: "09:00:00",
        closing_time: "18:00:00",
      };
      this.loadingPickup = false;
    }
  }

  clearPickupAviability() {
    this.pickupAvailability = {};
    this.pickupMode = {};
  }

  getEaster(year: number) {
    var f = Math.floor,
      G = year % 19,
      C = f(year / 100),
      H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
      I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
      J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
      L = I - J,
      month = 3 + f((L + 40) / 44),
      day = L + 28 - 31 * f(month / 4);
    return [month, day];
  }

  selectProduct(product: any, index: number) {
    let auxProduct = product;
    if (auxProduct.selected === true) {
      auxProduct.selected = false;
      this.selectProductNumber--;
    } else {
      this.selectProductNumber++;
      auxProduct.selected = true;
    }
    this.products[index] = auxProduct;
  }

  setShipmentPayload() {
    const noteSender = this.store.noteSenderOnSender
      ? this.store.senderExtras.note_sender
      : this.store.recipientExtras.note_sender;

    const packageDimension = 20;
    const volume =
      (packageDimension * packageDimension * packageDimension) / 1000000;

    this.store.payloadShipment = {
      note_sender: noteSender,
      creazione_postuma: this.store.hasPayment,
      client_id: this.store.configuration.client_id,
      origine: this.store.sender.sender_country_code,
      documenti: this.store.isDocumentShipment ? 1 : 0,
      ...this.pickupMode,
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

  nextStep() {
    this.loadingShipment = true;
    if (this.selectProductNumber <= 0) {
      this.showModal = true;
      this.errors = {};
      this.errors = {
        selectProduct: "required",
      };
      this.loadingShipment = false;
      return;
    }
    const selectedProducts = this.products.map((product: any) => {
      {
        return product.selected ? product.name : null;
      }
    });
    if (this.currentModule.output === "concat_string") {
      this.store.selectedProducts = selectedProducts.join(" ");
    } else {
      // Nuove direttive da configurazione
    }
    this.store.isLastModule = true;
    if (this.store.currentStep === this.store.stepForShipment) {
      this.store.outwardCostExposure[0] = {
        courierCode: this.courier,
        serviceCode: this.serviceCourier,
      };

      this.setShipmentPayload();
      this.service.createShipment();
    } else {
      this.router.navigate(
        [this.store.modules[this.store.currentStep++].module],
        {
          queryParamsHandling: "merge",
        }
      );
    }
  }
  setCloseModal(event: boolean) {
    this.showModal = event;
  }
}

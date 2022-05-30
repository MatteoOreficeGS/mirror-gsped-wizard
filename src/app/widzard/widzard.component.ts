import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SaveStatusService } from "../save-status.service";

@Component({
  selector: "app-widzard",
  templateUrl: "./widzard.component.html",
})
export class WidzardComponent implements OnInit {
  constructor(private router: Router, public saveStatus: SaveStatusService) {}

  ngOnInit(): void {}

  @Input() theme: any;

  activeStep: number = this.saveStatus.getActiveStep();

  configuration = {
    banner: "url",
    bannerExtra: "url",
    footer: "url",
    mainColor: "fff",
    i18n: ["IT-it", "EN-en", "ZH-zh"],
    client_id: 123,
    modules: [
      /* {
        moduleName: "customModuleVodafone",
        moduleLabel: "modulo custom",
        type: "select",
        productList: [
          {
            name: "Router bla bla",
            image: "url immagine",
            selectable: true,
          },
          {
            name: "Televisione",
            image: "url immagine",
            selectable: true,
          },
          {
            name: "Cellulare",
            image: "url immagine",
            selectable: true,
          },
        ],
        output: "concat_string",
        destination: "shipment_description",
      }, */
      {
        type: "text",
        moduleName: "sender",
        moduleLabel: "mittente",
        editable: true,
        hidden: false,
        autocomplete: true,
        data: {},
      },
      {
        type: "text",
        moduleName: "recipient",
        moduleLabel: "destinatario",
        editable: false,
        hidden: false,
        autocomplete: false,
        data: {
          name: "Rossi Gino",
          address: "via dei tigli 12",
          city: "Milano",
          zipcode: "12345",
          state: "MI",
          country: "IT",
          email: "test@test.it",
          phone: "123445679",
        },
      },
      {
        moduleName: "shipment",
        moduleLabel: "spedizione",
        type: "checkbox",
        couriers: [
          {
            name: "BRT",
            gspedCourierCode: 1,
            logoUrl: "url",
            services: [
              {
                gspedServiceCode: 0,
                name: "Express",
              },
            ],
            ancillaryServices: {
              insurance: true,
              cod: true,
            },
          },
        ],
        returnLabel: true,
        rating: true,
        packagesDetails: {
          fixedPackagesNumber: 1,
          enable: true,
        },
        pickup: {
          dropoff: true,
          showServicePoints: true,
          pickup: false,
          pickupSameDayCheck: false,
        },
      },
      {
        type: "external link",
        moduleName: "payment",
        moduleLabel: "pagamento",
        provider: "monetaweb",
      },
      {
        type: "button",
        moduleName: "awbPrinting",
        moduleLabel: "stampa etichetta",
        directDownload: true,
        summary: true,
      },
    ],
  };

  widzard = [
    {
      type: "Reso Facile",
      steps: {
        title: "mittente",
        fields: [
          { value: "nome", type: "text" },
          { value: "Città", type: "text" },
          { value: "codice postale", type: "text" },
          { value: "Provincia", type: "text" },
          { value: "Paese", type: "text" },
          { value: "email", type: "text" },
          { value: "numero di telefono", type: "text" },
          { value: "Indirizzo", type: "text" },
        ],
      },
      /* [
          {
            value: "Milano",
            label: "city",
            editable: false,
            type: "readonly",
            img: "city",
          },
          {
            value: "12345",
            label: "zipcode",
            editable: false,
            type: "readonly",
            img: "zipcode",
          },
          {
            value: "Mi",
            label: "state",
            editable: false,
            type: "readonly",
            img: "state",
          },
          {
            value: "IT",
            label: "country",
            editable: false,
            type: "readonly",
            img: "country",
          },
          {
            value: "test@test.it",
            label: "email",
            editable: false,
            type: "readonly",
            img: "email",
          },
          {
            value: "123456789",
            label: "phone",
            editable: false,
            type: "readonly",
            img: "phone",
          },
        ],
        /* "data" : {
          "name" : "Rossi Gino",
          "address" : "via dei tigli 12",
          "city" : "Milano",
          "zipcode" : "12345",
          "state" : "MI",
          "country" : "IT",
          "email" : "test@test.it",
          "phone" : "123445679"
        }
        [{ value: "indirizzo spedizione", type: "text", img: "" }],
        [{ value: "Vai al pagamento", type: "button", img: "" }],
        [{ value: "stampa etichetta", type: "button", img: "" }],
      ],*/
    },
  ];

  incrementStep() {
    if (this.activeStep !== this.widzard[0].steps.fields.length - 1) {
      this.activeStep += 1;
    }
    this.router.navigate([
      this.configuration.modules[this.activeStep].moduleName,
    ]);
  }

  setStep(i: number) {
    this.activeStep = i;
    this.router.navigate([
      this.configuration.modules[this.activeStep].moduleName,
    ]);
  }
}

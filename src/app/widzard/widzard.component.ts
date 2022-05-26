import { Component, Input, OnInit } from "@angular/core";
import { TextInputComponent } from "./text-input/text-input.component";

@Component({
  selector: "app-widzard",
  templateUrl: "./widzard.component.html",
  styleUrls: ["./widzard.component.css"],
})
export class WidzardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() theme: any;

  activeStep: number = 0;

  response = {
    configuration: {
      banner: "url",
      bannerExtra: "url",
      footer: "url",
      mainColor: "fff",
      i18n: ["IT-it", "EN-en", "ZH-zh"],
      client_id: 123,
      modules: [
        {
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
        },
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
    },
  };

  widzard = [
    {
      type: "Reso Facile",
      steps: [
        [
          {
            value: "Router",
            img: "https://m.media-amazon.com/images/I/51KywviQsrL._AC_SX679_.jpg",
            type: "label",
          },
          {
            value: "Televisione",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuis80ljKXCwFzi_HPJiMzZb44o_DjEjkPccpz5P8iPHLsYcA-MctJruh47aq04kWvTYA&usqp=CAU",
            type: "label",
          },
          {
            value: "Cellulare",
            img: "https://media.ldlc.com/r1600/ld/products/00/05/93/86/LD0005938686_1.jpg",
            type: "label",
          },
        ],
        [{ value: "nome mittente", type: "text", img: "" }],
        [
          { value: "Rossi Gino", type: "readonly", img: "name", label: "name" },
          {
            value: "via dei tigli 12",
            label: "address",
            editable: false,
            type: "readonly",
            img: "address",
          },
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
        } */
        [{ value: "indirizzo spedizione", type: "text", img: "" }],
        [{ value: "Vai al pagamento", type: "button", img: "" }],
        [{ value: "stampa etichetta", type: "button", img: "" }],
      ],
    },
  ];

  incrementStep() {
    if (this.activeStep !== this.widzard[0].steps.length - 1) {
      this.activeStep += 1;
    }
  }

  setIndex(i: number) {
    this.activeStep = i;
  }
}

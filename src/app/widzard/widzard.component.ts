import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widzard',
  templateUrl: './widzard.component.html',
  styleUrls: ['./widzard.component.css'],
})
export class WidzardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  activeStep: number = 0;

  widzard = [
    {
      type: 'Reso Facile',
      content: [
        {
          step: 'Modulo Ricerca Spedizione',
          fields: [
            { title: 'ID spedizione', type: 'text' },
            {
              title: 'Riferimento alfanumerico',
              type: 'text',
            },
            { title: 'Email Destinatario', type: 'email' },
            {
              title: 'Numero di telefono del destinatario',
              type: 'number',
            },
          ],
        },
        {
          step: 'Modulo RITIRO (ritiro o DropOff)',
          fields: [
            { title: 'Dati Mittente', type: 'text' },
            {
              title: 'Data e ora Pickup',
              type: 'date',
            },
            { title: 'Client ID', type: 'text' },
          ],
        },
        {
          step: 'Modulo rating spedizione',
          fields: [{ title: 'V/Documentazione', type: 'text' }],
        },
        {
          step: 'Modulo Pagamento',
          fields: [
            { title: 'Provider di pagamento', type: 'text' },
            {
              title: 'Client ID',
              type: 'text',
            },
          ],
        },
        {
          step: 'Modulo Stampa AWB',
          fields: [
            { title: 'ID Transizione', type: 'text' },
            {
              title: 'ID Spedizione',
              type: 'text',
            },
            { title: 'Provider pagamento', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'altro',
      content: [
        {
          step: 'Modulo Ricerca Spedizione',
          fields: [
            { title: 'ID spedizione', type: 'ID' },
            {
              title: 'Riferimento alfanumerico',
              type: 'Riferimento Alfanumerico',
            },
            { title: 'Email Destinatario', type: 'Email' },
            {
              title: 'Numero di telefono del destinatario',
              type: 'numero di telefono',
            },
          ],
        },
      ],
    },
  ];

  incrementStep() {
    if (this.activeStep !== this.widzard[0].content.length - 1) {
      this.activeStep += 1;
    }
  }
}

import { environment } from './../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { ExcelRow } from '../models';
import { Invoice } from '@axenda/zatca';

@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.scss']
})
export class InvoiceTemplateComponent implements OnInit {
  @Input() rowData!: ExcelRow;
  qrCodeSource!: string;

  ngOnInit(): void {
      this.loadQRCode();
  }

  loadQRCode(): void {
    const invoice = new Invoice({
      sellerName: environment.companyName,
      vatRegistrationNumber: environment.trn,
      invoiceTimestamp: this.rowData.transDate.toISOString(),
      invoiceTotal: this.rowData.totalDue.toFixed(2),
      invoiceVatTotal: this.rowData.vat.toFixed(2),
    });

    invoice.render().then(imageData => {
      this.qrCodeSource = imageData;
    });
  }
}

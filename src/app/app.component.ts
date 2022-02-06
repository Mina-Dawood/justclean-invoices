import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { ExcelRow } from './models';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  activeId!: number;
  original!: Array<ExcelRow>;
  rows!: Array<ExcelRow>;
  page!: number;

  constructor(
    public appService: AppService,
    private cd: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.appService.setBufferObject();
  }

  onFileChange(event: any) {
    this.appService.isLoading = true;
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data: AOA = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.original = this.getMappedRows(data);
      this.page = 0;
      this.rows = this.getRowsForDisplay();
      this.activeId = 2;
      this.appService.isLoading = false;

    };
    reader.readAsBinaryString(target.files[0]);
  }

  download(): void {
    this.appService.isLoading = true;
    const pdfCount = Math.round(this.original.length / 50) || 1;
    for (let index = 1; index < pdfCount; index++) {
      (async () => { 
        window.print();
        this.page = index;
        this.rows = this.getRowsForDisplay();
        this.cd.detectChanges();
        await this.delay(1000);
    })();
    };
  }

  private getRowsForDisplay(): Array<ExcelRow> {
    return this.original.slice(this.page * 50);
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


  private getMappedRows(data: AOA): Array<ExcelRow> {
    return data.slice(1).filter(item => item.length).map(item => {
      const mappedItem: ExcelRow = {
        invNumber: item[0],
        transDate: this.appService.ExcelDateToJSDate(item[1]),
        Code: item[2],
        laundry: item[3],
        tradeName: item[4],
        trn: item[5],
        description: item[6],
        commissionRevenue: item[7],
        vat: item[8],
        totalDue: item[9],
      };
      return mappedItem;
    });
  }
}

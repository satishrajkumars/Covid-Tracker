import { Component, OnInit} from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-covid-data',
  templateUrl: './covid-data.component.html',
  styleUrls: ['./covid-data.component.css']
})
export class CovidDataComponent implements OnInit {
  
  /* State Dropdown settings */
  public stateAbbreviationMap: { [key: string]: string } = {
    'Alabama': 'al',
    'Alaska': 'ak',
    'Arizona': 'az',
    'Arkansas': 'ar',
    'California': 'ca',
    'Colorado': 'co',
    'Connecticut': 'ct',
    'Delaware': 'de',
    'Florida': 'fl',
    'Georgia': 'ga',
    'Hawaii': 'hi',
    'Idaho': 'id',
    'Illinois': 'il',
    'Indiana': 'in',
    'Iowa': 'ia',
    'Kansas': 'ks',
    'Kentucky': 'ky',
    'Louisiana': 'la',
    'Maine': 'me',
    'Maryland': 'md',
    'Massachusetts': 'ma',
    'Michigan': 'mi',
    'Minnesota': 'mn',
    'Mississippi': 'ms',
    'Missouri': 'mo',
    'Montana': 'mt',
    'Nebraska': 'ne',
    'Nevada': 'nv',
    'New Hampshire': 'nh',
    'New Jersey': 'nj',
    'New Mexico': 'nm',
    'New York': 'ny',
    'North Carolina': 'nc',
    'North Dakota': 'nd',
    'Ohio': 'oh',
    'Oklahoma': 'ok',
    'Oregon': 'or',
    'Pennsylvania': 'pa',
    'Rhode Island': 'ri',
    'South Carolina': 'sc',
    'South Dakota': 'sd',
    'Tennessee': 'tn',
    'Texas': 'tx',
    'Utah': 'ut',
    'Vermont': 'vt',
    'Virginia': 'va',
    'Washington': 'wa',
    'West Virginia': 'wv',
    'Wisconsin': 'wi',
    'Wyoming': 'wy'
  };
  stateOptions: string[] = Object.keys(this.stateAbbreviationMap);
  selectedState: string = 'Arizona';

  /* Coid Data settings */
  covidData: any = [{
    'date' : '20210307',
    'state': 'AZ',
    'positive': 0,
    'negative': 0,
    'positiveIncrease': 0,
    'negativeIncrease': 0
  }];
  covidDataDateMap: { [key: string]: any } = {};
  dailyCovidData: any = this.covidData[0];

  positiveCases: number[] = [];
  negativeCases: number[] = [];
  positiveIncrease: number[] = [];
  negativeIncrease: number[] = [];

  /* Date Picker settings */
  selectedDate: Date = new Date(2021, 2, 7);
  datepickerConfig: any = {
    dateInputFormat: 'YYYY-MM-DD',
    selectFromOtherMonth: true,
    showWeekNumbers: false,
  };

  /* Line chart settings */
  public lineChartData: Array<any> = [
    { data: this.positiveCases, label: 'Covid+ Cases' }
  ];

  public lineChartLabels: Array<any> = [];

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: this.selectedState + ' state covid data holistic view'
      }
    }
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = "line";

  /* Bar chart settings */
  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: this.selectedState + ' state covid data on ' + this.selectedDate.toISOString().split('T')[0]
      }
    }
  };
  public barChartLabels: Array<string> = ['Count'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: Array<any> = [
    { data: [1], label: 'PositiveIncrease' },
    { data: [2], label: 'NegativeIncrease' }
  ];

  constructor(private covidService: CovidDataService) { }

  ngOnInit(): void {
    this.covidService.getStateCovidData(this.stateAbbreviationMap[this.selectedState])
      .subscribe((data) => {
        console.log("Fetching the data");
        this.covidData = data;
        this.covidDataDateMap = {};
        for (const dataItem of this.covidData) {
          this.covidDataDateMap[dataItem.date.toString()] = dataItem;
        }
        this.onStateChange();
      });
  }

  public onStateChange(): void {
    this.updateLineChartData(this.selectedState);
    this.updateTableData(this.selectedDate);
    this.updateBarChartData(this.selectedDate);
  }
  
  public onDateChange(): void{
    console.log(this.selectedDate);
    if(this.covidDataDateMap[this.getDateFormatted(this.selectedDate)] !== undefined ){
      this.updateTableData(this.selectedDate);
      this.updateBarChartData(this.selectedDate);
    }
    else{
      alert("No data available on this date");
    }
  }

  private updateTableData(selectedDate: Date): void{
    this.dailyCovidData = this.covidDataDateMap[this.getDateFormatted(this.selectedDate)];
  }

  private updateLineChartData(selectedState: string): void {
    this.positiveCases = [];
    this.negativeCases = [];
    this.positiveIncrease = [];
    this.negativeIncrease = [];
    this.lineChartLabels = [];

    for (const dataItem of this.covidData) {
      this.positiveCases.push(dataItem.positive);
      this.negativeCases.push(dataItem.negative);
      this.positiveIncrease.push(dataItem.positiveIncrease);
      this.negativeIncrease.push(dataItem.negativeIncrease);
      this.lineChartLabels.push(this.getDate(dataItem));
    }

    this.positiveCases.reverse();
    this.negativeCases.reverse();
    this.lineChartLabels.reverse();

    this.lineChartData = [
      { data: this.positiveCases, label: 'Positive Cases' },
      { data: this.negativeCases, label: 'Negative Cases' },
    ];
    this.lineChartOptions.plugins.title.text = this.selectedState + ' state covid data holistic view';
  }

  private getDate(dataItem : any): string{
    const year = ~~(dataItem.date/10000);
    const month = ~~((dataItem.date/100) % 100);
    const day = ~~(dataItem.date % 100);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var formattedDate = day + " " + months[month - 1] + " " + year;

    return formattedDate;
  }

  private getDateFormatted(selectedDate : any): string{
    var date = selectedDate
    // Get the year, month, and day components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Concatenate the components to form the 'yyyymmdd' string
    const formattedDate = `${year}${month}${day}`;
    return formattedDate;
  }

  private updateBarChartData(selectedDate: Date): void {
    this.barChartLabels = ['Count'];
    console.log("Updating the barchart for date ", selectedDate);
    if (this.covidDataDateMap) {
      const latestData = this.covidDataDateMap[this.getDateFormatted(selectedDate)];
      console.log(latestData)

      if(latestData !== undefined) {
        this.barChartData[0].data = [
          latestData.positiveIncrease || 0
        ];
        this.barChartData[1].data = [
          latestData.negativeIncrease || 0
        ];
        console.log(this.barChartData);
      }
      else{
        this.barChartData[0].data = [0];
        this.barChartData[1].data = [0];
      }
    }
  }
}

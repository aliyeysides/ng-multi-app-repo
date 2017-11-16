import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SignalService {
  private signalMap = {
    "0": "Oversold Buy",
    "1": "Overbought Sell",
    "2": "Momentum Breakout",
    "3": "Momentum Breakdown",
    "4": "Reversal Buy",
    "5": "Reversal Sell",
    "6": "Money Flow Buy",
    "7": "Money Flow Sell",
    "8": "Rel. Strength Buy",
    "9": "Rel. Strength Sell",
    "10": "Rel. Strength Breakout",
    "11": "Rel. Strength Breakdown"
  };

  private alertsLookupParams: URLSearchParams;
  private signalsLookupParams: URLSearchParams;
  private apiHostName = this.utilService.getApiHostName();
  private apiPrependText = '/CPTRestSecure/app';

  private _alertsOpen: Subject<void> = new Subject<void>();
  alertsOpen$ = this._alertsOpen.asObservable();

  constructor(private utilService: UtilService) {
    this.alertsLookupParams = new URLSearchParams();
    this.signalsLookupParams = new URLSearchParams();
  }

  openAlerts() {
    this._alertsOpen.next();
  }

  public parseSignal(signal) {
    if (typeof signal == "string") {
      signal = this.toInt(signal);
    }

    let buySignalNames = [];
    let sellSignalNames = [];

    if (signal != 0) {
      for (var i = 0; i < 6; i += 1) {
        if ((signal & Math.pow(2, 2 * i)) != 0) {
          buySignalNames.push(this.signalMap[2 * i]);
        }

        if ((signal & Math.pow(2, 2 * i + 1)) != 0) {
          sellSignalNames.push(this.signalMap[2 * i + 1]);
        }
      }
    }

    return {
      sell: (sellSignalNames.length > 0),
      buy: (buySignalNames.length > 0),
      sellSignalNames: sellSignalNames,
      buySignalNames: buySignalNames
    };
  }

  public reverse(s) {
    return s.split("").reverse().join("");
  }

  public toInt(signals) {
    if (typeof signals == "string") {
      signals = this.reverse(signals.replace(/-1/g, "0"));
      signals = parseInt(signals, 2);
      return signals;
    }
    return undefined;
  };

  public getSignal(parsedSignals) {
    if (parsedSignals.sell == true && parsedSignals.buy == false) {
      return 0;
    } else if (parsedSignals.sell == false && parsedSignals.buy == true) {
      return 2;
    } else if (parsedSignals.sell == true && parsedSignals.buy == true) {
      return 1;
    }

    return -1; // no sell or buy signal
  }

  public getAlertsData(query): Observable<Array<object>> {
    const alertsLookupUrl = `${this.apiHostName}${this.apiPrependText}/midTier/getInitialData?`;
    Object.keys(query).forEach((key) => {
      this.alertsLookupParams.set(key, query[key]);
    });
    return this.utilService.getJson(alertsLookupUrl, this.alertsLookupParams);
  }

  public getSignalDataForList(listId: string, period: string, uid: string) {
    const signalsLookupUrl = `${this.apiHostName}${this.apiPrependText}/signals/getSignalDataForList?`;
    this.signalsLookupParams.set('list_ID', listId);
    this.signalsLookupParams.set('period', period);
    this.signalsLookupParams.set('uid', uid);
    return this.utilService.getJson(signalsLookupUrl, this.signalsLookupParams);
  }

  public parseAlertData(res) {
    let alertList = res['alerts'];
    let result = [];

    for (var key in alertList['earnings_surprise_alerts']) {
      for (var obj in alertList['earnings_surprise_alerts'][key]) {
        let jsonObj = {};
        jsonObj['symbol'] = obj;
        jsonObj['alert_type'] = 'earnings_surprise_alerts';
        jsonObj['alert_text'] = 'Earnings Surprise';
        jsonObj['quarter'] = alertList['earnings_surprise_alerts'][key][obj]['quarter'];
        jsonObj['new_value'] = alertList['earnings_surprise_alerts'][key][obj]['data'][0];
        jsonObj['old_value'] = alertList['earnings_surprise_alerts'][key][obj]['data'][1];
        jsonObj['per_change'] = alertList['earnings_surprise_alerts'][key][obj]['data'][2];
        jsonObj['pgr'] = this.calculatePGR(alertList['earnings_surprise_alerts'][key][obj]['data'][3]);
        jsonObj['raw_pgr'] = this.calculatePGR(alertList['earnings_surprise_alerts'][key][obj]['data'][4]);
        jsonObj['pgr_url'] = this.appendPGRImage(jsonObj['pgr'], jsonObj['raw_pgr']);
        result.push(jsonObj);
      }
    }
    for (var key in alertList['estimate_revision_alerts']) {
      for (var obj in alertList['estimate_revision_alerts'][key]) {
        let jsonObj = {};
        jsonObj['symbol'] = obj;
        jsonObj['alert_type'] = 'estimate_revision_alerts';
        jsonObj['alert_text'] = 'Estimate Revision';
        jsonObj['quarter'] = alertList['estimate_revision_alerts'][key][obj]['quarter'];
        jsonObj['new_value'] = alertList['estimate_revision_alerts'][key][obj]['data'][0];
        jsonObj['old_value'] = alertList['estimate_revision_alerts'][key][obj]['data'][1];
        jsonObj['per_change'] = alertList['estimate_revision_alerts'][key][obj]['data'][2];
        jsonObj['pgr'] = this.calculatePGR(alertList['estimate_revision_alerts'][key][obj]['data'][3]);
        jsonObj['raw_pgr'] = this.calculatePGR(alertList['estimate_revision_alerts'][key][obj]['data'][4]);
        jsonObj['pgr_url'] = this.appendPGRImage(jsonObj['pgr'], jsonObj['raw_pgr']);
        result.push(jsonObj);
      }
    }

    if (alertList['pgr_change_alerts']['DataAvailable'] == true) {
      for (var key in alertList['pgr_change_alerts']) {
        if (key != 'DataAvailable') {
          for (var obj in alertList['pgr_change_alerts'][key]) {
            let jsonObj = {};
            jsonObj['symbol'] = obj;
            jsonObj['alert_type'] = 'pgr_change_alerts';
            jsonObj['alert_text'] = 'PGR Revision';
            jsonObj['chg_direction'] = alertList['pgr_change_alerts'][key][obj]['chg_direction'];
            jsonObj['pgr'] = this.calculatePGR(alertList['pgr_change_alerts'][key][obj]['corrected_pgr']);
            jsonObj['raw_pgr'] = this.calculatePGR(alertList['pgr_change_alerts'][key][obj]['raw_pgr']);
            jsonObj['pgr_url'] = this.appendPGRImage(jsonObj['pgr'], jsonObj['raw_pgr']);
            jsonObj['new_rating'] = this.appendPGRText(jsonObj['pgr'], jsonObj['raw_pgr']);
            result.push(jsonObj);
          }
        }
      }
    }
    return result;
  }

  private calculatePGR(pgr) {
    if (pgr >= 0 && pgr < 15) {
      pgr = 1;
    } else if (pgr >= 15 && pgr < 29) {
      pgr = 2;
    } else if (pgr >= 29 && pgr < 59) {
      pgr = 3;
    } else if (pgr >= 59 && pgr < 85) {
      pgr = 4;
    } else if (pgr >= 85) {
      pgr = 5;
    } else {
      pgr = 0;
    }
    return pgr;
  }

  public appendPGRImage(pgr, rawPgr) {
    const imageUrl = 'assets/imgs/';
    if (pgr === 1 || pgr === 0) {
      return imageUrl + 'arc_VeryBearish.svg';
    } else if (pgr === 2) {
      return imageUrl + 'arc_Bearish.svg';
    } else if (pgr === 3) {
      if (pgr == rawPgr) return imageUrl + 'arc_Neutral.svg';
      if (pgr < rawPgr) return imageUrl + 'pgr-neutral-pos.svg';
      if (pgr > rawPgr) return imageUrl + 'pgr-neutral-neg.svg';
    } else if (pgr === 4) {
      return imageUrl + 'arc_Bullish.svg';
    } else if (pgr === 5) {
      return imageUrl + 'arc_VeryBullish.svg';
    } else {
      return imageUrl + 'arc_None.svg';
    }
  }

  public appendPGRText(pgr, rawPgr): string {
    if (pgr === 1) {
      return 'Very Bearish';
    } else if (pgr === 2) {
      return 'Bearish';
    } else if (pgr === 3) {
      if (pgr == rawPgr) return 'Neutral';
      if (pgr < rawPgr) return 'Neutral +';
      if (pgr > rawPgr) return 'Neutral -';
      return 'Neutral';
    } else if (pgr === 4) {
      return 'Bullish';
    } else if (pgr === 5) {
      return 'Very Bullish';
    } else {
      return 'N/A';
    }
  }

  public appendPGRClass(pgr): string {
    if (pgr === 1) {
      return 'VeryBearish';
    } else if (pgr === 2) {
      return 'Bearish';
    } else if (pgr === 3) {
      return 'Neutral';
    } else if (pgr === 4) {
      return 'Bullish';
    } else if (pgr === 5) {
      return 'VeryBullish';
    } else {
      return '';
    }
  }

  public appendSliderClass(pgr: number): string {
    switch (pgr) {
      case 5:
        return 'slider-veryBullish';
      case 4:
        return 'slider-bullish';
      case 3:
        return 'slider-neutral';
      case 2:
        return 'slider-bearish';
      case 1:
        return 'slider-veryBearish';
    }
  }

  public appendSliderBarClass(pgr: number): string {
    switch (pgr) {
      case 5:
        return 'sliderbar-veryBullish';
      case 4:
        return 'sliderbar-bullish';
      case 3:
        return 'sliderbar-neutral';
      case 2:
        return 'sliderbar-bearish';
      case 1:
        return 'sliderbar-veryBearish';
    }
  }
}

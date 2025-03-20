import axios, { AxiosResponse } from 'axios';

export interface EthConversionRate {
  BTC: number;
  USD: number;
  EUR: number;
}

export const getEthConversionRate = (): Promise<AxiosResponse<EthConversionRate>> => {
  return axios.get(
    'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR',
  );
};

export interface CreateTransactionResponse {
  ReturnCode:          string;
  TicketId:            string;
  eCollectUrl:         string;
  ReturnDesc:          string;
  LifetimeSecs:        number;
  TransactionResponse: TransactionResponse;
  SubservicesArray:    any[];
}

export interface TransactionResponse {
  EntityCode:       string;
  TicketId:         string;
  TrazabilityCode:  string;
  TranState:        string;
  ReturnCode:       string;
  TransValue:       number;
  TransVatValue:    number;
  PayCurrency:      string;
  CurrencyRate:     number;
  BankProcessDate:  Date;
  FICode:           string;
  FiName:           string;
  PaymentSystem:    string;
  TransCycle:       string;
  Invoice:          string;
  ReferenceArray:   any[];
  OperationArray:   any[];
  SrvCode:          string;
  PaymentDesc:      string;
  PaymentInfoArray: any[];
  PaymentsArray:    any[];
  SessionToken:     string;
  Subscription:     null;
  SubservicesArray: any[];
}

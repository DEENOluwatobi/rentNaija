import { string } from "zod";
import { PaginationLink } from "./apartment"

 

export type TransactionInterface = {}

export interface FeatureInterface{
  plan_id?:number;
  name?:string;
  slug?:string;
  description?:any;
  value?:any;
  sort_order?:number;
  resettable_period?:number;
  resetable_interface?:string;
  created_at?:Date|string;
  updated_at?: Date|string;
  deleted_at?:Date|string;
}


export type PlansInterface = {
  'id'?:number,
    'name': any,
    'slug': string,
    'description'?: any  ,
    'is_active'?: boolean  ,
    'price'?: string|number ,
    'signup_fee?': number  ,
    'currency'?: string,
    'trial_period'?: number  ,
    'trial_interval'?: string ,
    'invoice_period'?: number  ,
    'invoice_interval'?: string  ,
    'grace_period'?: number  ,
    'grace_interval'?: string  ,
    'prorate_day'?: number  ,
    'prorate_period'?: number  ,
    'prorate_extend_due'?: number  ,
    'active_subscribers_limit'?: number  ,
    'sort_order'?: number, 
    'features':FeatureInterface[]
}


export interface ApiPlansResponse{
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: PlansInterface[]|[]|null|undefined;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url?: string  ;
    path: string;
    per_page: number;
    prev_page_url?: string  ;
    to: number;
    total: number;
  };
}


  export interface ApiSubscriptionResponse {
    success: boolean;
    message: string;
    data: {
      current_page: number;
      data: SubscriptionInterface[]|[]|null|undefined;
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: PaginationLink[];
      next_page_url?: string  ;
      path: string;
      per_page: number;
      prev_page_url?: string  ;
      to: number;
      total: number;
    };
  }

export type SubscriptionInterface = {
    'id':number,
    'subscriber_type': string,
    'subscriber_id': number,
    'name': any,
    'slug': string,
    'description': string,
    'timezone': string,
    'trial_ends_at'?: Date  ,
    'starts_at'?: Date  ,
    'ends_at'?: Date  ,
    'cancels_at'?: Date  ,
    'canceled_at'?: Date  ,
    'plan': PlansInterface
}


export type TransactionHistory={
id:number;
reference:string;
user_id:number;
payable_type:string;
payable_id:number;
gateway_transaction_id?:number;
amount:number;
currency:string;
status:string;
receipt_url?:string;
created_at:Date|string;
updated_at:Date|string;
payable?:any;
gateway?:any;
}


export type bankInterface={
id:number;
bank_name:string;
account_name:string;
account_number:number;
icon?:string;
bank_icon?:string;
created_at:Date|string;
updated_at:Date|string;

}
import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CustomerName = string;
export type Time = bigint;
export interface BookingRequest {
    id: bigint;
    customerName: CustomerName;
    serviceType: ServiceType;
    preferredDate: PreferredDate;
    address: Address;
    requestTime: Time;
    phoneNo: PhoneNo;
}
export type PhoneNo = string;
export type PreferredDate = string;
export type Address = string;
export enum ServiceType {
    plumber = "plumber",
    cleaning = "cleaning",
    electrician = "electrician",
    acRepair = "acRepair",
    carpenter = "carpenter"
}
export interface backendInterface {
    getAllBookings(): Promise<Array<BookingRequest>>;
    submitBooking(customerName: CustomerName, phoneNo: PhoneNo, serviceType: ServiceType, preferredDate: PreferredDate, address: Address): Promise<bigint>;
}

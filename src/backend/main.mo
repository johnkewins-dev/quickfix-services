import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

actor {
  type CustomerName = Text;
  type PhoneNo = Text;
  type PreferredDate = Text;
  type Address = Text;

  type ServiceType = {
    #plumber;
    #electrician;
    #carpenter;
    #acRepair;
    #cleaning;
  };

  module ServiceType {
    public func compare(x : ServiceType, y : ServiceType) : Order.Order {
      switch (x, y) {
        case (#plumber, #plumber) { #equal };
        case (#plumber, _) { #less };
        case (#electrician, #plumber) { #greater };
        case (#electrician, #electrician) { #equal };
        case (#electrician, _) { #less };
        case (#carpenter, #acRepair or #cleaning) { #less };
        case (#carpenter, #carpenter) { #equal };
        case (#carpenter, _) { #greater };
        case (#acRepair, #cleaning) { #less };
        case (#acRepair, #acRepair) { #equal };
        case (#acRepair, _) { #greater };
        case (#cleaning, #cleaning) { #equal };
        case (#cleaning, _) { #greater };
      };
    };
  };

  type BookingRequest = {
    id : Nat;
    customerName : CustomerName;
    phoneNo : PhoneNo;
    serviceType : ServiceType;
    preferredDate : PreferredDate;
    address : Address;
    requestTime : Time.Time;
  };

  module BookingRequest {
    public func compare(x : BookingRequest, y : BookingRequest) : Order.Order {
      switch (Int.compare(x.requestTime, y.requestTime)) {
        case (#equal) { Nat.compare(x.id, y.id) };
        case (order) { order };
      };
    };
  };

  let bookings = Map.empty<Nat, BookingRequest>();
  var nextBookingId = 0;
  let adminPrincipal = Principal.fromText("2vxsx-fae");

  func assertAdmin(caller : Principal) {
    if (caller != adminPrincipal) { Runtime.trap("Only admin can perform this action") };
  };

  public shared ({ caller }) func submitBooking(
    customerName : CustomerName,
    phoneNo : PhoneNo,
    serviceType : ServiceType,
    preferredDate : PreferredDate,
    address : Address,
  ) : async Nat {
    let bookingId = nextBookingId;
    let booking : BookingRequest = {
      id = bookingId;
      customerName;
      phoneNo;
      serviceType;
      preferredDate;
      address;
      requestTime = Time.now();
    };
    bookings.add(bookingId, booking);
    nextBookingId += 1;
    bookingId;
  };

  public shared ({ caller }) func getAllBookings() : async [BookingRequest] {
    assertAdmin(caller);
    bookings.values().toArray().sort();
  };
};

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Hammer,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Search,
  Sparkles,
  Star,
  Users,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ServiceType } from "./backend";
import { useActor } from "./hooks/useActor";

const queryClient = new QueryClient();

const SERVICES = [
  {
    id: ServiceType.plumber,
    name: "Plumber",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-50",
    description:
      "Pipe repairs, leakage fixes, bathroom fitting, drainage solutions.",
  },
  {
    id: ServiceType.electrician,
    name: "Electrician",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    description:
      "Wiring, switchboard repairs, fan/light installation, safety checks.",
  },
  {
    id: ServiceType.carpenter,
    name: "Carpenter",
    icon: Hammer,
    color: "text-orange-500",
    bg: "bg-orange-50",
    description:
      "Furniture repair, door/window fixes, custom woodwork solutions.",
  },
  {
    id: ServiceType.acRepair,
    name: "AC Repair",
    icon: Wind,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    description:
      "AC servicing, gas refill, cooling issues, installation support.",
  },
  {
    id: ServiceType.cleaning,
    name: "Cleaning Services",
    icon: Sparkles,
    color: "text-green-500",
    bg: "bg-green-50",
    description:
      "Deep home cleaning, bathroom sanitization, kitchen & sofa cleaning.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Kumar",
    location: "Tiruvallur Town",
    service: "Plumber",
    rating: 5,
    text: "The plumber arrived within 2 hours and fixed our bathroom pipe leak perfectly. Very professional and reasonable pricing. Highly recommended!",
    initials: "RK",
  },
  {
    name: "Priya Lakshmi",
    location: "Poonamallee",
    service: "AC Repair",
    rating: 5,
    text: "AC was not cooling at all. QuickFix technician came the same day, did the service and gas refill. Works like new now! Great service.",
    initials: "PL",
  },
  {
    name: "Venkatesh S.",
    location: "Avadi",
    service: "Electrician",
    rating: 5,
    text: "Had a short circuit issue at home. The electrician was skilled, fixed it quickly, and also checked all our switches for safety. Excellent work!",
    initials: "VS",
  },
];

interface BookingForm {
  name: string;
  phone: string;
  service: ServiceType | "";
  date: string;
  address: string;
}

function BookingModal({
  open,
  onOpenChange,
  defaultService,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultService?: ServiceType;
}) {
  const { actor } = useActor();
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    service: defaultService ?? "",
    date: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  const validate = () => {
    const e: Partial<BookingForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Valid 10-digit mobile number required";
    if (!form.service) e.service = "Please select a service" as any;
    if (!form.date) e.date = "Preferred date is required";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await actor!.submitBooking(
        form.name,
        form.phone,
        form.service as ServiceType,
        form.date,
        form.address,
      );
      toast.success("Booking confirmed! We'll call you shortly.", {
        description: `Service: ${SERVICES.find((s) => s.id === form.service)?.name}`,
      });
      onOpenChange(false);
      setForm({ name: "", phone: "", service: "", date: "", address: "" });
      setErrors({});
    } catch {
      toast.error("Failed to submit booking. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        data-ocid="booking.dialog"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold text-foreground">
            Book a Service
          </DialogTitle>
          <DialogDescription>
            Fill in your details and we'll confirm your booking shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="booking-name">Full Name</Label>
            <Input
              id="booking-name"
              placeholder="e.g. Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              data-ocid="booking.name_input"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p
                className="text-destructive text-xs mt-1"
                data-ocid="booking.error_state"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="booking-phone">Phone Number</Label>
            <Input
              id="booking-phone"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              data-ocid="booking.phone_input"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-destructive text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label>Service Type</Label>
            <Select
              value={form.service}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, service: v as ServiceType }))
              }
            >
              <SelectTrigger data-ocid="booking.service_select">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-destructive text-xs mt-1">{errors.service}</p>
            )}
          </div>

          <div>
            <Label htmlFor="booking-date">Preferred Date</Label>
            <Input
              id="booking-date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              data-ocid="booking.date_input"
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-destructive text-xs mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <Label htmlFor="booking-address">Full Address</Label>
            <Input
              id="booking-address"
              placeholder="House no, Street, Area, Tiruvallur District"
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              data-ocid="booking.address_input"
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-destructive text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              data-ocid="booking.close_button"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground"
              data-ocid="booking.submit_button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    data-ocid="booking.loading_state"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<
    ServiceType | undefined
  >();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroServiceSearch, setHeroServiceSearch] = useState("");
  const [heroServiceSelect, setHeroServiceSelect] = useState<ServiceType | "">(
    "",
  );

  const openBooking = (service?: ServiceType) => {
    setDefaultService(service);
    setBookingOpen(true);
  };

  const handleHeroBook = () => {
    openBooking(heroServiceSelect || undefined);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#hero"
              className="flex items-center gap-2 font-display font-bold text-xl text-foreground"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Wrench className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>
                Quick<span className="text-primary">Fix</span> Services
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {["Services", "How It Works", "About", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                  data-ocid="nav.link"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                asChild
                data-ocid="nav.call_button"
              >
                <a href="tel:+919876543210">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={() => openBooking()}
                data-ocid="nav.book_button"
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border mt-0 pt-4 space-y-3">
              {["Services", "How It Works", "About", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href="tel:+919876543210">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-primary text-primary-foreground"
                  onClick={() => {
                    openBooking();
                    setMobileMenuOpen(false);
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
          {/* Decorative circles */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "oklch(70 0.25 185)",
              filter: "blur(80px)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
            style={{
              background: "oklch(70 0.25 255)",
              filter: "blur(60px)",
              transform: "translate(-30%, 30%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fade-up">
                {/* Location Badge */}
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2">
                  <MapPin className="h-4 w-4 text-green-300" />
                  <span className="text-white/90 text-sm font-medium">
                    Serving Tiruvallur District, Tamil Nadu
                  </span>
                </div>

                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                    Fast &amp; Reliable
                    <br />
                    <span className="text-green-300">Home Repairs</span>
                    <br />
                    in Tiruvallur
                  </h1>
                  <p className="mt-4 text-lg text-white/75 max-w-lg">
                    Trusted technicians at your doorstep — plumbing, electrical,
                    carpentry, AC repair & cleaning. Book in minutes.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-3 shadow-hero flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 flex-1 px-2">
                    <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                    <Input
                      className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-foreground placeholder:text-muted-foreground"
                      placeholder="Search service (plumber, AC...)"
                      value={heroServiceSearch}
                      onChange={(e) => setHeroServiceSearch(e.target.value)}
                      data-ocid="hero.search_input"
                    />
                  </div>
                  <div className="sm:w-44">
                    <Select
                      value={heroServiceSelect}
                      onValueChange={(v) =>
                        setHeroServiceSelect(v as ServiceType)
                      }
                    >
                      <SelectTrigger
                        className="border border-border"
                        data-ocid="hero.service_select"
                      >
                        <SelectValue placeholder="Service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="bg-accent text-accent-foreground font-semibold px-6 hover:opacity-90"
                    onClick={handleHeroBook}
                    data-ocid="hero.book_button"
                    style={{ background: "oklch(52 0.18 145)", color: "white" }}
                  >
                    Book a Service Near You
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-white font-semibold gap-2"
                    style={{ color: "oklch(30 0.22 255)" }}
                    onClick={() => openBooking()}
                    data-ocid="hero.book_button"
                  >
                    <CalendarCheck className="h-5 w-5" />
                    Book Appointment
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 gap-2"
                    asChild
                    data-ocid="hero.call_button"
                  >
                    <a href="tel:+919876543210">
                      <Phone className="h-5 w-5" />
                      Call Now: +91 98765 43210
                    </a>
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-5 pt-2">
                  {[
                    { label: "500+ Happy Customers" },
                    { label: "Same Day Service" },
                    { label: "Verified Technicians" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-300" />
                      <span className="text-white/80 text-sm">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: "oklch(60 0.15 220 / 0.2)",
                      filter: "blur(40px)",
                      transform: "scale(1.1)",
                    }}
                  />
                  <img
                    src="/assets/generated/hero-illustration.dim_800x600.png"
                    alt="QuickFix Services technician illustration"
                    className="relative rounded-3xl max-w-full h-auto"
                    style={{ maxHeight: "460px", objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-white border-y border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                {
                  icon: Users,
                  value: "500+",
                  label: "Happy Customers",
                  color: "text-primary",
                },
                {
                  icon: Briefcase,
                  value: "15+",
                  label: "Expert Technicians",
                  color: "text-accent",
                },
                {
                  icon: Wrench,
                  value: "5",
                  label: "Services Available",
                  color: "text-primary",
                },
                {
                  icon: Clock,
                  value: "Same Day",
                  label: "Service Guarantee",
                  color: "text-accent",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{
                      background:
                        stat.color === "text-primary"
                          ? "oklch(95 0.06 255)"
                          : "oklch(94 0.08 145)",
                    }}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p
                    className={`text-2xl font-display font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                style={{
                  background: "oklch(94 0.08 255)",
                  color: "oklch(40 0.22 255)",
                }}
              >
                What We Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                Our Services
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Professional home repair and maintenance services across
                Tiruvallur District.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {SERVICES.map((service, idx) => (
                <div
                  key={service.id}
                  data-ocid={`services.item.${idx + 1}`}
                  className="service-card bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-hero hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-4"
                >
                  <div
                    className={`service-icon flex items-center justify-center w-16 h-16 rounded-2xl ${service.bg}`}
                  >
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-auto bg-primary text-primary-foreground"
                    onClick={() => openBooking(service.id)}
                    data-ocid={`services.book_button.${idx + 1}`}
                  >
                    Book Now
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                style={{
                  background: "oklch(94 0.08 145)",
                  color: "oklch(35 0.18 145)",
                }}
              >
                Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                How It Works
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Getting help at home is just 3 easy steps away.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div
                className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5"
                style={{ background: "oklch(90 0.05 255)" }}
              />

              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Choose a Service",
                  desc: "Browse our 5 expert services — plumbing, electrical, carpentry, AC, or cleaning. Pick what you need.",
                  color: "text-primary",
                  bg: "bg-blue-50",
                },
                {
                  step: "02",
                  icon: CalendarCheck,
                  title: "Book Online or Call",
                  desc: "Fill our quick booking form or simply call us. Choose your preferred date and we'll confirm instantly.",
                  color: "text-accent",
                  bg: "bg-green-50",
                },
                {
                  step: "03",
                  icon: CheckCircle2,
                  title: "Expert at Your Door",
                  desc: "Our verified, professional technician arrives on time and gets the job done right — same day available!",
                  color: "text-primary",
                  bg: "bg-blue-50",
                },
              ].map((step) => (
                <div
                  key={step.step}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div
                      className={`flex items-center justify-center w-16 h-16 rounded-2xl ${step.bg} ${step.color} z-10 relative`}
                    >
                      <step.icon className="h-7 w-7" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background:
                          step.color === "text-primary"
                            ? "oklch(47.5 0.22 255)"
                            : "oklch(52 0.18 145)",
                      }}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground font-semibold"
                onClick={() => openBooking()}
              >
                Get Started Today
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="about" className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                style={{
                  background: "oklch(94 0.08 255)",
                  color: "oklch(40 0.22 255)",
                }}
              >
                Customer Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                What Our Customers Say
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Trusted by hundreds of families across Tiruvallur District.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={t.name}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border"
                  data-ocid={`services.item.${idx + 1}`}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].slice(0, t.rating).map((n) => (
                      <Star
                        key={n}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                      style={{ background: "oklch(47.5 0.22 255)" }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.service} · {t.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA SECTION */}
        <section
          id="contact"
          className="py-20"
          style={{
            background:
              "linear-gradient(135deg, oklch(30 0.22 255) 0%, oklch(40 0.18 185) 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Ready to Fix It?
            </h2>
            <p className="text-white/75 text-lg mb-3">
              Get a skilled technician at your door — today!
            </p>
            <div className="flex items-center justify-center gap-2 mb-10">
              <MapPin className="h-5 w-5 text-green-300" />
              <span className="text-white/90 font-medium">
                Serving Tiruvallur District, Tamil Nadu
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white font-bold text-lg px-8"
                style={{ color: "oklch(30 0.22 255)" }}
                onClick={() => openBooking()}
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 text-lg px-8"
                asChild
              >
                <a href="tel:+919876543210">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: +91 98765 43210
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="bg-foreground text-white py-12"
        style={{ background: "oklch(15 0.05 255)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid md:grid-cols-4 gap-8 pb-10 border-b"
            style={{ borderColor: "oklch(30 0.05 255)" }}
          >
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-display font-bold text-xl text-white mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                  <Wrench className="h-5 w-5 text-primary-foreground" />
                </div>
                QuickFix Services
              </div>
              <p className="text-sm" style={{ color: "oklch(70 0.04 255)" }}>
                Your trusted home repair partner in Tiruvallur District. Fast,
                professional, and affordable.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <MapPin className="h-4 w-4 text-green-400" />
                <span
                  className="text-sm"
                  style={{ color: "oklch(70 0.04 255)" }}
                >
                  Tiruvallur District, Tamil Nadu, India
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Phone className="h-4 w-4 text-green-400" />
                <a
                  href="tel:+919876543210"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "oklch(70 0.04 255)" }}
                >
                  +91 98765 43210
                </a>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">
                Our Services
              </h4>
              <ul className="space-y-2">
                {SERVICES.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => openBooking(s.id)}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "oklch(70 0.04 255)" }}
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["Services", "How It Works", "About", "Contact"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "oklch(70 0.04 255)" }}
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: "oklch(55 0.04 255)" }}>
              © {new Date().getFullYear()} QuickFix Services. All rights
              reserved.
            </p>
            <p className="text-sm" style={{ color: "oklch(55 0.04 255)" }}>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        defaultService={defaultService}
      />
    </QueryClientProvider>
  );
}

export default App;

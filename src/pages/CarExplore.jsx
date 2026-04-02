import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Star,
  Car,
  X,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../main/Loader";
import API_BASE_URL from "../config/apiConfig";
import "react-day-picker/dist/style.css";

const normalizeValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const toNumber = (value) => {
  if (value?.$numberDecimal) return parseFloat(value.$numberDecimal);
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const isRentListing = (car) => {
  const possibleValues = [
    car.RentList,
    car.rentList,
    car.listingType,
    car.listing_type,
    car.type,
    car.category,
    car.purpose,
    car.mode,
  ]
    .map(normalizeValue)
    .filter(Boolean);

  const joined = possibleValues.join(" ");

  return (
    possibleValues.some(
      (value) =>
        value === "rent" ||
        value === "rental" ||
        value === "for rent" ||
        value === "rent car",
    ) ||
    joined.includes("rent") ||
    car.forRent === true
  );
};

const isBuyListing = (car) => {
  const possibleValues = [
    car.RentList,
    car.rentList,
    car.listingType,
    car.listing_type,
    car.type,
    car.category,
    car.purpose,
    car.mode,
  ]
    .map(normalizeValue)
    .filter(Boolean);

  const joined = possibleValues.join(" ");

  return (
    possibleValues.some(
      (value) =>
        value === "list" ||
        value === "buy" ||
        value === "sale" ||
        value === "sell" ||
        value === "for sale",
    ) ||
    joined.includes("sale") ||
    joined.includes("buy") ||
    joined.includes("list")
  );
};

const isActiveListing = (car) => {
  const status = normalizeValue(car.listing_status || car.status);

  if (!status) return true;

  return ["active", "approved", "available", "listed", "published"].includes(
    status,
  );
};

const formatDateLabel = (date) =>
  date ? format(date, "MMM dd, yyyy") : "Date";

const calendarStyles = `
  .rental-calendar {
    width: 100%;
    overflow: hidden;
  }

  .rental-calendar .rdp-root,
  .rental-calendar .rdp,
  .rental-calendar .rdp-months,
  .rental-calendar .rdp-month {
    width: 100%;
    max-width: 100%;
  }

  .rental-calendar .rdp-months {
    display: flex;
    justify-content: center;
  }

  .rental-calendar .rdp-month {
    min-width: 0;
  }

  .rental-calendar .rdp-month_grid,
  .rental-calendar .rdp-table {
    width: 100%;
    max-width: 100%;
  }

  .rental-calendar .rdp-weekdays,
  .rental-calendar .rdp-week,
  .rental-calendar .rdp-head_row,
  .rental-calendar .rdp-row {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    width: 100%;
  }

  .rental-calendar .rdp-weekday,
  .rental-calendar .rdp-cell,
  .rental-calendar .rdp-day {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rental-calendar .rdp-weekday {
    font-size: 14px;
    font-weight: 600;
    color: #525252;
    padding-bottom: 10px;
  }

  .rental-calendar .rdp-day_button,
  .rental-calendar .rdp-day {
    width: 42px;
    height: 42px;
    margin: 0 auto;
    border-radius: 9999px;
  }

  .rental-calendar .rdp-caption,
  .rental-calendar .rdp-month_caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 14px;
  }

  .rental-calendar .rdp-caption_label,
  .rental-calendar .rdp-month_caption span {
    font-size: 18px;
    font-weight: 700;
  }

  .rental-calendar .rdp-nav {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rental-calendar .rdp-button_previous,
  .rental-calendar .rdp-button_next,
  .rental-calendar .rdp-nav_button {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
  }

  .rental-calendar .rdp-day_selected,
  .rental-calendar .rdp-day_range_start,
  .rental-calendar .rdp-day_range_end {
    background: #000 !important;
    color: #fff !important;
  }

  .rental-calendar .rdp-day_range_middle {
    background: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 1024px) {
    .rental-calendar .rdp-day_button,
    .rental-calendar .rdp-day {
      width: 38px;
      height: 38px;
    }
  }

  @media (max-width: 640px) {
    .rental-calendar .rdp-day_button,
    .rental-calendar .rdp-day {
      width: 34px;
      height: 34px;
      font-size: 14px;
    }

    .rental-calendar .rdp-weekday {
      font-size: 13px;
    }

    .rental-calendar .rdp-caption_label,
    .rental-calendar .rdp-month_caption span {
      font-size: 16px;
    }
  }
`;

export default function CarExplore() {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialMarketplaceMode = () => {
    const params = new URLSearchParams(location.search);
    const modeFromQuery = params.get("mode");
    const modeFromState = location.state?.mode;

    if (modeFromState === "rent" || modeFromQuery === "rent") {
      return "rent";
    }

    return "buy";
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [carType, setCarType] = useState("");
  const [make, setMake] = useState("");
  const [year, setYear] = useState("");
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [marketplaceMode, setMarketplaceMode] = useState(
    getInitialMarketplaceMode(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [minRating, setMinRating] = useState(0);
  const [driverSelections, setDriverSelections] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState();

  const rentalDays =
    selectedDateRange?.from && selectedDateRange?.to
      ? Math.floor(
          (selectedDateRange.to - selectedDateRange.from) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0;

  const handleDriverSelectionChange = (carId, value) => {
    setDriverSelections((prev) => ({
      ...prev,
      [carId]: value,
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeFromQuery = params.get("mode");
    const modeFromState = location.state?.mode;

    if (modeFromState === "rent" || modeFromQuery === "rent") {
      setMarketplaceMode("rent");
    } else if (modeFromState === "buy" || modeFromQuery === "buy") {
      setMarketplaceMode("buy");
    }
  }, [location]);

  useEffect(() => {
    const hiddenElements = [];
    const selectors = ["nav", ".navbar", "#navbar"];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        hiddenElements.push({
          element,
          previousDisplay: element.style.display,
        });
        element.style.display = "none";
      });
    });

    return () => {
      hiddenElements.forEach(({ element, previousDisplay }) => {
        element.style.display = previousDisplay;
      });
    };
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/listings/listings`);

        if (!response.ok) {
          throw new Error("Failed to fetch car listings");
        }

        const data = await response.json();

        const filteredCars = data.filter((car) => {
          if (!isActiveListing(car)) return false;

          return marketplaceMode === "rent"
            ? isRentListing(car)
            : isBuyListing(car);
        });

        const transformedCars = filteredCars.map((car, index) => ({
          id: car.listing_id || car._id || index,
          listing_id: car.listing_id || car._id || index,
          make: car.make || "Unknown",
          model: car.model || "Model",
          year: car.year || new Date().getFullYear(),
          price: toNumber(car.price),
          mileage: Number(car.mileage) || 0,
          carType: car.carType || car.bodyType || "Unknown",
          image: car.images?.[0]?.url || car.image || "",
          rentList: car.RentList || car.rentList || "",
          transmission: car.transmission || "Unknown",
          rating: car.rating ? Number(car.rating) : Math.random() * 2 + 3,
          reviews: car.reviewsCount
            ? Number(car.reviewsCount)
            : Math.floor(Math.random() * 100) + 1,
        }));

        setCars(transformedCars);

        if (marketplaceMode === "rent") {
          setDriverSelections((prev) => {
            const initialDriverSelections = {};
            transformedCars.forEach((car) => {
              initialDriverSelections[car.id] =
                prev[car.id] || "Without Driver";
            });
            return initialDriverSelections;
          });
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [marketplaceMode]);

  const getFilteredAndSortedCars = () => {
    let filtered = cars.filter((car) => {
      const isPriceInRange =
        car.price >= priceRange[0] && car.price <= priceRange[1];

      const isCarTypeMatch = carType
        ? normalizeValue(car.carType) === normalizeValue(carType)
        : true;

      const isMakeMatch = make
        ? normalizeValue(car.make) === normalizeValue(make)
        : true;

      const isYearMatch = year ? car.year.toString() === year : true;

      const isTransmissionMatch =
        selectedTransmission === "All" ||
        normalizeValue(car.transmission) ===
          normalizeValue(selectedTransmission);

      const isRatingMatch = car.rating >= minRating;

      const matchesSearch = searchQuery
        ? `${car.make} ${car.model} ${car.year} ${car.carType}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      return (
        isPriceInRange &&
        isCarTypeMatch &&
        isMakeMatch &&
        isYearMatch &&
        isTransmissionMatch &&
        matchesSearch &&
        (marketplaceMode === "buy" || isRatingMatch)
      );
    });

    if (sortOrder !== "none") {
      filtered.sort((a, b) => {
        if (sortOrder === "lowToHigh") return a.price - b.price;
        return b.price - a.price;
      });
    }

    return filtered;
  };

  const filteredCars = getFilteredAndSortedCars();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <Loader />
        <p className="ml-2 text-lg text-gray-600 dark:text-gray-300">
          Loading cars...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-red-500 dark:bg-gray-900">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white transition-colors duration-200 dark:bg-gray-900 dark:text-white">
      <style>{calendarStyles}</style>

      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <header className="bg-white pt-2 shadow-md dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {marketplaceMode === "rent"
                  ? "Rent Your Perfect Car"
                  : "Find Your Perfect Car"}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {marketplaceMode === "rent"
                  ? "Quality assured vehicles for your rental needs"
                  : "Quality assured vehicles at competitive prices"}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="inline-flex rounded-full bg-gray-200 p-1 shadow-sm dark:bg-gray-700">
                <button
                  className={`rounded-full px-6 py-2 text-lg font-medium transition-all duration-300 ease-in-out ${
                    marketplaceMode === "buy"
                      ? "bg-white text-black shadow-lg dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setMarketplaceMode("buy")}
                >
                  Buy
                </button>

                <button
                  className={`rounded-full px-6 py-2 text-lg font-medium transition-all duration-300 ease-in-out ${
                    marketplaceMode === "rent"
                      ? "bg-white text-black shadow-lg dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setMarketplaceMode("rent")}
                >
                  Rent
                </button>
              </div>
            </div>

            <div className="flex flex-1 justify-end">
              <div className="relative w-full max-w-md">
                <input
                  className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Search by Make, Model, or Year"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
        {marketplaceMode === "rent"
          ? "Quality assured vehicles for your rental needs"
          : "Quality assured vehicles at competitive prices"}
      </p>

      <main className="container mx-auto flex-grow bg-inherit px-4 py-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <aside
            className={`w-full lg:w-[360px] lg:min-w-[360px] ${
              isFilterOpen ? "block" : "hidden lg:block"
            } self-start transition-colors duration-200 lg:sticky lg:top-6`}
            style={{ zIndex: 10 }}
          >
            <div className="space-y-6">
              <div className="h-auto rounded-2xl bg-white p-6 shadow-md transition-colors duration-200 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold dark:text-white">
                  Filters
                </h2>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="sort-order"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Sort by Price
                    </label>
                    <select
                      id="sort-order"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="none">Default</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="price-range"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {marketplaceMode === "rent"
                        ? "Price Range Per Day"
                        : "Price Range"}
                      <span className="float-right">
                        ₹{priceRange[1].toLocaleString()}
                      </span>
                    </label>
                    <input
                      type="range"
                      id="price-range"
                      min="0"
                      max="10000000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value, 10)])
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200"
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>₹0</span>
                      <span>₹10,000,000+</span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="make"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Make
                    </label>
                    <select
                      id="make"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                    >
                      <option value="">Select make</option>
                      {[...new Set(cars.map((car) => car.make))].map(
                        (makeName) => (
                          <option key={makeName} value={makeName}>
                            {makeName}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="car-type"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Car Type
                    </label>
                    <select
                      id="car-type"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                    >
                      <option value="">Select type</option>
                      {[...new Set(cars.map((car) => car.carType))].map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="transmission"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Transmission
                    </label>
                    <select
                      id="transmission"
                      value={selectedTransmission}
                      onChange={(e) => setSelectedTransmission(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option>All</option>
                      <option>Automatic</option>
                      <option>Manual</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="year"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Year
                    </label>
                    <select
                      id="year"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="">Select year</option>
                      {[...new Set(cars.map((car) => car.year))]
                        .sort()
                        .map((yearValue) => (
                          <option key={yearValue} value={yearValue.toString()}>
                            {yearValue}
                          </option>
                        ))}
                    </select>
                  </div>

                  {marketplaceMode === "rent" && (
                    <div>
                      <label
                        htmlFor="rating-filter"
                        className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        <Star className="mr-2 h-4 w-4 text-yellow-400" />
                        Minimum Rating
                      </label>
                      <select
                        id="rating-filter"
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                      >
                        <option value={0}>All Ratings</option>
                        <option value={1}>1+ Stars</option>
                        <option value={2}>2+ Stars</option>
                        <option value={3}>3+ Stars</option>
                        <option value={4}>4+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {marketplaceMode === "rent" && (
                <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-colors duration-200 dark:bg-gray-800">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold dark:text-white">
                      Rental Dates
                    </h2>
                    <div className="whitespace-nowrap rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-black">
                      {rentalDays > 0
                        ? `${rentalDays} day${rentalDays > 1 ? "s" : ""}`
                        : "No dates"}
                    </div>
                  </div>

                  <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-700">
                      <p className="text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                        Pick-up
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <CalendarDays className="h-4 w-4" />
                        {formatDateLabel(selectedDateRange?.from)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-700">
                      <p className="text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                        Return
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <CalendarDays className="h-5 w-5" />
                        {formatDateLabel(selectedDateRange?.to)}
                      </p>
                    </div>
                  </div>

                  <div className="rental-calendar rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
                    <DayPicker
                      mode="range"
                      selected={selectedDateRange}
                      onSelect={setSelectedDateRange}
                      disabled={{ before: new Date() }}
                      numberOfMonths={1}
                      className="w-full"
                    />
                  </div>

                  {selectedDateRange?.from && (
                    <button
                      type="button"
                      onClick={() => setSelectedDateRange(undefined)}
                      className="mt-5 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Clear Dates
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Available Cars
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {filteredCars.length}{" "}
                  {filteredCars.length === 1 ? "car" : "cars"} found
                </p>
              </div>

              <button
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition duration-300 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 md:hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {isFilterOpen ? (
                  <X className="mr-2 inline-block h-4 w-4" />
                ) : (
                  <SlidersHorizontal className="mr-2 inline-block h-4 w-4" />
                )}
                {isFilterOpen ? "Close Filters" : "Filters"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:scale-105 dark:bg-gray-800"
                >
                  <img
                    alt={`${car.make} ${car.model}`}
                    className="h-48 w-full object-cover"
                    src={
                      car.image && car.image.startsWith("http")
                        ? car.image
                        : car.image
                          ? `${API_BASE_URL}${car.image}`
                          : "https://via.placeholder.com/600x400?text=No+Image"
                    }
                    style={{ objectFit: "cover", minWidth: "100%" }}
                  />

                  <div className="flex flex-grow flex-col p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {`${car.make} ${car.model}`}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {car.year} • {car.mileage.toLocaleString()} miles •{" "}
                      {car.carType}
                    </p>

                    {marketplaceMode === "rent" && (
                      <>
                        <p className="mt-2 flex items-center text-sm dark:text-gray-300">
                          <Star className="mr-1 h-4 w-4 text-yellow-400" />
                          {Number(car.rating).toFixed(1)} ({car.reviews}{" "}
                          reviews)
                        </p>

                        <div className="mt-3">
                          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Choose Rental Type
                          </label>
                          <select
                            value={driverSelections[car.id] || "Without Driver"}
                            onChange={(e) =>
                              handleDriverSelectionChange(
                                car.id,
                                e.target.value,
                              )
                            }
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="With Driver">With Driver</option>
                            <option value="Without Driver">
                              Without Driver
                            </option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="mt-auto">
                      <p className="mt-4 text-xl font-bold text-black dark:text-white">
                        ₹{car.price.toLocaleString()}
                        {marketplaceMode === "rent" && (
                          <span className="text-sm font-normal">/Day</span>
                        )}
                      </p>

                      <Link
                        to={`/${marketplaceMode}-car/${car.listing_id}`}
                        state={
                          marketplaceMode === "rent"
                            ? {
                                driverOption:
                                  driverSelections[car.id] || "Without Driver",
                                pickupDate: selectedDateRange?.from
                                  ? format(selectedDateRange.from, "yyyy-MM-dd")
                                  : "",
                                returnDate: selectedDateRange?.to
                                  ? format(selectedDateRange.to, "yyyy-MM-dd")
                                  : "",
                              }
                            : {}
                        }
                      >
                        <button className="mt-4 w-full rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-500">
                          {marketplaceMode === "rent" ? (
                            "Rent Now"
                          ) : (
                            <>
                              <Car className="mr-2 inline-block h-4 w-4" />
                              View Details
                            </>
                          )}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No cars found matching your criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

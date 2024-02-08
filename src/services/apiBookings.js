import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" }
    );

  if (filter) query = query.eq(filter.field, filter.value);

  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
//data should be in  ISO string
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function createEditBooking({
  guest,
  cabin,
  breakfast,
  paid,
  numNights,
  startDate,
  observations,
  numGuests,
  breakfastPrice,
}) {
  const { id: guestId } = guest;
  const {
    id: cabinId,
    regularPrice: cabinPrice,
    discount,
    availability,
  } = cabin;
  const { value: hasBreakfast } = breakfast;
  const { value: isPaid } = paid;
  const status = "unconfirmed";
  const extrasPrice = hasBreakfast === 1 ? breakfastPrice * numNights : 0;
  const totalPrice = (cabinPrice - discount) * numNights + extrasPrice;
  const startdate = new Date(startDate);
  const endDate = new Date(startdate);
  endDate.setDate(endDate.getDate() + parseInt(numNights));

  // 1. Create/edit cabin
  let query = supabase.from("bookings");

  // A) CREATE
  query = query.insert([
    {
      guestId,
      cabinId,
      hasBreakfast,
      isPaid,
      cabinPrice,
      numNights,
      numGuests,
      startDate,
      endDate,
      extrasPrice,
      totalPrice,
      observations,
      status,
    },
  ]);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

export const updateCabinAvailability = async (cabinId) => {
  const { error } = await supabase
    .from("cabins")
    .update({ availability: false })
    .eq("id", cabinId);
  if (error) {
    throw new Error(error.message);
  }
};

// Function to check if a cabin is available for booking
export const isCabinAvailable = (cabin, bookings, startDate) => {
  if (!bookings) {
    // Handle the case where bookings data is not available yet
    return true;
  }

  const isAssignedToActiveBooking = bookings.some((booking) => {
    return (
      booking.cabinId === cabin.id &&
      booking.status !== "checked-out" &&
      new Date(booking.endDate) > new Date(startDate)
    );
  });
  console.log("avai:", isAssignedToActiveBooking);

  return !isAssignedToActiveBooking;
};

// Function to filter available cabins based on bookings
export const filterAvailableCabins = async (cabins, startDate) => {
  try {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*");

    console.log("hahha:", bookings);
    if (error) {
      throw new Error(error.message);
    }

    return cabins.filter((cabin) =>
      isCabinAvailable(cabin, bookings, startDate)
    );
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    return [];
  }
};

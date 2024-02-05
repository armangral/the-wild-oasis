import Heading from "../ui/Heading";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import Row from "../ui/Row";
import AddBooking from "../features/bookings/AddBooking";

function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>
      <BookingTable />
      <AddBooking />
    </>
  );
}

export default Bookings;

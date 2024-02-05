import Heading from "../ui/Heading";

import AddGuestForm from "../features/guests/AddGuestForm";

function NewGuests() {
  return (
    <>
      <Heading as="h1">Add a new Guest</Heading>
      <AddGuestForm />
    </>
  );
}
export default NewGuests;

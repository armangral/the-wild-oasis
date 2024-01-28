import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Spinner from "../../ui/Spinner";
import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";

import ButtonText from "../../ui/ButtonText";
import { useBooking } from "./useBooking";

import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();

  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  // if (!booking) return <Empty resource='booking' />;

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  // We return a fragment so that these elements fit into the page's layout
  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading type="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      {/* <ButtonGroup>
        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}

        {status === "checked-in" && <Button>Check out</Button>}

        <Modal>
          <Modal.Toggle opens="delete">
            <Button variation="danger">Delete booking</Button>
          </Modal.Toggle>
          <Modal.Window name="delete">
            <ConfirmDelete />
          </Modal.Window>
        </Modal>

        <Button variation="secondary">Back</Button>
      </ButtonGroup> */}
    </>
  );
}

export default BookingDetail;

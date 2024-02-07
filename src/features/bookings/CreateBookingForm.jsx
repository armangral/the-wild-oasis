import { useForm } from "react-hook-form";
import { useState } from "react";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useCreateBooking } from "./useCreateBooking";
import { useSettings } from "../settings/useSettings";
import { useGuests } from "../guests/useGuests";
import { useCabins } from "../cabins/useCabins";

import GuestSelector from "../guests/GuestSelector";
import CabinSelector from "../cabins/CabinSelector";
import CountrySelector from "../../ui/CountrySelector";
import { isTodayOrFutureDate } from "../../utils/helpers";

function CreateBookingForm({ onCloseModal }) {
  const { isCreating, createBooking } = useCreateBooking();
  const { isLoading: isLoadingGuests, guests } = useGuests();
  const { isLoading: isLoadingCabins, cabins } = useCabins();

  const isWorking = isCreating || isLoadingGuests || isLoadingCabins;

  const [guest, setGuest] = useState(guests ? guests[0] : "");
  const [cabin, setCabin] = useState(cabins ? cabins[0] : "");
  const [breakfast, setbreakfast] = useState({
    value: "1",
    label: "yes",
  });
  const [paid, setPaid] = useState({ value: "1", label: "yes" });

  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();

  const changeGuest = (selectedguest) => {
    setGuest(selectedguest);
    console.log(breakfast);
  };

  const changeBreakfast = (hasBreak) => {
    setbreakfast(hasBreak);
    console.log(hasBreak);
  };

  const changeisPaid = (Paid) => {
    setPaid(Paid);
    console.log(guest);
    console.log(cabin);
  };

  const changeCabin = (selectedCabin) => {
    setCabin(selectedCabin);
  };

  function onSubmit({
    numNights,
    startDate,
    breakfastPrice,
    observations,
    numGuests,
  }) {
    createBooking(
      {
        guest,
        cabin,
        breakfast,
        paid,
        numNights,
        startDate,
        breakfastPrice,
        observations,
        numGuests,
      },
      {
        onSuccess: (data) => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Guest">
        <GuestSelector
          options={guests}
          value={guest}
          onChange={changeGuest}
          disabled={isWorking}
        />
      </FormRow>
      <FormRow label="Cabin">
        <CabinSelector
          options={cabins}
          value={cabin}
          onChange={changeCabin}
          disabled={isWorking}
        />
      </FormRow>
      <FormRow label="Cabin Price" error={errors?.cabinPrice?.message}>
        <Input
          type="text"
          id="cabinPrice"
          value={cabin?.regularPrice || ""}
          {...register("cabinPrice")}
          disabled
        />
      </FormRow>

      <FormRow label="Discount " error={errors?.discount?.message}>
        <Input
          type="text"
          id="discount"
          value={cabin?.discount || "0"}
          {...register("discount")}
          disabled
        />
      </FormRow>
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
            validate: (value) => {
              return (
                isTodayOrFutureDate(value) || "Start date must be a future date"
              );
            },
          })}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow label="Number of Nights" error={errors?.numNights?.message}>
        <Input
          type="number"
          id="numNights"
          {...register("numNights", {
            required: "This field is required",
          })}
          // defaultValue={maxGuestsPerBooking}
          disabled={isWorking}
        />
      </FormRow>
      <FormRow label="Breakfast">
        <CountrySelector
          id="hasBreakfast"
          options={[
            { value: "1", label: "yes" },
            { value: "0", label: "no" },
          ]}
          value={breakfast}
          onChange={changeBreakfast}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow label="Paid">
        <CountrySelector
          id="isPaid"
          options={[
            { value: "1", label: "yes" },
            { value: "0", label: "no" },
          ]}
          value={paid}
          onChange={changeisPaid}
          disabled={isWorking}
        />
      </FormRow>
      <FormRow label="Extras Price" error={errors?.extrasPrice?.message}>
        <Input
          type="number"
          id="extrasPrice"
          value={
            getValues().numNights
              ? breakfast?.value == 1
                ? breakfastPrice * getValues().numNights
                : "0"
              : ""
          }
          {...register("extrasPrice")}
          disabled
        />
      </FormRow>

      <FormRow label="Total Price" error={errors?.totalPrice?.message}>
        <Input
          type="number"
          id="totalPrice"
          value={
            (cabin?.regularPrice - cabin?.discount) * getValues().numNights +
            (breakfast?.value == 1 ? breakfastPrice * getValues().numNights : 0)
          }
          {...register("totalPrice")}
          disabled
        />
      </FormRow>
      <FormRow label="No of Guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          {...register("numGuests", {
            required: "This field is required",
            max: {
              value: maxGuestsPerBooking,
              message: `Capacity should be less than ${
                maxGuestsPerBooking + 1
              }`,
            },
          })}
          disabled={isWorking}
        />
      </FormRow>
      <FormRow label="Observations" error={errors?.description?.message}>
        <Textarea
          type="number"
          id="observations"
          defaultValue=""
          disabled={isWorking}
          {...register("observations", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>Create new Booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;

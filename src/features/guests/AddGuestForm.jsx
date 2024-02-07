import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useAddGuest } from "./useAddGuest";
import { useMemo } from "react";
import countryList from "react-select-country-list";
import CountrySelector from "../../ui/CountrySelector";
// import Select from "react-select";

// Email regex: /\S+@\S+\.\S+/

function AddGuestForm() {
  const options = useMemo(() => countryList().getData(), []);
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const [country, setCountry] = useState("");

  const { errors } = formState;
  const { addguest, isLoading } = useAddGuest();

  const changeCountry = (country) => {
    setCountry(country);
    console.log(country);
    console.log(options[0]);
  };

  function onSubmit({ fullName, email, nationalID }) {
    console.log("Country:", country);
    addguest(
      { fullName, email, nationalID, country },
      {
        onSettled: () => reset(),
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Nationality">
        <CountrySelector
          options={options}
          value={country}
          onChange={changeCountry}
        />
      </FormRow>

      <FormRow label="nationalID" error={errors?.NationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isLoading}
          {...register("nationalID", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address!",
            },
          })}
        />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isLoading}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isLoading}>Create new Guest</Button>
      </FormRow>
    </Form>
  );
}

export default AddGuestForm;

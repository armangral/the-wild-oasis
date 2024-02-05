import supabase from "./supabase";

export async function addguest({ fullName, email, country, nationalID }) {
  const countrycode = country.value.toLowerCase();
  const countryFlag = `https://flagcdn.com/${countrycode}.svg`;
  const nationality = country.label;

  const { data, error } = await supabase
    .from("guests")
    .insert([{ fullName, email, countryFlag, nationality, nationalID }])
    .select();

  if (error) throw new Error(error.message);
  return data;
}

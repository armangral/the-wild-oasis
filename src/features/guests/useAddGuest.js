import { useMutation } from "@tanstack/react-query";
import { addguest as addguestApi } from "../../services/apiGuest";
import { toast } from "react-hot-toast";

export function useAddGuest() {
  const { mutate: addguest, isLoading } = useMutation({
    mutationFn: addguestApi,
    onSuccess: () => {
      toast.success("Guest successfully created!");
    },
  });

  return { addguest, isLoading };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogout() {
  const queryclient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryclient.removeQueries();
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      toast.error("Provided email or password are incorrect!");
    },
  });

  return { logout, isLoading };
}

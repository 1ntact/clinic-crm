import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { refreshThunk } from "@/features/auth/refreshThunk";
import { useEffect} from "react";
import type { PropsWithChildren} from "react";
import { FullScreenLoader } from "../loader/FullScreenLoader";

export const AuthLoader = ({ children }:PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(state=>state.auth.isInitialized)

    useEffect(() => {
  if (!isInitialized) {
    dispatch(refreshThunk());
  }
}, [dispatch, isInitialized]);

    return isInitialized? children: <FullScreenLoader/>
};

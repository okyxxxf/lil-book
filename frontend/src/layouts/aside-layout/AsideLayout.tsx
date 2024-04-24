import { Outlet } from "react-router-dom";
import { Aside } from "../../components";
import { Flex } from "@chakra-ui/react";

export function AsideLayout() {
  return (
    <Flex>
      <Aside/>
      <Outlet/>
    </Flex>
  )
}
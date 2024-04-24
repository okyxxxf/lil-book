import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useAuth } from "../../hooks";

export function Header() {
  const isAuth = useAuth();

  return (
    <Box maxW="1440px" m="auto" bg="white" w="100%">
      <Flex justify="space-between" w="100%" p="20px 50px">
        <Flex gap="20px">
          <Image src={`${process.env.PUBLIC_URL}/images/logo-blue.svg`}/>
          <Text fontFamily="lato" fontSize="32px" fontWeight="bold">lilbook</Text>
        </Flex>
        {isAuth ? (
            <Flex gap="15px" align="center">
              <Avatar bg="red.500"/>
              <Text>Admin</Text>
            </Flex>
          ) : null}
      </Flex>
    </Box>
  )
};
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks"
import { Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { AuthForm } from "../../components";

export function AuthPage() {
  const isAuth = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    if (isAuth) navigator("/admin");
  }, [isAuth, navigator]);

  return (
    <Box bg={`url(${process.env.PUBLIC_URL}/images/auth-bg.png)`} w="100vw" h="calc(100vh - 88px)" bgSize="cover">
      <Flex w="100%" h="100%" align="center" justify="center">
        <AuthForm/>
      </Flex>
    </Box>
  )
}
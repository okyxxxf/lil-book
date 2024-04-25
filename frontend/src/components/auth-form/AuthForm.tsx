import { Box, Button, FormControl, Image, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { AuthService } from "../../services";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
  const [login, setLogin] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const navigator = useNavigate();

  const authHandler = async () => {
    const service = new AuthService();
    const res = await service.post({login: login, password: password});

    if (res.status === 200) {
      localStorage.setItem("isAuth", "true");
      navigator("/admin");
    }

    setErrorMessage("Ошибка при авторизации");
  }

  return (
    <Box bg="white" borderRadius="5px">
      <VStack align="stretch" gap="20px" p="20px">
        <Box>
          <VStack gap="10px" paddingInline="43px">
            <Image src={`${process.env.PUBLIC_URL}/images/logo-black.svg`} alt="lilbook"/>
            <Text fontSize="24px" fontWeight="semibold">Авторизация</Text>
          </VStack>
        </Box>
        <FormControl>
          <Input value={login} onChange={(e) => setLogin(e.target.value)} type="text"/>
        </FormControl>
        <FormControl>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
        </FormControl>
        {errorMessage ? <Text color="red.700">{errorMessage}</Text> : null}
        <Button onClick={authHandler} bg="red.400" _hover={{bg: "red.500"}} transition="0.4s" color="white">
          Войти
        </Button>
      </VStack>
    </Box>
  )
}
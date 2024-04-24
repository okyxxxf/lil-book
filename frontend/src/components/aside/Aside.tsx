import { Box, Flex, Image, Link, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CiExport } from "react-icons/ci";

export function Aside() {
  const navigator = useNavigate();

  const links = [
    {name: "Бронирование", href: "/booking"},
    {name: "Выдачи", href: "/issuings"},
    {name: "Книги", href: "/books"},
    {name: "Читательские билеты", href: "/library-cards"},
    {name: "Читатели", href: "/readers"},
    {name: "Авторы", href: "/authors"},
    {name: "Издательства", href: "/publishers"},
    {name: "Города", href: "/cities"}
  ];

  const handleLeave = () => {
    localStorage.removeItem("isAuth");
    navigator("/");
  }

  return (
    <Box as="aside" minH="calc(100vh - 88px)" w="23%" bg="red.400" position="relative">
      <Flex direction="column" justify="space-between" align="end" p="40px 10px 25px 10px" h="100%">
        <VStack align="stretch">
          {links.map(({name, href}, i) => (
            <Link href={`/admin${href}`} _hover={{}} key={i}>
              <Flex align="center" gap="20px" borderRadius="20px" _hover={{bg: "red.500"}} transition="0.4s" p="10px 50px">
                <Image src={`${process.env.PUBLIC_URL}/images${href}.png`} alt={name}/>
                <Text color="white">{name}</Text>
              </Flex>
            </Link>
          ))}
        </VStack>
        <Flex gap="10px" align="center" p="10px 50px" marginRight="40px" cursor="pointer" onClick={handleLeave}>
          <Box transform="rotate(90deg)">
            <CiExport color="white" size="24px"/>
          </Box>
          <Text color="white" fontWeight="semibold">Выйти из системы</Text>
        </Flex>
      </Flex>
    </Box>
  )
}
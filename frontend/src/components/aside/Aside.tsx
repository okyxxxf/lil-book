import { Box, Flex, Image, Link, Text, VStack } from "@chakra-ui/react";

export function Aside() {
  const links = [
    {name: "Бронирование", href: "/booking"},
    {name: "Выдачи", href: "/issuings"},
    {name: "Книги", href: "/books"},
    {name: "Читательские билеты", href: "/library-cards"},
    {name: "Читатели", href: "/readers"},
    {name: "Авторы", href: "/authors"},
    {name: "Издательства", href: "/publishers"},
    {name: "Города", href: "/cities"}
  ]
  return (
    <Box as="aside" minH="calc(100vh - 88px)" w="23%" bg="red.400" position="relative">
      <VStack align="stretch" position="absolute" right="10px" top="40px">
        {links.map(({name, href}) => (
          <Link href={`/admin${href}`} _hover={{}}>
            <Flex align="center" gap="20px" borderRadius="20px" _hover={{bg: "red.500"}} transition="0.4s" p="10px 50px">
              <Image src={`${process.env.PUBLIC_URL}/images${href}.png`} alt={name}/>
              <Text color="white">{name}</Text>
            </Flex>
          </Link>
        ))}
      </VStack>
    </Box>
  )
}
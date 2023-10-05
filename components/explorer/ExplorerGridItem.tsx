import React from "react";
import {
  GridItem,
  Link,
  Center,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { ExplorerData, ExplorerType } from "@/types";
import { checkDifferentUrlsExist, generateUrl } from "@/utils";
import { ExplorerChainModal } from "./ExplorerChainModal";

interface Params {
  explorerName: string;
  explorerData: ExplorerData;
  explorerType: ExplorerType;
  addressOrTx: string;
}

export const ExplorerGridItem = ({
  explorerName,
  explorerData,
  explorerType,
  addressOrTx,
}: Params) => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const supportedChainIds = Object.keys(explorerData.chainIdToLabel).map((k) =>
    Number(k)
  );
  const hasDifferentUrls = checkDifferentUrlsExist(explorerData);

  // this gets cached by gstatic, and independent of the addressOrTx entered.
  const baseUrlForImage = generateUrl(
    explorerData.urlLayout,
    explorerData.chainIdToLabel[supportedChainIds[0]], // the first supported chain
    "",
    explorerType
  );

  return (
    <GridItem
      border="2px solid"
      borderColor={"gray.500"}
      bg={"white"}
      color={"black"}
      _hover={{
        cursor: "pointer",
        bgColor: "whiteAlpha.300",
        color: "white",
        borderColor: "gray.400",
      }}
      rounded="lg"
    >
      {hasDifferentUrls ? (
        <>
          <Center flexDir={"column"} h="100%" p="1rem" onClick={openModal}>
            <Image
              bg="white"
              w="2rem"
              src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=${baseUrlForImage}`}
              alt={explorerName}
              borderRadius="full"
            />
            <Text mt="0.5rem" textAlign={"center"}>
              {explorerName}
            </Text>
          </Center>
          <ExplorerChainModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            explorerName={explorerName}
            explorerData={explorerData}
            explorerType={explorerType}
            addressOrTx={addressOrTx}
            supportedChainIds={supportedChainIds}
          />
        </>
      ) : (
        <Link
          href={generateUrl(
            explorerData.urlLayout,
            explorerData.chainIdToLabel[supportedChainIds[0]],
            addressOrTx,
            explorerType
          )}
          _hover={{
            textDecor: "none",
          }}
          isExternal
        >
          {/* TODO: highlight with a robot emoji if explorer is for contracts */}
          {/* TODO: allow bookmarking, and show the bookmarked explorers on the top */}
          <Center flexDir={"column"} h="100%" p="1rem">
            <Image
              bg="white"
              w="2rem"
              src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=${baseUrlForImage}`}
              alt={explorerName}
              borderRadius="full"
            />
            <Text mt="0.5rem" textAlign={"center"}>
              {explorerName}
            </Text>
          </Center>
        </Link>
      )}
    </GridItem>
  );
};

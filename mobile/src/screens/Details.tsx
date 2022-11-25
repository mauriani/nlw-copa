import { useState, useEffect } from "react";
import { Share } from "react-native";
import { VStack, useToast, HStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { api } from "../services/api";
import { PoolCardPros } from "../components/PoolCard";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;

  const [otionSelected, setOtionSelected] = useState<
    "Seus palpites" | "Ranking do grupo"
  >("Seus palpites");
  const [isLoading, setIsloading] = useState(false);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>(
    {} as PoolCardPros
  );

  async function fetchPoolDetails() {
    try {
      setIsloading(true);

      const response = await api.get(`/pools/${id}`);

      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsloading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor={"gray.900"}>
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded={"sm"} mb={5}>
            <Option
              title="Seus palpites"
              isSelected={otionSelected === "Seus palpites"}
              onPress={() => setOtionSelected("Seus palpites")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={otionSelected == "Ranking do grupo"}
              onPress={() => setOtionSelected("Ranking do grupo")}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}

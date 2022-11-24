import { useState, useEffect } from "react";
import { useToast, FlatList } from "native-base";

import { api } from "../services/api";
import { Game, GameProps } from "../components/Game";
import { Loading } from "./Loading";

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const toast = useToast();
  const [isLoading, setIsloading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  async function fetchGetGames() {
    try {
      setIsloading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os jogos",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsloading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsloading(true);

      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar para palpitar",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoins: parseInt(firstTeamPoints),
        secondTeamPoins: parseInt(secondTeamPoints),
      });

      toast.show({
        title: "Palpite realizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGetGames();
    } catch (error) {
      console.log(error.response.data);

      toast.show({
        title: "Não foi possível enviar o palpite",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    fetchGetGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
    />
  );
}

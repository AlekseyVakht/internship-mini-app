import { FC, useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Panel,
  PanelHeader,
  Button,
  Group,
  Div,
  Textarea,
  Spinner,
  PanelHeaderBack,
} from "@vkontakte/vkui";
import { fetchData } from "../utils/api";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

interface FactData {
  fact: string;
}

export const Facts: FC<{ id: string }> = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const [inputValue, setInputValue] = useState("");
  const [cursorAt, setCursorAt] = useState(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["cat"],
    queryFn: () => fetchData<FactData>({ url: "https://catfact.ninja/fact" }),
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const handleClick = () => {
    setCursorAt(0);
    setInputValue("");
    refetch();
  };

  useEffect(() => {
    if (data && textAreaRef.current) {
      setInputValue(data.fact);
      setCursorAt(data.fact.indexOf(" ") + 1);
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(cursorAt, cursorAt);
    }
  }, [data, cursorAt]);

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        Факты
      </PanelHeader>
      <Group>
        <Div>
          {isFetching ? (
            <Spinner size="regular" style={{ margin: "20px 0" }} />
          ) : (
            <Textarea
              getRef={textAreaRef}
              value={inputValue || ""}
              placeholder="Чтобы получить факт, нужно нажать на кнпоку!"
            />
          )}
          <Button
            size="l"
            style={{ marginTop: "20px" }}
            mode="secondary"
            onClick={handleClick}
            disabled={isFetching}
          >
            Получить факт
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

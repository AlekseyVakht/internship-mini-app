import { FC } from "react";
import { Panel, PanelHeader, Group, Cell } from "@vkontakte/vkui";

import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

export const Home: FC<{ id: string }> = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      <Group>
        <Cell onClick={() => routeNavigator.push("generator")}>
          Генератор возраста
        </Cell>
        <Cell onClick={() => routeNavigator.push("facts")}>
          Факты
        </Cell>
      </Group>
    </Panel>
  );
};

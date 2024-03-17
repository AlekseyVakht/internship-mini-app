import { useState, useEffect, ReactNode } from "react";
import { View, SplitLayout, SplitCol, ScreenSpinner } from "@vkontakte/vkui";
import { useActiveVkuiLocation } from "@vkontakte/vk-mini-apps-router";

import { Generator, Facts, Home } from "./panels";
import { DEFAULT_VIEW_PANELS } from "./routes";

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } =
    useActiveVkuiLocation();

  const [popout, setPopout] = useState<ReactNode | null>(
    <ScreenSpinner size="large" />
  );

  useEffect(() => {
    setPopout(null);
  }, []);

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" />
          <Generator id="generator" />
          <Facts id="facts" />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};

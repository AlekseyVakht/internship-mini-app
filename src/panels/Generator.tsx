import React, { FC, FormEvent, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchData } from "../utils/api";
import { schema } from "../utils/validation";
import { LoaderProps, FormInput, AgeData } from "../utils/interfaces";

import {
  Panel,
  PanelHeader,
  Button,
  Group,
  Div,
  FormStatus,
  PanelHeaderBack,
  FormItem,
  Input,
  Separator,
  Paragraph,
  Spinner,
} from "@vkontakte/vkui";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

const Loader: FC<LoaderProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick(e);
  };

  return (
    <Div>
      <Spinner size="large" style={{ marginTop: "20px" }} />
      <Button
        size="m"
        style={{ marginTop: "20px" }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e)}
      >
        Отмена
      </Button>
    </Div>
  );
};

export const Generator: FC<{ id: string }> = ({ id }) => {
  const [query, setQuery] = useState("");
  const [cancelled, setIsCancelled] = useState(false);
  const queryClient = useQueryClient();
  const [age, setAge] = useState("0");
  const routeNavigator = useRouteNavigator();
  const onChangeDebounce = useDebouncedCallback((value) => {
    if (isValid) {
      onSubmit({ firstname: value });
    }
  }, 3000);

  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormInput>({
    defaultValues: { firstname: "" },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { data, isFetched, isFetching } = useQuery<AgeData>({
    queryKey: ["firstname", query],
    queryFn: ({ signal }) =>
      fetchData({ signal, url: "https://api.agify.io/", name: query }),
    refetchOnWindowFocus: false,
    enabled: !!query,
    staleTime: 120000,
  });

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setIsCancelled(false);
    const { value } = e.currentTarget;
    onChangeDebounce(value);
  };

  const handleCancelQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCancelled(true);
    queryClient.cancelQueries({ queryKey: ["firstname"] });
  };

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    if (!cancelled) {
      setQuery(data.firstname);
    } else {
      setQuery(data.firstname);
      queryClient.fetchQuery({ queryKey: ["firstname", query] });
      setIsCancelled(false);
    }
  };

  useEffect(() => {
    if (data) {
      setAge(data.age);
    }
    if (data?.age === null) {
      setAge("по данному запросу возраст не генерируется");
    }
  }, [data]);

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        Генератор возраста
      </PanelHeader>
      <Group>
        <Div>
          {errors.firstname && (
            <FormStatus header="Некорректно введены данные!" mode="error">
              {errors.firstname?.message}
            </FormStatus>
          )}
        </Div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormItem
            htmlFor="firstname"
            top="Имя (на латыни)"
            status={errors.firstname ? "error" : "default"}
          >
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="firstname"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("firstname");
                    handleChange(e);
                  }}
                />
              )}
            />
          </FormItem>
          <FormItem>
            <Button type="submit" mode="secondary" stretched>
              Определить возраст
            </Button>
          </FormItem>
          <Separator style={{ marginTop: "20px" }} />
        </form>
        <div style={{ padding: "20px 0", textAlign: "center" }}>
          <Paragraph>Ваш возраст: {isFetched && age}</Paragraph>
          {isFetching && <Loader onClick={handleCancelQuery} />}
        </div>
      </Group>
    </Panel>
  );
};

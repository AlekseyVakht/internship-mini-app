import { FC, FormEvent, useEffect, useState} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useForm,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchData } from "../utils/api";
import { schema } from "../utils/validation";

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

type FormInput = {
  firstname: string;
};

type AgeData = {
  age: number;
};

export const Generator: FC<{ id: string }> = ({ id }) => {
  const [query, setQuery] = useState("");
  const [age, setAge] = useState(0);
  const routeNavigator = useRouteNavigator();
  const onChangeDebounce = useDebouncedCallback((value) => {
    if (isValid) {
      setQuery(value);
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
    staleTime: 60000,
  });

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    onChangeDebounce(value);
  };

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setQuery(data.firstname);
  };

  useEffect(() => {
    if (data) {
      setAge(data.age);
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
          {isFetching && <Spinner size="large" style={{ marginTop: "20px" }} />}
        </div>
      </Group>
    </Panel>
  );
};

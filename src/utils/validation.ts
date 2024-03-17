import * as yup from "yup";

const regex = /^[aA-zZ]+$/;
export const schema = yup.object().shape({
  firstname: yup
    .string()
    .min(1, "Введите хотя бы одну букву")
    .matches(regex, "Имя может состоять только из латинских букв")
    .required("Кажется вы забыли ввести имя"),
});

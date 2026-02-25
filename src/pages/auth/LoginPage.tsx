import {
  Button,
  Checkbox,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { valibotResolver } from "mantine-form-valibot-resolver";
import { useNavigate } from "react-router";
import appImage from "@/assets/lg-app-logo.svg";
import {
  loginValidator,
  type LoginValidatorType,
} from "./validator/login-validator";
import { modalUtils } from "@/lib/modal-utlis";
import client, { api } from "@/lib/http-client";
import { parseError } from "@/lib/http-handlers";
import authToken from "@/lib/auth-token";
import type { LoginResponse } from "@/types/auth";

export default function Page() {
  const navigate = useNavigate();
  const form = useForm<LoginValidatorType>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: valibotResolver(loginValidator),
  });

  async function onSubmit(values: LoginValidatorType) {
    const loading = modalUtils.loading();
    try {
      const res = await client().post<LoginResponse>(api.login, {
        email: values.email,
        password: values.password,
      });
      loading.close();
      authToken.storeToken(res.data.data.token);
      navigate("/");
    } catch (error) {
      loading.close();
      parseError(error);
    }
  }

  return (
    <>
      <title>Login | POS</title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <img
          src={appImage}
          width={210}
          height={55}
          className="mx-auto mb-5 lg:mb-7"
        />
        <Text className="mb-1 text-lg font-bold lg:text-xl">
          Selamat Datang
        </Text>
        <Text className="text-dimmed mb-2.5 text-sm">
          Masuk ke akun Anda untuk melanjutkan
        </Text>
        <TextInput
          key={form.key("email")}
          {...form.getInputProps("email")}
          withAsterisk
          label="Email"
          placeholder="Masukkan email Anda"
          className="mb-1 lg:mb-2.5"
        />
        <PasswordInput
          key={form.key("password")}
          {...form.getInputProps("password")}
          withAsterisk
          label="Password"
          placeholder="Masukkan password Anda"
        />
        <div className="my-3 flex w-full items-center justify-between lg:my-4">
          <Checkbox
            key={form.key("rememberMe")}
            {...form.getInputProps("rememberMe")}
            label="Ingat saya"
          />
        </div>
        <Button type="submit" className="mb-2 w-full lg:mb-3.5">
          Masuk
        </Button>
      </form>
    </>
  );
}

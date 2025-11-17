import { Paper, Title, Stack, TextInput, PasswordInput, Button, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiLogin } from "../../api/auth";
import type { LoginPayload, User } from "../../utils/types";
import { notifications } from '@mantine/notifications';

export function LoginPage() {
    const form = useForm<LoginPayload>({
        initialValues: { email: "", password: "" },
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const loginMutation = useMutation<User, Error, LoginPayload>({
        mutationFn: apiLogin,
        onSuccess: (user) => {
            localStorage.setItem("authUser", JSON.stringify(user));
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            notifications.show({
                title: 'Успешно',
                message: 'Вы успешно авторизованы!',
                color: 'green',
            });
            navigate('/profile'); 
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Ошибка',
                message: error.message || 'Аккаунт не найден',
                color: 'red',
            });
        }
    });

    return (
        <Paper p="lg" radius="md" maw={400} mx="auto" mt={80} withBorder>
            <Title order={2} ta="center" mb="lg">
                Вход
            </Title>

            <form onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
                <Stack>
                    <TextInput label="Email" required {...form.getInputProps("email")} />
                    <PasswordInput
                        label="Пароль"
                        required
                        {...form.getInputProps("password")}
                    />

                    <Button type="submit" loading={loginMutation.isPending}>
                        Войти
                    </Button>

                    <Anchor component={Link} to="/register" ta="center">
                        Нет аккаунта? Зарегистрироваться
                    </Anchor>
                </Stack>
            </form>
        </Paper>
    );
}
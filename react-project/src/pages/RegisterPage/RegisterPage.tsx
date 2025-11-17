import { Paper, Title, Stack, TextInput, PasswordInput, Button, Group, ActionIcon } from "@mantine/core";
import { IconArrowLeft } from '@tabler/icons-react';
import { useForm, hasLength } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { apiRegister } from "../../api/auth";
import type { RegisterPayload, User } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { showNotification } from '@mantine/notifications';

export function RegisterPage() {
    const navigate = useNavigate();

    const form = useForm<RegisterPayload & { confirmPassword: string }>({
        initialValues: { email: "", password: "", confirmPassword: "", name: "" },
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: {
            name: (value) => (value.trim().length === 0 ? 'Введите имя' : null),
            email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Неверный формат email'),
            password: hasLength({ min: 6 }, 'Пароль должен быть не менее 6 символов'),
            confirmPassword: (value, values) => value !== values.password ? 'Пароли не совпадают' : null,
        },
    });

    const registerMutation = useMutation<User, Error, RegisterPayload>({
        mutationFn: apiRegister,
        onSuccess: () => {
            showNotification({
                title: 'Успешно',
                message: 'Регистрация прошла успешно!',
                color: 'green',
            });
            navigate('/login');
        },
        onError: (error: Error) => {
            showNotification({
                title: 'Ошибка',
                message: error.message || 'Не удалось зарегистрироваться',
                color: 'red',
            });
        }
    });

    return (
        <Paper p="lg" radius="md" maw={400} mx="auto" mt={80} withBorder>
            <Group mb="lg" gap={80}>
                <ActionIcon variant="outline" size="sm" onClick={() => navigate('/login')}>
                    <IconArrowLeft size={16} />
                </ActionIcon>
                <Title order={2} ta="center" mb={0}>
                    Регистрация
                </Title>
            </Group>

            <form onSubmit={form.onSubmit((v) => registerMutation.mutate(v))}>
                <Stack>
                    <TextInput
                        label="Имя"
                        required
                        {...form.getInputProps("name")}
                        error={form.errors.name}
                    />
                    <TextInput
                        label="Email"
                        required
                        {...form.getInputProps("email")}
                        error={form.errors.email}
                    />
                    <PasswordInput
                        label="Пароль"
                        required
                        {...form.getInputProps("password")}
                        error={form.errors.password}
                    />
                    <PasswordInput
                        label="Подтверждение пароля"
                        required
                        {...form.getInputProps("confirmPassword")}
                        error={form.errors.confirmPassword}
                    />
                    <Button type="submit" loading={registerMutation.isPending}>
                        Создать аккаунт
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}
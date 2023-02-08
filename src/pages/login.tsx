import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  LoginProps,
  useAuthenticationContext,
} from "@/context/AuthenticationContext";
import styles from "@/styles/Login.module.scss";
import { Form, Button } from "react-bootstrap";

const Login = () => {
  const { login, isAuthenticated, prevRoute } = useAuthenticationContext();
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginProps>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(prevRoute);
    }
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginData);
  };

  return (
    <div className={styles.loginBox}>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@example.com"
            name="email"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha"
            name="password"
            onChange={handleInputChange}
          />
          <Form.Text className="text-muted">
            A senha deve conter no minimo 8 caracteres
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Entrar
        </Button>
      </Form>
    </div>
  );
};

export default Login;

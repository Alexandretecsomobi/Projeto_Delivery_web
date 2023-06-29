import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { Button, Form, Input, Modal, Typography } from "antd";
import FormItem from "antd/es/form/FormItem";
import { api } from "../../services/api";
import { DashContext } from "../../context/dashboard.context";

type SinginTypes = {
  email: string;
  password: string;
};

export default function Header() {
  const [openModal, setOpenModal] = useState(false);
  const [load, setLoad] = useState(false);
  const [dataForm, setDataform] = useState<SinginTypes>();
  const [errmessage, setErrmessage] = useState("");

  const [form] = Form.useForm();

  const params = new URLSearchParams(window.location.search);
  const { asUser } = useContext(DashContext);

  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    if (scrollPosition !== 0) {
      document.querySelector(".header")?.setAttribute("style", "width:100%;border-radius:0");
    } else {
      document.querySelector(".header")?.setAttribute("style", "width:80%");
    }
  });
  useEffect(() => {
    if (params.get("modal")) {
      setOpenModal(true);
    }
  }, [params]);

  return (
    <header className="box-header">
      <div className="header">
        <Typography.Title
          onClick={() => (window.location.href = "/")}
          level={2}
          style={{ color: "#fff" }}
        >
          SmartDelivery
        </Typography.Title>
        <div className="nav-btns">
          <button onClick={() => (window.location.href = "/")}>Inicio</button>
          <button onClick={() => (window.location.href = "/sobrenos")}>Quem somos</button>
          <button>Ajuda</button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
            }}
          >
            {!asUser ? (
              <Button onClick={() => setOpenModal(true)}>Entrar</Button>
            ) : (
              <Button onClick={() => (window.location.href = `/dashboard/${asUser?.name_company}`)}>
                Ir para o dashboard
              </Button>
            )}
            <Modal
              closable={false}
              style={{ padding: "20px" }}
              open={openModal}
              okText={load ? "Entrando..." : "Entrar"}
              onCancel={() => {
                setOpenModal(false);
              }}
              onOk={async () => {
                if (!form.getFieldValue("email") && !form.getFieldValue("password")) {
                  setErrmessage("Preencha todos os campos");
                  return;
                }
                setLoad(true)
                  await api
                    .post("/singin", {
                      email: form.getFieldValue("email"),
                      password: form.getFieldValue("password"),
                    })
                    .then((response) => {
                      localStorage.setItem("@sessionDelivery", JSON.stringify(response.data));
                      setLoad(false);
                      window.location.href = `/dashboard/${response.data?.name_company}`;
                    })
                    .catch((err) => {
                      document.getElementById("err")?.setAttribute("style", "display:flex");
                      setErrmessage("Dados inválidos ou não cadastrados!");
                      console.log(err);
                      setLoad(false);
                    });

                  setLoad(true);
                }
              }
            >
              <Typography.Title level={3}>Fazer login</Typography.Title>
              <Form form={form} onFinish={(data) => setDataform(data)}>
                <FormItem name={"email"}>
                  <Input placeholder="Digite seu email"></Input>
                </FormItem>
                <FormItem name={"password"}>
                  <Input placeholder="Digite sua senha"></Input>
                </FormItem>
                <Button type="link" href="#">
                  Esqueci minha senha
                </Button>
                <span id="err">{errmessage}</span>
              </Form>
            </Modal>
          </div>
          <a href="/cadastro">Cadastre-se</a>
        </div>
      </div>
    </header>
  );
}

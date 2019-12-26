import React, { Fragment, useState, useMemo, useEffect } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import "./Home.css";
import { flowRight } from "lodash";
import { MdPersonAdd } from "react-icons/md";
import Image from "../components/Image";
import socketio from "socket.io-client";
import ImagePrev from "../components/ImagePrev";

function Home(props) {
  const [Result, SetResult] = useState("");
  const [Contatos, SetContatos] = useState("");
  const [name, SetName] = useState("");
  const [image, SetImage] = useState("");
  const [src, SetSrc] = useState("");
  const { id: user_id } = props.match.params;
  const socket = useMemo(
    () =>
      socketio("https://backend-realtime.herokuapp.com/", {
        query: {
          user_id
        }
      }),
    [user_id]
  );

  useEffect(() => {
    async function componentDidMount() {
      props.MessageUser.subscribeToMore({
        document: subscriptionMessage,
        variables: {
          id: props.match.params.id
        },
        updateQuery: (prev, { subscriptionData }) => {
          const { conversa } = subscriptionData.data.userMessage;
          // console.log(conversa);
          document.getElementById("receiveHome").play();
          SetResult(conversa);
        }
      });
    }
    componentDidMount();
  }, [props.MessageUser, props.match.params.id]);

  useEffect(() => {
    async function componentWillMouns() {
      const { id: user_id } = props.match.params;
      // const socket = socketio("http://192.168.1.10:3333", {
      //   query: { user_id }
      // });

      props.MessageUser.refetch({
        variables: {
          id: props.match.params.id
        }
      });

      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        (async () => {
          const { data } = await props.confirmToken({
            variables: {
              token
            }
          });

          const { error } = data.verifyToken;
          if (error) {
            props.history.push("/");
          }
        })();
      } else {
        props.history.push("/");
      }
      const { id } = props.match.params;
      const resultMessages = await props.Message({
        variables: {
          id
        }
      });
      const result = resultMessages.data.User;
      const { contatos } = result.user;
      const { name } = result.user;

      const { conversa } = result;

      SetResult(conversa);
      SetContatos(contatos);
      SetName(name);
    }
    componentWillMouns();
  }, [props]);

  function handleConversa(id, idCntt) {
    const idUser = props.match.params.id;
    localStorage.setItem("id", idUser);
    props.history.push(`/conversa/${id}/${idUser}/${idCntt}`);
  }

  async function handleCreateChat(idContt) {
    const { id } = props.match.params;
    const { data } = await props.newChat({
      variables: {
        create: id,
        participante2: idContt
      }
    });
    const idChat = data.createConversa.id;

    props.history.push(`/conversa/${idChat}/${id}/${idContt}`);
  }

  function renderContatos() {
    return (
      <Fragment>
        <div id="left">
          <div className="containerAdd">
            <div className="add">
              <MdPersonAdd
                className="addPerson"
                size={35}
                color="#fff"
                onClick={() =>
                  props.history.push(`/add/${props.match.params.id}`)
                }
              />
            </div>
          </div>
          {Array.isArray(Contatos)
            ? Contatos.map(element => (
                <div className="cont" key={element.id}>
                  <Image src={element.image} />
                  <div
                    className="ContainerConversa"
                    onClick={() => handleCreateChat(element.id)}
                  >
                    <div className="ch">
                      <div className="contato">{element.name}</div>
                    </div>

                    <div className="mensagem">
                      {element.bio.length < 30
                        ? element.bio
                        : element.bio.replace(element.bio.slice(30), "...")}
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </Fragment>
    );
  }
  function renderConversas() {
    return (
      <Fragment>
        {Array.isArray(Result)
          ? Result.length > 0
            ? Result[0].mensagens.length > 0
              ? Result.map(element => (
                  <div className="mensagemContainer" key={element.id}>
                    {console.log(element)}
                    <div
                      className="imageContato"
                      onClick={() =>
                        handleImage(
                          props.match.params.id === element.create.id
                            ? element.participante2.image
                            : element.create.image
                        )
                      }
                    >
                      <Image
                        src={
                          props.match.params.id === element.create.id
                            ? element.participante2.image
                            : element.create.image
                        }
                      />
                    </div>
                    <div
                      className="containerMessages"
                      onClick={() =>
                        handleConversa(
                          element.id,
                          props.match.params.id === element.create.id
                            ? element.participante2.id
                            : element.create.id
                        )
                      }
                    >
                      <div className="name">
                        {props.match.params.id === element.create.id
                          ? element.participante2.name
                          : element.create.name}
                        <div className="hora">
                          {/* Vai ser bem aqui as opções */}
                          {element.hour[element.hour.length - 1]}
                        </div>
                      </div>
                      <div className="messageReceiver">
                        {element.mensagens[element.mensagens.length - 1]
                          .length < 30
                          ? element.mensagens[element.mensagens.length - 1]
                          : element.mensagens[
                              element.mensagens.length - 1
                            ].replace(
                              element.mensagens[
                                element.mensagens.length - 1
                              ].slice(30),
                              "..."
                            )}
                      </div>
                    </div>
                  </div>
                ))
              : ""
            : ""
          : ""}
      </Fragment>
    );
  }

  function handleImage(src) {
    document.getElementById("menu").style.zIndex = 0;
    SetImage(true);
    SetSrc(src);
  }
  function handleNoImage() {
    document.getElementById("menu").style.zIndex = 1;
    SetImage(false);
    SetSrc("");
  }

  function renderImage() {
    return (
      <div className="containerImage" onClick={() => handleNoImage()}>
        <ImagePrev src={src} />
      </div>
    );
  }

  function positionCnt() {
    document.getElementById("left").style.left = "0";
    document.getElementById("conversaPosition").style.right = "100%";
    document.getElementById("btnCnt").style.color = "rgba(255, 255, 255, 1)";
    document.getElementById("btnCnv").style.color = "rgba(255, 255, 255, .8)";
  }
  function positionCnv() {
    document.getElementById("left").style.left = "-100%";
    document.getElementById("conversaPosition").style.right = "0";
    document.getElementById("btnCnt").style.color = "rgba(255, 255, 255, .8)";
    document.getElementById("btnCnv").style.color = "rgba(255, 255, 255, 1)";
  }
  return (
    <Fragment>
      <div>{image && renderImage()}</div>
      <div className="menu" id="menu">
        <div className="conversas" id="btnCnv" onClick={() => positionCnv()}>
          Conversas
        </div>
        <div className="contatos" id="btnCnt" onClick={() => positionCnt()}>
          Contatos
        </div>
      </div>
      <div className="body">
        <div className="cnv" id="conversaPosition">
          {renderConversas()}
        </div>
        <div className="cnv" id="contatoPosition">
          {renderContatos()}
        </div>
      </div>
    </Fragment>
  );
}

const verifyToken = gql`
  mutation($token: String!) {
    verifyToken(token: $token) {
      id
      error
      ok
    }
  }
`;
const mensagens = gql`
  mutation($id: String!) {
    User(id: $id) {
      user {
        name
        image
        id
        contatos {
          name
          id
          image
          bio
        }
      }
      conversa {
        id
        transmissor {
          name
        }
        create {
          name
          id
          image
        }
        participante2 {
          name
          id
          image
        }
        mensagens
        hour
        receptor {
          name
        }
      }
    }
  }
`;

const UserConversa = gql`
  query($id: String) {
    User(id: $id) {
      user {
        name
        image
        id
      }
      conversa {
        id
        transmissor {
          name
        }
        create {
          name
          id
          image
        }
        participante2 {
          name
          id
          image
        }
        mensagens
        hour
        receptor {
          name
        }
      }
    }
  }
`;
const subscriptionMessage = gql`
  subscription($id: ID!) {
    userMessage(id: $id) {
      name
      image
      id

      conversa {
        id
        transmissor {
          name
        }
        create {
          name
          id
          image
        }
        participante2 {
          name
          id
          image
        }
        mensagens
        hour
        receptor {
          name
        }
      }
    }
  }
`;

const createConversa = gql`
  mutation($create: ID!, $participante2: ID!) {
    createConversa(create: $create, participante2: $participante2) {
      id
    }
  }
`;

export default flowRight(
  graphql(verifyToken, { name: "confirmToken" }),
  graphql(mensagens, { name: "Message" }),
  graphql(UserConversa, { name: "MessageUser" }),
  graphql(createConversa, { name: "newChat" })
)(Home);

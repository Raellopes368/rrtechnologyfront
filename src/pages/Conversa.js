import React, { useEffect, Fragment, useState, useMemo } from "react";
// import { request} from "graphql-request";
import "./Conversa.css";
// import { Subscription } from "react-apollo";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import "./Home.css";
import { flowRight } from "lodash";
import { MdSend, MdArrowBack } from "react-icons/md";
import { ImagemContt } from "../components/Imagem";
import io from "socket.io-client";

// &crarr; &#8617;

function Conversa(props) {
  const [Conversa, setConversa] = useState("");
  const [info, setInfo] = useState("");
  const [situation, setSituation] = useState("");
  const [user, setUser] = useState("");
  const [indexView, setIndexView] = useState(null);
  const [indexViewOpt, setIndexViewOpt] = useState(null);
  const [optionsView, setOptionsView] = useState(false);
  const [optView, setOptView] = useState(false);
  const [classN, setClass] = useState("");
  const [indexDelete, setIndexDelete] = useState(null);
  const [deleteView, setDeleteView] = useState(false);
  const [response, setResponse] = useState("");
  const { idUser: user_id, idCntt: contt_id } = props.match.params;
  function options(index, classNm) {
    setClass(classNm);
    setIndexView(index);
    setIndexDelete(indexView);
    setOptView(true);
  }
  function optionView(index) {
    setOptionsView(true);
    setIndexViewOpt(index);
  }
  function noViewOptions() {
    if (!optView) {
      setOptionsView(false);
      setIndexView(null);
    }
  }
  function closeOptions() {
    if (optView) {
      setOptView(false);
      setIndexView(null);
    }
  }
  function cancelOptions() {
    setDeleteView(false);
    setOptionsView(false);
    setOptView(false);
    setIndexDelete(null);
  }
  function DeleteForAll() {
    const { idUser, id } = props.match.params;
    props.mutationDeleteForAll({
      variables: {
        idUser: idUser.toString(),
        position: indexDelete,
        idChat: id.toString()
      }
    });
    setDeleteView(false);
    setOptionsView(false);
    setOptView(false);
    setIndexDelete(null);
  }
  function DeleteForMe() {
    const { idUser, id } = props.match.params;
    props
      .mutationDeleteForMe({
        variables: {
          idUser: idUser.toString(),
          position: indexDelete,
          idChat: id.toString()
        }
      })
      .then(data => {
        const { DeleteForMe } = data.data;
        console.log(DeleteForMe);
        setConversa(DeleteForMe);
      });
    setDeleteView(false);
    setOptionsView(false);
    setOptView(false);
    setIndexDelete(null);
  }
  function handleResponse(message) {
    setResponse(message);
  }
  const socket = useMemo(
    () =>
      io("https://backend-realtime.herokuapp.com/", {
        query: {
          user_id,
          contt_id
        }
      }),
    [contt_id, user_id]
  );
  function renderOptions(index, message) {
    return (
      <div className="opt">
        <div
          className="delete"
          onClick={() => {
            setDeleteView(true);
          }}
        >
          Apagar
        </div>
        <div className="reply" onClick={() => handleResponse(message)}>
          Responder &#8617;
        </div>
      </div>
    );
  }

  function renderDelete() {
    return (
      <div className="containerDelete">
        <div className="optionsDelete">
          {classN === "transmissor" && (
            <div className="deleteAll" onClick={() => DeleteForAll()}>
              Apagar para todos
            </div>
          )}
          <div className="cancel" onClick={() => cancelOptions()}>
            Cancelar
          </div>
          <div className="deleteForMe" onClick={() => DeleteForMe()}>
            Apagar pra mim
          </div>
        </div>
      </div>
    );
  }
  function digitando() {
    socket.emit("Situation", { contt_id, data: "escrevendo..." });
  }
  socket.emit("Situation", { contt_id, data: "Online" });
  useEffect(() => {
    socket.on("Situation", sit => {
      setSituation(sit);
    });
  }, [socket]);
  useEffect(() => {
    async function componentWillMount() {
      props.ConversaSub.refetch({
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
      const resultMessages = await props.ConversaMutation({
        variables: {
          id: props.match.params.id
        }
      });
      const { Conversa } = resultMessages.data;
      // console.log(Conversa)
      if (props.match.params.idCntt === Conversa.create.id) {
        setInfo(Conversa.create);
        setUser(Conversa.participante2);
      } else {
        setInfo(Conversa.participante2);
        setUser(Conversa.create);
      }
      setConversa(Conversa);
    }
    componentWillMount();
  }, [props]);

  function renderInformation() {
    return (
      <div className="containerInformation">
        <Fragment>
          <div className="informacoes">
            <div className="voltar" onClick={() => props.history.goBack()}>
              <MdArrowBack size={30} color="#fff" />
            </div>
            <div className="img">
              <ImagemContt src={info.image} />
            </div>
          </div>
          <div className="info">
            <div className="nome">{info.name}</div>
            <div className="online">{situation}</div>
          </div>
        </Fragment>
      </div>
    );
  }

  async function handleMensage() {
    const msg = document.getElementById("msg");
    let mensagem = msg.value;
    const resposta = response ? response : "";
    setResponse("");
    msg.value = "";
    const { idUser, idCntt, id } = props.match.params;
    // console.log(idUser)
    if (mensagem.length > 0) {
      props.newMessage({
        variables: {
          id: id,
          transmissor: idUser,
          receptor: idCntt,
          userID: idUser,
          mensagem,
          resposta
        }
      });
      socket.emit("Situation", { contt_id, data: "Online" });
    } else console.log("nao");
  }

  function renderMensagens() {
    return (
      <div
        className="conversa"
        id="conversaRolagem"
        onClick={() => closeOptions()}
      >
        {Conversa.mensagens
          ? Conversa.mensagens.map((conversa, indice) => (
              <Fragment key={indice}>
                {Conversa.deleteAlls[indice].ok &&
                !(
                  Conversa.deleteFor[indice].id1 ===
                    props.match.params.idUser ||
                  Conversa.deleteFor[indice].id2 === props.match.params.idUser
                ) ? (
                  <div
                    onMouseOver={() => optionView(indice)}
                    onMouseOut={() => {
                      noViewOptions();
                    }}
                    className={
                      Conversa.transmissor[indice].id ===
                      props.match.params.idUser
                        ? "transmissor"
                        : "receptor"
                    }
                    key={indice}
                  >
                    <div className="apagada">㊀ Essa mensagem foi apagada</div>
                    {optionsView && indexViewOpt === indice && (
                      <div
                        className="options"
                        onMouseEnter={() => optionView(indice)}
                        onClick={() =>
                          options(
                            indice,
                            Conversa.transmissor[indice].id ===
                              props.match.params.idUser
                              ? "transmissor"
                              : "receptor"
                          )
                        }
                      >
                        ⌣
                        {optView &&
                          indexView === indice &&
                          renderOptions(indice)}
                      </div>
                    )}
                  </div>
                ) : Conversa.deleteFor[indice].id1 ===
                    props.match.params.idUser ||
                  Conversa.deleteFor[indice].id2 ===
                    props.match.params.idUser ? (
                  ""
                ) : (
                  <div
                    onMouseOver={() => optionView(indice)}
                    onMouseOut={() => {
                      noViewOptions();
                    }}
                    className={
                      Conversa.transmissor[indice].id ===
                      props.match.params.idUser
                        ? "transmissor"
                        : "receptor"
                    }
                    key={indice}
                  >
                    {Conversa.respostas[indice] !== "" && (
                      <div className="response">
                        {Conversa.respostas[indice]}
                      </div>
                    )}
                    {conversa}{" "}
                    {optionsView && indexViewOpt === indice && (
                      <div
                        className="options"
                        onMouseEnter={() => optionView(indice)}
                        onClick={() =>
                          options(
                            indice,
                            Conversa.transmissor[indice].id ===
                              props.match.params.idUser
                              ? "transmissor"
                              : "receptor"
                          )
                        }
                      >
                        ⌣
                        {optView &&
                          indexView === indice &&
                          renderOptions(indice, conversa)}
                      </div>
                    )}
                    <div className="hourMsg">{Conversa.hour[indice]}</div>
                  </div>
                )}
              </Fragment>
            ))
          : ""}
      </div>
    );
  }

  useEffect(() => {
    async function componentDidMount() {
      // console.log(props)

      props.ConversaSub.subscribeToMore({
        document: SubscriptionTeste,
        variables: {
          id: props.match.params.id
        },
        updateQuery: (prev, { subscriptionData }) => {
          const { novaMensagem } = subscriptionData.data;
          if (
            novaMensagem.transmissor[novaMensagem.receptor.length - 1].id ===
            props.match.params.idUser
          ) {
            // document.getElementById("envia").play();
          } else {
            // document.getElementById("recebe").play();
          }
          setConversa(novaMensagem);
        }
      });
    }
    componentDidMount();
  }, [props.ConversaSub, props.match.params.id, props.match.params.idUser]);
  return (
    <Fragment>
      {renderInformation()}
      <div className="containerConversa">
        <div className="containerConversa2" id="containerConversa">
          {renderMensagens()}
        </div>
      </div>
      {response !== "" && (
        <div className="containerResponse">
          <div className="replyng">
            {response}
            <div className="cancelar" onClick={() => setResponse("")}>
              x
            </div>
          </div>
        </div>
      )}
      <div className="containerEnviar">
        <textarea
          rows="2"
          id="msg"
          className="mensagem"
          placeholder="Digite aqui..."
          onChange={() => digitando()}
        ></textarea>
        <div className="button" onClick={() => handleMensage()}>
          <MdSend size={25} color="#fff" />
        </div>
      </div>
      {deleteView && renderDelete()}
    </Fragment>
  );
}

const queryConversa = gql`
  mutation($id: ID!) {
    Conversa(id: $id) {
      hour
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
      receptor {
        name
        id
      }
      transmissor {
        name
        id
      }
      mensagens
      respostas
      deleteAlls {
        ok
      }
      deleteFor {
        id1
        id2
      }
    }
  }
`;

const queryConversaSub = gql`
  query($id: ID) {
    Conversa(id: $id) {
      hour
      create {
        name
        id
        image
      }
      deleteFor {
        id1
        id2
      }
      deleteAlls {
        ok
      }
      participante2 {
        name
        id
        image
      }
      receptor {
        name
        id
      }
      transmissor {
        name
        id
      }
      mensagens
      respostas
    }
  }
`;

const verifyToken = gql`
  mutation($token: String!) {
    verifyToken(token: $token) {
      id
      error
      ok
    }
  }
`;

const novaMensagem = gql`
  mutation(
    $id: ID!
    $transmissor: ID!
    $receptor: ID!
    $mensagem: String
    $userID: ID!
    $resposta: String
  ) {
    createMensagem(
      id: $id
      transmissor: $transmissor
      receptor: $receptor
      mensagem: $mensagem
      userID: $userID
      resposta: $resposta
    ) {
      transmissor {
        name
      }
      receptor {
        name
      }
      mensagens
      respostas
    }
  }
`;

const SubscriptionTeste = gql`
  subscription($id: ID!) {
    novaMensagem(id: $id) {
      hour
      create {
        name
        id
      }
      participante2 {
        name
        id
      }
      receptor {
        name
        id
      }
      transmissor {
        name
        id
      }
      mensagens
      respostas
      deleteFor {
        id1
        id2
      }
      deleteAlls {
        ok
      }
    }
  }
`;
const deleteForMeMutation = gql`
  mutation($idChat: String!, $position: Int!, $idUser: String!) {
    DeleteForMe(idChat: $idChat, position: $position, idUser: $idUser) {
      hour
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
      receptor {
        name
        id
      }
      transmissor {
        name
        id
      }
      mensagens
      respostas
      deleteAlls {
        ok
      }
      deleteFor {
        id1
        id2
      }
    }
  }
`;

const forAll = gql`
  mutation($position: Int!, $idChat: ID!, $idUser: ID!) {
    DeleteForAll(position: $position, idChat: $idChat, idUser: $idUser) {
      status
    }
  }
`;
// console.log(Subscription)
export default flowRight(
  graphql(verifyToken, { name: "confirmToken" }),
  graphql(queryConversa, { name: "ConversaMutation" }),
  graphql(novaMensagem, { name: "newMessage" }),
  graphql(queryConversaSub, { name: "ConversaSub" }),
  graphql(deleteForMeMutation, { name: "mutationDeleteForMe" }),
  graphql(forAll, { name: "mutationDeleteForAll" })
)(Conversa);

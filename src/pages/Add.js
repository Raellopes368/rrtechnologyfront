import React, { Component, Fragment } from "react";
import { MdArrowBack, MdSearch } from "react-icons/md";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { flowRight } from "lodash";
import Image from "../components/Image";
import "./Add.css";

class Add extends Component {
  state = {
    contato: "",
    Result: ""
  };
  handleSearch = async () => {
    document.getElementById("buscaCntt").value = "";
    const { data } = await this.props.Search({
      variables: {
        name: this.state.contato
      }
    });
    const { Contato } = data;
    // console.log(data)
    this.setState({ Result: Contato });
  };
  selectedContact = async (idUser, idContt) => {
    await this.props.Contact({
      variables: {
        contato: idContt,
        idUser
      }
    });
  };
  renderContatos = () => (
    <Fragment>
      {Array.isArray(this.state.Result) ? (
        this.state.Result[0].error ? (
          <div className="error">{this.state.Result[0].error}!</div>
        ) : (
          this.state.Result.map(element => (
            <div className="cont" key={element.id}>
              <Image src={element.image} />
              <div className="ContainerConversa">
                <div className="ch">
                  <div className="contato">{element.name}</div>
                  <div
                    className="AddContato"
                    onClick={() =>
                      this.selectedContact(
                        this.props.match.params.id,
                        element.id
                      )
                    }
                  >
                    +
                  </div>
                </div>

                <div className="message">
                  {element.bio.length < 30
                    ? element.bio
                    : element.bio.replace(element.bio.slice(35), "...")}
                </div>
              </div>
            </div>
          ))
        )
      ) : (
        ""
      )}
    </Fragment>
  );
  render() {
    return (
      <Fragment>
        <div className="menuAdd">
          <div className="containerMenu">
            <div className="contatos" id="btnCnt">
              <div className="back"></div>
              <MdArrowBack
                size="30"
                color="#fff"
                className="md"
                onClick={() => this.props.history.goBack()}
              />{" "}
              Adicionar contatos
            </div>
            <div className="busca">
              <input
                type="text"
                className="buscaCntt"
                id="buscaCntt"
                placeholder="Buscar"
                onKeyPress={e => {
                  if (e.which === 13 && e.target.value !== "") {
                    this.handleSearch();
                  }
                }}
                onChange={e => this.setState({ contato: e.target.value })}
              />
              <MdSearch
                size="33"
                color="#fff"
                className="search"
                onClick={() => this.handleSearch()}
              />
            </div>
          </div>
        </div>
        <div className="body">
          <div className="containerContatos">
            <div className="cnv">{this.renderContatos()}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const searchMutation = gql`
  mutation($name: String!) {
    Contato(name: $name) {
      name
      id
      image
      error
      bio
    }
  }
`;
const addContact = gql`
  mutation($contato: ID!, $idUser: ID!) {
    createContato(contato: $contato, idUser: $idUser) {
      error
    }
  }
`;
export default flowRight(
  graphql(addContact, { name: "Contact" }),
  graphql(searchMutation, { name: "Search" })
)(Add);

import React, { Fragment, Component } from "react";
import gql from "graphql-tag";
import "./Login.css";
import { graphql } from "react-apollo";

class Login extends Component {
  state = {
    newName: "",
    newPass: "",
    newData: "",
    newError: ""
  };
  handleSubmint = async () => {
    const { newName, newPass } = this.state;
    let { data } = await this.props.LoginQuery({
      variables: { name: newName, pass: newPass }
    });

    this.setState({ newData: data });
  };

  render() {
    let error = "";
    if (this.state.newData) {
      const { Login } = this.state.newData;
      if (Login.token) {
        localStorage.setItem("token", `Bearer ${Login.token}`);
        this.props.history.push(`/home/${Login.user.id}`);
      }
      error = Login.error;
    }

    return (
      <Fragment>
        <div className="container">
          <div className="form">
            {error !== "" ? <p className="error">{error}</p> : <p></p>}
            <input
              placeholder="Nome de usuário"
              value={this.state.newName}
              onChange={e => this.setState({ newName: e.target.value })}
            />
            <input
              type="password"
              placeholder="Sua Senha"
              value={this.state.newPass}
              onChange={e => this.setState({ newPass: e.target.value })}
            />

            <input
              type="button"
              value="Entrar"
              className="buttom"
              onClick={this.handleSubmint}
            />
            <div className="inscrever">
              <p>
                Ainda não possui conta?
                <a target="" href="/register">
                  Inscreva-se
                </a>
              </p>
              <p className="copy">R & R Technology &copy;</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const LoginQuery = gql`
  mutation Login($name: String!, $pass: String!) {
    Login(name: $name, pass: $pass) {
      user {
        id
      }
      token
      error
    }
  }
`;
export default graphql(LoginQuery, { name: "LoginQuery" })(Login);
